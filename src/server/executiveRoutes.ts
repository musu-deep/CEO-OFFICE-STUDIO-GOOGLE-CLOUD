import { Router } from 'express';
import crypto from 'node:crypto';
import { ExecutiveStore, validateGrant } from './executiveStore';
import { entities, emptyRecord, actions, type Action } from '../lib/executiveModel';
export const executiveStore=new ExecutiveStore();
export const actorOf=(req:any)=>req.auth as {email:string;role:string};
export function createExecutiveRouter(){
 const router=Router();
 router.use((_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
 const handler=(fn:any)=>(req:any,res:any)=>{try{return fn(req,res);}catch(e:any){res.status(e.status||400).json({error:e.message||'تعذر تنفيذ الطلب.'});}};
 router.get('/state',handler((req:any,res:any)=>{
  const actor=actorOf(req),s=executiveStore.read(),list=entities().filter(e=>actions.some(a=>executiveStore.can(actor,e.id,a)));
  const isOffice=['ceo','admin'].includes(actor.role);
  const visible=Object.fromEntries(list.filter(e=>executiveStore.can(actor,e.id,'read')).map(e=>{const r=s.units[e.id]||emptyRecord();return [e.id,{...r,directives:r.directives.filter(d=>isOffice||d.assigneeEmail===actor.email)}];}));
  const objectiveIds=new Set(Object.values(visible).flatMap((r:any)=>[r.approved,r.pending].filter(Boolean).flatMap(x=>x.snapshot.metrics.map(m=>m.objectiveId))));
  res.json({entities:list.map(e=>({...e,children:undefined})),units:visible,objectives:isOffice?s.objectives:s.objectives.filter(o=>objectiveIds.has(o.id)),permissions:Object.fromEntries(list.map(e=>[e.id,actions.filter(a=>executiveStore.can(actor,e.id,a))])),manage:actor.role==='admin'||actor.role==='ceo',storage:{shared:true,persistentConfigured:!!process.env.EXECUTIVE_DATA_DIR},providerConfigured:!!process.env.GEMINI_API_KEY&&process.env.GEMINI_API_KEY!=='MY_GEMINI_API_KEY'});
 }));
 router.get('/units/:id',handler((req:any,res:any)=>{const actor=actorOf(req),id=req.params.id;if(!executiveStore.can(actor,id,'read')&&!executiveStore.can(actor,id,'upload')&&!executiveStore.can(actor,id,'edit'))return res.status(403).json({error:'هذه الجهة خارج نطاق صلاحياتك.'});res.json({record:executiveStore.can(actor,id,'read')?(()=>{const r=executiveStore.read().units[id]||emptyRecord();return {...r,directives:r.directives.filter(d=>['ceo','admin'].includes(actor.role)||d.assigneeEmail===actor.email)};})():emptyRecord(),permissions:actions.filter(a=>executiveStore.can(actor,id,a))});}));
 router.post('/units/:id/draft',handler((req:any,res:any)=>{const actor=actorOf(req),id=req.params.id;executiveStore.saveDraft(actor,id,req.body.snapshot,req.body.version,typeof req.body.source==='string'?req.body.source.slice(0,200):'إدخال مسؤول الجهة');res.json({ok:true});}));
 router.post('/units/:id/review',handler((req:any,res:any)=>{
  const actor=actorOf(req),id=req.params.id,action=req.body.action;
  const permission:Action=action==='approve'?'approve':'review';
  if(!['approve','review','return'].includes(action)||!executiveStore.can(actor,id,permission))return res.status(403).json({error:'لا تملك صلاحية هذا الإجراء.'});
  executiveStore.update(s=>{const r=s.units[id];if(!r?.pending||r.version!==req.body.version)throw Object.assign(Error('تغيرت المسودة. حدّث البيانات.'),{status:409});if(action==='approve'&&r.pending.state!=='reviewed')throw Error('يجب مراجعة المسودة قبل اعتمادها.');r.pending.reviewer=actor.email;r.pending.reviewedAt=new Date().toISOString();r.pending.note=String(req.body.note||'').slice(0,2000);r.pending.state=action==='approve'?'approved':action==='review'?'reviewed':'returned';if(action==='approve'){if(r.approved)r.history.unshift(r.approved);r.approved=r.pending;delete r.pending;}r.history=r.history.slice(0,100);r.version++;executiveStore.audit(s,actor.email,action,id);});res.json({ok:true});
 }));
 router.post('/units/:id/directives',handler((req:any,res:any)=>{
  const actor=actorOf(req),id=req.params.id;if(!executiveStore.can(actor,id,'direct'))return res.status(403).json({error:'لا تملك صلاحية التوجيه.'});
  const {title,owner,due,status,directiveId}=req.body;
  executiveStore.update(s=>{const r=s.units[id]||emptyRecord();if(directiveId){const d=r.directives.find(d=>d.id===directiveId);if(!d||!['open','working','closed'].includes(status))throw Error('توجيه غير صالح.');d.status=status;}else{if(typeof title!=='string'||!title.trim()||typeof owner!=='string'||!owner.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(due))throw Error('أكمل التوجيه والمسؤول والموعد.');r.directives.unshift({id:crypto.randomUUID(),title:title.slice(0,1000),owner:owner.slice(0,200),due,status:'open',createdAt:new Date().toISOString(),author:actor.email});}r.version++;s.units[id]=r;executiveStore.audit(s,actor.email,'تحديث توجيه',id);});res.json({ok:true});
 }));
 router.get('/units/:id/documents/:docId',handler((req:any,res:any)=>{const actor=actorOf(req),id=req.params.id;if(!executiveStore.can(actor,id,'read'))return res.status(403).json({error:'غير مصرح.'});const doc=executiveStore.read().units[id]?.documents.find(d=>d.id===req.params.docId);if(!doc)return res.status(404).json({error:'المستند غير موجود.'});res.setHeader('Content-Type',doc.mimeType);res.setHeader('Content-Disposition',`attachment; filename*=UTF-8''${encodeURIComponent(doc.name)}`);res.send(executiveStore.bytes(doc.id));}));
 router.get('/administration',handler((req:any,res:any)=>{const a=actorOf(req);if(!['ceo','admin'].includes(a.role))return res.status(403).json({error:'غير مصرح.'});const s=executiveStore.read();res.json({grants:s.grants,audit:s.audit.slice(0,200)});}));
 router.post('/grants',handler((req:any,res:any)=>{const a=actorOf(req);if(!['ceo','admin'].includes(a.role))return res.status(403).json({error:'غير مصرح.'});const email=String(req.body.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('بريد غير صالح.');const grant=validateGrant(req.body.grant);executiveStore.update(s=>{s.grants[email]=grant;executiveStore.audit(s,a.email,`تعديل صلاحيات ${email}`);});res.json({ok:true});}));
 router.post('/objectives',handler((req:any,res:any)=>{const a=actorOf(req);if(!['ceo','admin'].includes(a.role))return res.status(403).json({error:'غير مصرح.'});const {title,target,owner}=req.body;if(typeof title!=='string'||!title.trim()||typeof target!=='string'||typeof owner!=='string')throw Error('أكمل الهدف والمستهدف والمسؤول.');executiveStore.update(s=>{s.objectives.push({id:crypto.randomUUID(),title:title.slice(0,400),target:target.slice(0,200),owner:owner.slice(0,200)});executiveStore.audit(s,a.email,'إضافة هدف استراتيجي');});res.json({ok:true});}));
 router.get('/backup',handler((req:any,res:any)=>{if(!['ceo','admin'].includes(actorOf(req).role))return res.status(403).json({error:'غير مصرح.'});res.attachment('araak-executive-backup.json').json(executiveStore.read());}));
 return router;
}
