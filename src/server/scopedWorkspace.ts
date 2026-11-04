import { participationOf, unitClosed, unitOperationAllowed } from './platformAdministration';
import { Router } from 'express';
import crypto from 'node:crypto';
import { executiveStore, actorOf } from './executiveRoutes';
import { entities, emptyRecord, resolveEntity, validateServiceCompany, type Directive } from '../lib/executiveModel';
import { profileFor, validateDomainValues, type DomainRecord } from '../lib/workspaceProfiles';
export type WorkspaceTask=Directive&{unitId:string;unitName:string};
export const assignedTask=(email:string,taskId:string,unitId:string)=>executiveStore.read().units[unitId]?.directives.find(d=>d.id===taskId&&d.assigneeEmail===email);
export function createScopedWorkspaceRouter(recipients:()=>{email:string;name:string}[]) {
 const router=Router();
 router.use((_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
 const office=(req:any)=>['ceo','admin'].includes(actorOf(req).role);
 const handle=(fn:any)=>(req:any,res:any)=>{try{return fn(req,res);}catch(e:any){return res.status(e.status||400).json({error:e.message||'تعذر تنفيذ الطلب.'});}};
 router.get('/',handle((req:any,res:any)=>{
  const actor=actorOf(req),s=executiveStore.read();
  const tasks=Object.entries(s.units).flatMap(([unitId,r])=>r.directives.filter(d=>office(req)||d.assigneeEmail===actor.email).map(d=>({...d,unitId,unitName:resolveEntity(unitId)?.name||unitId})));
  const list=entities().filter(e=>executiveStore.can(actor,e.id,'read')||executiveStore.can(actor,e.id,'upload')||executiveStore.can(actor,e.id,'edit'));
  res.json({tasks,entities:list.map(e=>({...e,children:undefined})),manage:office(req),canProjectReporting:list.some(e=>executiveStore.can(actor,e.id,'read')&&['edit','upload','review','approve'].some(a=>executiveStore.can(actor,e.id,a as any)))});
 }));
 router.get('/recipients',handle((req:any,res:any)=>{if(!office(req))return res.status(403).json({error:'غير مصرح.'});res.json({recipients:recipients()});}));
 router.post('/tasks',handle((req:any,res:any)=>{
  if(!office(req))return res.status(403).json({error:'إنشاء التكليفات متاح لمكتب الرئيس التنفيذي.'});
  const {unitId,title,due,assigneeEmail}=req.body||{};
  if(typeof unitId!=='string'||!resolveEntity(unitId)||typeof title!=='string'||!title.trim()||title.length>1000||typeof due!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(due)||!Number.isFinite(Date.parse(due))||typeof assigneeEmail!=='string')throw Error('أكمل الجهة والتكليف والموعد والمسؤول.');
  const email=assigneeEmail.trim().toLowerCase(),recipient=recipients().find(a=>a.email===email);
  if(!recipient)throw Error('المسؤول يجب أن يكون حسابًا مفعّلًا في المنصة.');
  const task:Directive={id:crypto.randomUUID(),title:title.trim(),due,owner:recipient.name,assigneeEmail:email,status:'open',createdAt:new Date().toISOString(),author:actorOf(req).email};
  executiveStore.update(s=>{const r=s.units[unitId]||emptyRecord();r.directives.unshift(task);r.version++;s.units[unitId]=r;executiveStore.audit(s,actorOf(req).email,`إسناد تكليف إلى ${email}`,unitId);});
  res.status(201).json({task:{...task,unitId,unitName:resolveEntity(unitId)!.name}});
 }));
 router.post('/tasks/:id/status',handle((req:any,res:any)=>{
  const actor=actorOf(req),{status,expectedStatus}=req.body||{};
  if(!['open','working','closed'].includes(status))throw Error('حالة غير صالحة.');
  const found=Object.entries(executiveStore.read().units).flatMap(([unitId,r])=>r.directives.map(task=>({unitId,task}))).find(x=>x.task.id===req.params.id);
  if(!found||(!office(req)&&found.task.assigneeEmail!==actor.email))return res.status(404).json({error:'التكليف غير متاح.'});
  if(!unitOperationAllowed(req,found.unitId,'tasks'))return res.status(403).json({error:'مساحة الجهة مغلقة للمشاركة.'});
  if(expectedStatus!==found.task.status)return res.status(409).json({error:'تغيرت حالة التكليف. حدّث الصفحة.'});
  executiveStore.update(s=>{const r=s.units[found.unitId],d=r.directives.find(d=>d.id===req.params.id)!;d.status=status;d.updatedAt=new Date().toISOString();r.version++;executiveStore.audit(s,actor.email,`تحديث تكليف ${d.id}`,found.unitId);});res.json({ok:true});
 }));
 router.get('/units/:id/records',handle((req:any,res:any)=>{
  const actor=actorOf(req),id=req.params.id;
  if(!executiveStore.can(actor,id,'read'))return res.status(403).json({error:'لا تملك صلاحية عرض سجلات هذه الجهة.'});
  const state=executiveStore.read(),records=state.businessRecords?.[id]||[];
  const pending=(state.platformSettings?.pendingRecords||[]).filter(p=>p.record.unitId===id&&(office(req)||p.record.author===actor.email)).map(p=>({...p.record,pendingApproval:true,moderationStatus:p.status||'pending',moderationNote:p.note}));
  res.json({profile:profileFor(id),records:[...pending,...records.filter(r=>!pending.some(p=>p.id===r.id))]});
 }));
 router.post('/units/:id/records',handle((req:any,res:any)=>{
  const actor=actorOf(req),unitId=req.params.id;
  if(!unitOperationAllowed(req,unitId,'records')||!executiveStore.can(actor,unitId,'edit'))return res.status(403).json({error:'لا تملك صلاحية تعديل سجلات هذه الجهة.'});
  if(!executiveStore.persistent)return res.status(503).json({error:'يجب تفعيل التخزين الدائم قبل حفظ السجلات.'});
  const {title,values,id,version}=req.body||{};
  const companyId=validateServiceCompany(unitId,req.body?.companyId);
  if(typeof title!=='string'||!title.trim()||title.length>200)throw Error('أدخل عنوانًا للسجل بحد أقصى 200 حرف.');
  const normalized=validateDomainValues(unitId,values);let record:DomainRecord;
  executiveStore.update(s=>{
   const list=(s.businessRecords||={})[unitId]||=[];
   const existing=id?list.find(r=>r.id===id):undefined;
   const queued=s.platformSettings?.pendingRecords?.find(p=>p.record.id===id&&p.record.unitId===unitId);
   if(queued&&queued.record.author!==actor.email&&!office(req))throw Object.assign(Error('يوجد تعديل آخر بانتظار الموافقة.'),{status:409});
   if(id&&!existing&&!queued)throw Object.assign(Error('السجل غير موجود.'),{status:404});
   if(id&&version!==(queued?.record.version??existing?.version))throw Object.assign(Error('تغير السجل. حدّث الصفحة قبل الحفظ.'),{status:409});
   record={id:existing?.id||queued?.record.id||crypto.randomUUID(),unitId,...(companyId?{companyId}:{}),profileId:profileFor(unitId).id,title:title.trim(),values:normalized,version:(queued?.record.version??existing?.version??0)+1,author:actor.email,createdAt:existing?.createdAt||queued?.record.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
   if(!office(req)&&participationOf(req,unitId)==='review'){
    const settings=s.platformSettings||={},queue=settings.pendingRecords||=[];
    if(queue.length>=200&&!queued)throw Error('قائمة المراجعة ممتلئة. راجع إدارة المنصة.');
    const i=queue.findIndex(p=>p.record.id===record.id&&p.record.unitId===unitId);
    const entry={record,baseVersion:queued?.baseVersion??existing?.version??0,status:'pending' as const};
    if(i>=0){if(queue[i].record.author!==actor.email)throw Error('يوجد تعديل آخر بانتظار الموافقة.');queue[i]=entry;}else queue.push(entry);
   }else{if(existing)list[list.indexOf(existing)]=record;else list.unshift(record);if(queued)s.platformSettings!.pendingRecords=s.platformSettings!.pendingRecords!.filter(p=>p!==queued);}
   executiveStore.audit(s,actor.email,`${existing?'تحديث':'إضافة'} ${profileFor(unitId).recordLabel}`,unitId);
  });res.status(id?200:201).json({record:record!,pendingApproval:!office(req)&&participationOf(req,unitId)==='review'});
 }));
 return router;
}
