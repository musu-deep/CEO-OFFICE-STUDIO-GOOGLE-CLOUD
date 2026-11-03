import { Router } from 'express';
import { executiveStore } from './storeContext';
import { actorOf } from './executiveRoutes';
import { resolveEntity } from '../lib/executiveModel';
export const participationOf=(req:any)=>req.auth?.participation||'direct';
export const officeActor=(req:any)=>['ceo','admin'].includes(actorOf(req).role);
export function unitClosed(req:any,id:string){return !officeActor(req)&&!!executiveStore.read().platformSettings?.closedUnits?.includes(id);}
export function createPlatformAdministrationRouter(){
 const router=Router();
 router.use((req,res,next)=>officeActor(req)?next():res.status(403).json({error:'إدارة المنصة متاحة للآدمن فقط.'}));
 const handle=(fn:any)=>(req:any,res:any)=>{try{return fn(req,res);}catch(e:any){return res.status(e.status||400).json({error:e.message||'تعذر تنفيذ الإجراء.'});}};
 router.get('/',handle((_req:any,res:any)=>{
  const s=executiveStore.read();
  const content=[
   ...Object.values(s.businessRecords||{}).flat().map(r=>({kind:'business',id:r.id,unitId:r.unitId,title:r.title,author:r.author,status:'published',version:r.version,detail:r.values})),
   ...(s.reports||[]).map(r=>({kind:'report',id:r.id,unitId:r.unitId,title:r.title,author:r.author,status:r.status,detail:r.summary})),
   ...Object.entries(s.units).flatMap(([unitId,r])=>[
    ...r.documents.map(d=>({kind:'document',id:d.id,unitId,title:d.name,author:d.author,status:d.moderation||'stored',detail:d.moderationNote||d.mimeType})),
    ...r.directives.map(d=>({kind:'task',id:d.id,unitId,title:d.title,author:d.author,status:d.status,detail:d.owner}))]),
   ...(s.platformSettings?.pendingRecords||[]).map(p=>({kind:'pending',id:p.record.id,unitId:p.record.unitId,title:p.record.title,author:p.record.author,status:p.status||'pending',version:p.record.version,detail:{...p.record.values,...(p.note?{'ملاحظة المراجع':p.note}:{})}}))
  ];
  res.json({settings:s.platformSettings||{},content,audit:s.audit.slice(0,200)});
 }));
 router.post('/settings',handle((req:any,res:any)=>{
  const {registration,closedUnits,disabledAgents}=req.body||{};
  if(!['approval','automatic','closed'].includes(registration)||![closedUnits,disabledAgents].every(a=>Array.isArray(a)&&a.every(id=>typeof id==='string'&&!!resolveEntity(id))))throw Error('إعدادات غير صالحة.');
  executiveStore.update(s=>{s.platformSettings={...s.platformSettings,registration,closedUnits:[...new Set(closedUnits)] as string[],disabledAgents:[...new Set(disabledAgents)] as string[]};executiveStore.audit(s,actorOf(req).email,'تعديل سياسة التسجيل وإغلاق الجهات والوكلاء');});res.json({ok:true});
 }));
 router.post('/content/action',handle((req:any,res:any)=>{
  const {kind,id,unitId,action,version}=req.body||{};
  if(!['delete','approve','return','close','reopen'].includes(action)||!resolveEntity(unitId))throw Error('إجراء غير صالح.');
  if(action==='return'&&(typeof req.body.note!=='string'||!req.body.note.trim()||req.body.note.length>2000))throw Error('أضف سبب الإعادة بحد أقصى 2000 حرف.');
  const removedDocuments:string[]=[];
  executiveStore.update(s=>{
   const list=s.businessRecords?.[unitId]||[],unit=s.units[unitId];
   const index=kind==='business'?list.findIndex(r=>r.id===id):-1;
   if(kind==='business'&&index>=0&&action==='delete'){
    if(list[index].version!==version)throw Object.assign(Error('تغير السجل. حدّث البيانات.'),{status:409});list.splice(index,1);
   }else if(kind==='pending'){
    const pending=s.platformSettings?.pendingRecords||[],i=pending.findIndex(p=>p.record.id===id&&p.record.unitId===unitId);
    if(i<0)throw Error('المشاركة غير موجودة.');const p=pending[i];
    if(p.record.version!==version)throw Object.assign(Error('تغير الطلب. حدّث البيانات.'),{status:409});
    if(action==='approve'){
     const records=(s.businessRecords||={})[unitId]||=[],old=records.findIndex(r=>r.id===id);
     if((old<0?0:records[old].version)!==p.baseVersion)throw Object.assign(Error('تغير الأصل منذ إرسال المشاركة. أعدها للمستخدم.'),{status:409});
     if(old<0)records.unshift(p.record);else records[old]=p.record;
    }else if(!['delete','return'].includes(action))throw Error('إجراء غير صالح.');
    if(action==='return'){pending[i]={...p,status:'returned',note:String(req.body.note||'').trim().slice(0,2000)};if(!pending[i].note)throw Error('أضف سبب الإعادة.');}else pending.splice(i,1);
   }else if(kind==='report'){
    const reports=s.reports||[],i=reports.findIndex(r=>r.id===id&&r.unitId===unitId);if(i<0)throw Error('التقرير غير موجود.');
    if(action==='delete'){removedDocuments.push(...reports[i].attachments.map(d=>d.id));reports.splice(i,1);}else if(['approve','return'].includes(action)){reports[i].status=action==='approve'?'reviewed':'returned';reports[i].note=String(req.body.note||'').slice(0,2000);reports[i].reviewedBy=actorOf(req).email;reports[i].reviewedAt=new Date().toISOString();}else throw Error('إجراء غير صالح.');
   }else if(kind==='document'&&unit){
    const i=unit.documents.findIndex(d=>d.id===id);if(i<0)throw Error('المستند غير موجود.');if(action==='delete'){removedDocuments.push(unit.documents[i].id);unit.documents.splice(i,1);}else if(['approve','return'].includes(action)){unit.documents[i].moderation=action==='approve'?'published':'returned';unit.documents[i].moderationNote=String(req.body.note||'').slice(0,2000);}else throw Error('إجراء غير صالح.');unit.version++;
   }else if(kind==='task'&&unit){
    const i=unit.directives.findIndex(d=>d.id===id);if(i<0)throw Error('التكليف غير موجود.');
    if(action==='delete')unit.directives.splice(i,1);else if(['close','reopen'].includes(action))unit.directives[i].status=action==='close'?'closed':'open';else throw Error('إجراء غير صالح.');unit.version++;
   }else throw Error('المحتوى أو الإجراء غير متاح.');
   executiveStore.audit(s,actorOf(req).email,`إدارة المحتوى: ${action} ${kind} ${id}`,unitId);
  });for(const id of removedDocuments)executiveStore.removeDocument(id);res.json({ok:true});
 }));
 return router;
}
