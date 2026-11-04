import {Router} from 'express';
import crypto from 'node:crypto';
import seed from './data/farasan-report.json';
import {executiveStore} from './storeContext';
import {actorOf} from './executiveRoutes';
import {dataSections,snapshotSections,type ProjectPayload,type ProjectReport} from '../lib/projectReports';
const fail=(message:string,status=400)=>Object.assign(Error(message),{status});
const text=(v:unknown,max=300)=>typeof v==='string'?v.trim().slice(0,max):'';
const hash=(v:unknown)=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateProjectPayload(input:any):ProjectPayload{
 if(!input||!input.data||typeof input.data!=='object'||Array.isArray(input.data)||!text(input.data.project?.title))throw fail('يجب توفير بيانات المشروع وعنوانه داخل data.project.title.');
 const data=Object.fromEntries(dataSections.filter(k=>input.data[k]!==undefined).map(k=>[k,input.data[k]]));
 for(const k of dataSections)if(!['project','overallProgress','schedule3'].includes(k)&&data[k]!==undefined&&!Array.isArray(data[k]))throw fail(`القسم ${k} يجب أن يكون قائمة.`);
 if(data.overallProgress!==undefined&&(typeof data.overallProgress!=='number'||data.overallProgress<0||data.overallProgress>1))throw fail('نسبة الإنجاز يجب أن تكون بين صفر وواحد.');
 const rows=(v:any,label:string)=>{if(v===undefined)return;if(!Array.isArray(v)||v.some(r=>!r||typeof r!=='object'||Array.isArray(r)))throw fail(`صفوف ${label} غير صالحة.`);};
 const strings=(v:any,keys:string[])=>{for(const k of keys)if(v[k]!==undefined&&v[k]!==null&&typeof v[k]!=='string')throw fail(`الحقل ${k} يجب أن يكون نصًا.`);};
 const numbers=(v:any,keys:string[])=>{for(const k of keys)if(v[k]!==undefined&&v[k]!==null&&(typeof v[k]!=='number'||!Number.isFinite(v[k])))throw fail(`الحقل ${k} يجب أن يكون رقمًا.`);};
 strings(data.project,['title','program','client','contractNo','pmc','consultant','contractor','po','start','completion','revisedCompletion','perfBondBank','perfBondValid']);
 numbers(data.project,['poValue','vo1','revisedValue','durationDays','eot','perfBond','advancePaid']);
 for(const k of dataSections)if(!['project','overallProgress','schedule3'].includes(k))rows(data[k],k);
 for(const a of data.activities||[]){strings(a,['ar','name','remark']);numbers(a,['w','overall']);}
 for(const t of data.types||[]){strings(t,['k','ar']);numbers(t,['units','nb','bua']);}
 for(const u of data.unitProgress||[]){for(const k of ['t','b','u','floor','plot'])if(u[k]!=null&&!['string','number'].includes(typeof u[k]))throw fail('هوية الوحدة غير صالحة.');if(u.p!==undefined&&(!Array.isArray(u.p)||u.p.length>100||u.p.some((v:any)=>typeof v!=='number'||!Number.isFinite(v))))throw fail('نسب أنشطة الوحدة غير صالحة.');}
 for(const q of data.qtyTables||[]){strings(q,['title','sheet']);rows(q.rows,'جدول الكميات');}
 for(const c of data.catalog||[]){strings(c,['cat','sheet']);rows(c.items,'دليل الأسعار');}
 for(const i of data.ipcs||[]){numbers(i,['payable']);rows(i.cost,'أعمال المستخلص');rows(i.vo1,'تغييرات المستخلص');if(i.lines)for(const line of Object.values(i.lines))if(!Array.isArray(line)||line.length!==3||line.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw fail('بند المستخلص يجب أن يتضمن السابق والحالي والتراكمي كأرقام.');}
 if(data.schedule3!==undefined){if(!data.schedule3||typeof data.schedule3!=='object'||Array.isArray(data.schedule3))throw fail('البرنامج الزمني غير صالح.');strings(data.schedule3,['title']);rows(data.schedule3.rows,'البرنامج الزمني');}
 const state=input.snapshot?.s||{};
 for(const k of ['wos','tasks','nipc','grns','mirs','audit','pos'])rows(state[k],k);rows(state.contr?.list,'المقاولين');
 const payload:ProjectPayload={data,snapshot:{at:text(input.snapshot?.at,80),by:text(input.snapshot?.by),s:Object.fromEntries(snapshotSections.filter(k=>state[k]!==undefined).map(k=>[k,k==='audit'&&Array.isArray(state[k])?state[k].map((a:any)=>({t:text(a.t,80),u:text(a.u),a:text(a.a,2000)})):state[k]]))},source:{name:text(input.source?.name)||'نموذج مشروع',at:text(input.source?.at||input.snapshot?.at,80),by:text(input.source?.by||input.snapshot?.by),...(typeof input.source?.sha256==='string'&&/^[a-f0-9]{64}$/.test(input.source.sha256)?{sha256:input.source.sha256}:{})}};
 const check=(v:any,depth=0)=>{if(depth>18)throw fail('تداخل البيانات أكبر من المسموح.');if(typeof v==='string'&&v.length>20000)throw fail('قيمة نصية أكبر من المسموح.');if(typeof v==='number'&&!Number.isFinite(v))throw fail('قيمة رقمية غير صالحة.');if(v&&typeof v==='object'){if(Array.isArray(v)&&v.length>10000)throw fail('عدد الصفوف أكبر من المسموح.');for(const [k,x] of Object.entries(v)){if(['__proto__','constructor','prototype','password','passwordHash','salt','token','session','users'].includes(k))throw fail('يحتوي النموذج على حقول مصادقة أو حقول غير مسموحة.');check(x,depth+1);}}};check(payload);
 if(Buffer.byteLength(JSON.stringify(payload))>600000)throw fail('حجم النموذج يتجاوز 600 كيلوبايت. قسّم التقارير إلى نسخ أصغر.',413);
 return structuredClone(payload);
}
const reference=():ProjectReport=>({...structuredClone(seed) as ProjectPayload,id:'farasan-reference',unitId:'national-projects',name:seed.data.project.title,version:0,state:'reference',contentHash:hash(seed),events:[]});
const find=(id:string)=>executiveStore.read().projectReports?.find(r=>r.id===id)||(id==='farasan-reference'?reference():undefined);
export function createProjectReportsRouter(){
 const router=Router();
 router.use((_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
 const handle=(fn:any)=>(req:any,res:any)=>{try{fn(req,res);}catch(e:any){res.status(e.status||400).json({error:e.message});}};
 const allowed=(req:any,unit:string,action:any)=>{if(!executiveStore.can(actorOf(req),unit,action))throw fail('المشروع أو الإجراء خارج نطاق صلاحياتك.',403);};
 router.get('/',handle((req:any,res:any)=>{
  const stored=executiveStore.read().projectReports||[],all=[...stored,...(stored.some(r=>r.id==='farasan-reference')?[]:[reference()])].filter(r=>executiveStore.can(actorOf(req),r.unitId,'read'));
  res.json({projects:all.map(({id,unitId,name,version,state,source})=>({id,unitId,name,version,state,source})),canCreate:['ceo','admin'].includes(actorOf(req).role)});
 }));
 router.get('/:id',handle((req:any,res:any)=>{const p=find(req.params.id);if(!p)throw fail('المشروع غير موجود.',404);allowed(req,p.unitId,'read');res.json({report:p,permissions:['edit','upload','review','approve'].filter(a=>executiveStore.can(actorOf(req),p.unitId,a as any))});}));
 router.post('/',handle((req:any,res:any)=>{
  if(!['ceo','admin'].includes(actorOf(req).role))throw fail('إنشاء مشاريع متاح لإدارة المكتب فقط.',403);
  const payload=validateProjectPayload(req.body.payload),unitId=text(req.body.unitId)||'national-projects';allowed(req,unitId,'edit');
  if((executiveStore.read().projectReports||[]).length>=100)throw fail('تم بلوغ حد 100 مشروع.');
  const actor=actorOf(req),id=crypto.randomUUID(),contentHash=hash(payload),at=new Date().toISOString();
  const report:ProjectReport={...payload,id,unitId,name:text(payload.data.project.title),version:1,state:'draft',contentHash,events:[{at,actor:actor.email,action:'إنشاء نموذج مشروع',note:'',hash:contentHash}]};
  executiveStore.update(s=>{(s.projectReports||=[]).push(report);executiveStore.audit(s,actor.email,`إنشاء مشروع: ${report.name}`,unitId);});res.status(201).json({report});
 }));
 router.post('/:id/action',handle((req:any,res:any)=>{
  const p=find(req.params.id);if(!p)throw fail('المشروع غير موجود.',404);
  const {action,version}=req.body||{},actor=actorOf(req),note=text(req.body.note,2000);
  if(!['save','submit','review','approve','return','revision'].includes(action))throw fail('إجراء غير صالح.');
  allowed(req,p.unitId,action==='approve'?'approve':['review','return'].includes(action)?'review':'edit');
  if(p.version!==version)throw fail('تغيرت نسخة التقرير. حدّث البيانات قبل المتابعة.',409);
  if(action==='save'&&p.state!=='reference')throw fail('حُفظ النموذج بالفعل.');
  if(action==='submit'&&!['draft','returned'].includes(p.state))throw fail('أرسل مسودة محفوظة للمراجعة أولاً.');
  if(action==='review'&&p.state!=='submitted')throw fail('يلزم إرسال التقرير للمراجعة.');
  if(action==='review'&&p.submittedBy===actor.email)throw fail('يجب أن يراجع التقرير شخص آخر غير مرسله.');
  if(action==='approve'&&(p.state!=='reviewed'||p.reviewedBy===actor.email))throw fail('يلزم إتمام المراجعة ثم الاعتماد بواسطة شخص آخر غير المراجع.');
  if(action==='return'&&(!['submitted','reviewed'].includes(p.state)||!note))throw fail('إعادة التقرير تتطلب ملاحظة على نسخة مرسلة أو مراجعة.');
  if(action==='revision'&&['submitted','reviewed'].includes(p.state))throw fail('أعد التقرير للتصحيح قبل تغيير بيانات نسخة قيد المراجعة.');
  const next:ProjectReport=structuredClone(p);
  if(action==='revision'){const payload=validateProjectPayload(req.body.payload);Object.assign(next,payload,{name:text(payload.data.project.title),contentHash:hash(payload)});delete next.submittedBy;delete next.reviewedBy;}
  next.version++;next.state=action==='submit'?'submitted':action==='review'?'reviewed':action==='approve'?'approved':action==='return'?'returned':'draft';
  if(action==='submit'){next.submittedBy=actor.email;delete next.reviewedBy;}if(action==='review')next.reviewedBy=actor.email;
  const label=({save:'حفظ النسخة المرجعية كمسودة',submit:'إرسال للمراجعة',review:'مراجعة التقرير',approve:'اعتماد التقرير',return:'إعادة للتصحيح',revision:'استيراد نسخة جديدة'})[action] as string;
  next.events.unshift({at:new Date().toISOString(),actor:actor.email,action:label,note,hash:next.contentHash});next.events=next.events.slice(0,100);
  executiveStore.update(s=>{const list=s.projectReports||=[];const i=list.findIndex(r=>r.id===next.id);if(i<0)list.push(next);else list[i]=next;executiveStore.audit(s,actor.email,`${label}: ${next.name}`,next.unitId);});
  res.json({report:next});
 }));
 return router;
}
