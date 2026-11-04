import {projectInputSchema} from './projectInputSchema';
import {executiveProject,payloadOf} from '../lib/projectPublishing';
import {projectComparison} from './projectComparison';
import {entities} from '../lib/executiveModel';
import {unitOperationAllowed} from './platformAdministration';
import {originalReportHTML,originalReportCSP} from './originalProjectReport';
import {projectPresentation} from './projectPresentation';
import {Router} from 'express';
import crypto from 'node:crypto';
import seed from './data/farasan-report.json';
import {executiveStore} from './storeContext';
import {actorOf} from './executiveRoutes';
import {dataSections,snapshotSections,type ProjectPayload,type ProjectReport} from '../lib/projectReports';
const fail=(message:string,status=400)=>Object.assign(Error(message),{status});
const text=(v:unknown,max=300)=>typeof v==='string'?v.trim().slice(0,max):'';
const hash=(v:unknown)=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function validateProjectPayload(input:any,draft=false):ProjectPayload{
 if(!input||!input.data||typeof input.data!=='object'||Array.isArray(input.data)||!text(input.data.project?.title))throw fail('يجب توفير بيانات المشروع وعنوانه داخل data.project.title.');
 const data=Object.fromEntries(dataSections.filter(k=>input.data[k]!==undefined).map(k=>[k,input.data[k]]));
 for(const k of dataSections)if(!['project','overallProgress','schedule3','sitePlan'].includes(k)&&data[k]!==undefined&&!Array.isArray(data[k]))throw fail(`القسم ${k} يجب أن يكون قائمة.`);
 if(data.overallProgress===null)delete data.overallProgress;
 if(data.overallProgress!==undefined&&(typeof data.overallProgress!=='number'||data.overallProgress<0||data.overallProgress>1))throw fail('نسبة الإنجاز يجب أن تكون بين صفر وواحد.');
 const rows=(v:any,label:string)=>{if(v===undefined)return;if(!Array.isArray(v)||v.some(r=>!r||typeof r!=='object'||Array.isArray(r)))throw fail(`صفوف ${label} غير صالحة.`);};
 const strings=(v:any,keys:string[])=>{for(const k of keys)if(v[k]!==undefined&&v[k]!==null&&typeof v[k]!=='string')throw fail(`الحقل ${k} يجب أن يكون نصًا.`);};
 const numbers=(v:any,keys:string[])=>{for(const k of keys)if(v[k]!==undefined&&v[k]!==null&&(typeof v[k]!=='number'||!Number.isFinite(v[k])))throw fail(`الحقل ${k} يجب أن يكون رقمًا.`);};
 strings(data.project,['currency','periodFrom','periodTo','title','program','client','contractNo','pmc','consultant','contractor','po','start','completion','revisedCompletion','perfBondBank','perfBondValid']);
 numbers(data.project,['poValue','vo1','revisedValue','durationDays','eot','perfBond','advancePaid']);
 for(const k of dataSections)if(!['project','overallProgress','schedule3','sitePlan'].includes(k))rows(data[k],k);
 for(const a of data.activities||[]){strings(a,['ar','name','remark']);numbers(a,['w','overall']);}
 for(const t of data.types||[]){strings(t,['k','ar']);numbers(t,['units','nb','bua']);}
 for(const u of data.unitProgress||[]){for(const k of ['t','b','u','floor','plot'])if(u[k]!=null&&!['string','number'].includes(typeof u[k]))throw fail('هوية الوحدة غير صالحة.');if(u.p!==undefined&&(!Array.isArray(u.p)||u.p.length>100||u.p.some((v:any)=>!(draft&&v===null)&&(typeof v!=='number'||!Number.isFinite(v)))))throw fail('نسب أنشطة الوحدة غير صالحة.');}
 for(const q of data.qtyTables||[]){strings(q,['title','sheet']);rows(q.rows,'جدول الكميات');}
 for(const c of data.catalog||[]){strings(c,['cat','sheet']);rows(c.items,'دليل الأسعار');}
 for(const i of data.ipcs||[]){numbers(i,['payable']);rows(i.cost,'أعمال المستخلص');rows(i.vo1,'تغييرات المستخلص');if(i.lines)for(const line of Object.values(i.lines))if(!Array.isArray(line)||line.length!==3||line.some(x=>!(draft&&x===null)&&(typeof x!=='number'||!Number.isFinite(x))))throw fail('بند المستخلص يجب أن يتضمن السابق والحالي والتراكمي كأرقام.');}
 if(data.schedule3!==undefined){if(!data.schedule3||typeof data.schedule3!=='object'||Array.isArray(data.schedule3))throw fail('البرنامج الزمني غير صالح.');strings(data.schedule3,['title']);rows(data.schedule3.rows,'البرنامج الزمني');}
 if(data.sitePlan!==undefined){const p=data.sitePlan;if(!p||typeof p!=='object'||Array.isArray(p))throw fail('مخطط الموقع غير صالح.');numbers(p,['width','height']);if(!draft&&!(p.width>0&&p.width<=100000&&p.height>0&&p.height<=100000))throw fail('أبعاد المخطط غير صالحة.');rows(p.buildings,'مباني المخطط');rows(p.zones,'مناطق المخطط');const ids=new Set();for(const b of p.buildings||[]){strings(b,['id','label']);if(!b.id||ids.has(b.id))throw fail('معرف مبنى مكرر أو مفقود.');ids.add(b.id);numbers(b,['x','y','width','height']);if(!draft&&(![b.x,b.y,b.width,b.height].every(Number.isFinite)||b.x<0||b.y<0||b.width<=0||b.height<=0||b.x+b.width>p.width||b.y+b.height>p.height))throw fail('موضع مبنى خارج حدود المخطط.');}for(const z of p.zones||[]){strings(z,['label']);numbers(z,['x','y','width','height']);if(!draft&&(![z.x,z.y,z.width,z.height].every(Number.isFinite)||z.width<=0||z.height<=0))throw fail('منطقة مخطط غير صالحة.');}strings(p,['origin']);}
 const memberships=new Set(),groupIds=new Set();for(const g of data.targetGroups||[]){strings(g,['id','name','scheduleKey','due']);if(!g.id||!g.name||groupIds.has(g.id)||!Array.isArray(g.buildingIds)||g.buildingIds.some((x:any)=>typeof x!=='string'||memberships.has(x)))throw fail('تصنيف مستهدف مكرر أو غير صالح.');groupIds.add(g.id);for(const id of g.buildingIds){if(memberships.has(id))throw fail('لا يمكن إسناد المبنى إلى مستهدفين.');memberships.add(id);}if(g.reportedComplete!==undefined&&typeof g.reportedComplete!=='boolean')throw fail('حالة المستهدف غير صالحة.');}
 if(!draft){
  const unique=(rows:any[],key:string,label:string)=>{const keys=rows.map(r=>r[key]);if(keys.some(k=>typeof k!=='string'||!k.trim())||new Set(keys).size!==keys.length)throw fail(`معرفات ${label} ناقصة أو مكررة.`);};
  unique(data.types||[],'k','نماذج المباني');unique(data.boq||[],'code','بنود المقايسة');
  for(const a of data.activities||[])if([a.w,a.overall].some(v=>v!=null&&(v<0||v>1)))throw fail('أوزان ومساهمات الأنشطة بين صفر وواحد.');
  for(const u of data.unitProgress||[])if(u.p?.some((v:number)=>v<0||v>1))throw fail('نسب أنشطة الوحدات بين صفر وواحد.');
  const p=data.project;for(const k of ['periodFrom','periodTo'])if(p[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(p[k])||!Number.isFinite(Date.parse(p[k]))||new Date(p[k]).toISOString().slice(0,10)!==p[k]))throw fail('فترة التقرير تتطلب تاريخًا صحيحًا.');if(p.currency&&!/^[A-Za-z]{3}$/.test(p.currency))throw fail('استخدم رمز عملة من ثلاثة أحرف مثل SAR.');if(p.periodFrom&&p.periodTo&&p.periodFrom>p.periodTo)throw fail('بداية فترة التقرير يجب أن تسبق نهايتها.');
 }
 const state=input.snapshot?.s||{};
 for(const k of ['wos','tasks','nipc','grns','mirs','audit','pos'])rows(state[k],k);rows(state.contr?.list,'المقاولين');
 for(const w of state.wos||[]){strings(w,['no','title','desc','contractor','status','mode','start','end','date','boq']);for(const k of ['labor','mats','equip'])rows(w[k],k);if(w.bldgs!==undefined&&(!Array.isArray(w.bldgs)||w.bldgs.some((x:any)=>typeof x!=='string')))throw fail('إسناد مباني أمر العمل غير صالح.');if(w.billed!==undefined&&typeof w.billed!=='boolean')throw fail('حالة فوترة الأمر غير صالحة.');}
 for(const t of state.tasks||[]){strings(t,['id','title','desc','status','asg','asgName','start','due']);if(t.bldgs!==undefined&&(!Array.isArray(t.bldgs)||t.bldgs.some((x:any)=>typeof x!=='string')))throw fail('إسناد المهمة غير صالح.');}
 for(const c of state.nipc||[]){strings(c,['status']);rows(c.lines,'بنود المستخلص الإضافي');for(const l of c.lines||[])strings(l,['b','code']);}

 const payload:ProjectPayload={data,snapshot:{at:text(input.snapshot?.at,80),by:text(input.snapshot?.by),s:Object.fromEntries(snapshotSections.filter(k=>state[k]!==undefined).map(k=>[k,k==='audit'&&Array.isArray(state[k])?state[k].map((a:any)=>({t:text(a.t,80),u:text(a.u),a:text(a.a,2000)})):state[k]]))},source:{name:text(input.source?.name)||'نموذج مشروع',at:text(input.source?.at||input.snapshot?.at,80),by:text(input.source?.by||input.snapshot?.by),...(typeof input.source?.sha256==='string'&&/^[a-f0-9]{64}$/.test(input.source.sha256)?{sha256:input.source.sha256}:{})}};
 const check=(v:any,depth=0)=>{if(depth>18)throw fail('تداخل البيانات أكبر من المسموح.');if(typeof v==='string'&&v.length>20000)throw fail('قيمة نصية أكبر من المسموح.');if(typeof v==='number'&&!Number.isFinite(v))throw fail('قيمة رقمية غير صالحة.');if(v&&typeof v==='object'){if(Array.isArray(v)&&v.length>10000)throw fail('عدد الصفوف أكبر من المسموح.');for(const [k,x] of Object.entries(v)){if(['__proto__','constructor','prototype','password','passwordHash','salt','token','session','users'].includes(k))throw fail('يحتوي النموذج على حقول مصادقة أو حقول غير مسموحة.');check(x,depth+1);}}};check(payload);
 if(Buffer.byteLength(JSON.stringify(payload))>600000)throw fail('حجم النموذج يتجاوز 600 كيلوبايت. قسّم التقارير إلى نسخ أصغر.',413);
 return structuredClone(payload);
}
const reference=():ProjectReport=>({...structuredClone(seed) as ProjectPayload,id:'farasan-reference',unitId:'national-projects',name:seed.data.project.title,version:0,state:'reference',contentHash:hash(seed),events:[]});
const find=(id:string)=>executiveStore.read().projectReports?.find(r=>r.id===id)||(id==='farasan-reference'?reference():undefined);
export function createProjectReportsRouter(){
 const router=Router();router.use((_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
 const handle=(fn:any)=>async(req:any,res:any)=>{try{await fn(req,res);}catch(e:any){res.status(e.status||400).json({error:e.message});}};
 const canWrite=(req:any,unit:string)=>executiveStore.can(actorOf(req),unit,'edit')||executiveStore.can(actorOf(req),unit,'upload');
 const allowed=(req:any,unit:string,action:any)=>{if(!executiveStore.can(actorOf(req),unit,action))throw fail('المشروع أو الإجراء خارج نطاق صلاحياتك.',403);};
 const write=(req:any,unit:string)=>{allowed(req,unit,'read');if(!canWrite(req,unit)||!unitOperationAllowed(req,unit,'reports'))throw fail('لا تملك صلاحية إعداد تقرير لهذه الجهة.',403);};
 const all=()=>{const stored=executiveStore.read().projectReports||[];return [...stored,...(stored.some(r=>r.id==='farasan-reference')?[]:[reference()])];};
 const save=(req:any,p:ProjectReport,label:string)=>executiveStore.update(s=>{const list=s.projectReports||=[];const i=list.findIndex(r=>r.id===p.id);if(i<0)list.push(p);else list[i]=p;executiveStore.audit(s,actorOf(req).email,`${label}: ${p.name}`,p.unitId);});
 router.get('/',handle((req:any,res:any)=>{
  const editing=req.query.mode==='edit',actor=actorOf(req),units=entities().filter(e=>executiveStore.can(actor,e.id,'read')&&canWrite(req,e.id)&&unitOperationAllowed(req,e.id,'reports'));
  const list=all().filter(p=>executiveStore.can(actor,p.unitId,'read')).map(p=>editing?p:(executiveProject(p)||(p.id==='farasan-reference'?reference():null))).filter(Boolean) as ProjectReport[];
  res.json({projects:list.map(p=>({id:p.id,unitId:p.unitId,name:p.name,version:p.version,state:p.state,source:p.source,hasPublished:!!p.published})),canCreate:units.length>0,units:units.map(e=>({id:e.id,name:e.name})),actor:{email:actor.email}});
 }));
 router.get('/input-schema',handle((req:any,res:any)=>{if(!entities().some(e=>executiveStore.can(actorOf(req),e.id,'read')&&(['edit','upload','review','approve'].some(a=>executiveStore.can(actorOf(req),e.id,a as any)))))throw fail('لا توجد صلاحية إعداد تقارير.',403);res.json({schema:projectInputSchema});}));
 router.get('/comparison',handle((req:any,res:any)=>{
  const ids=String(req.query.ids||'').split(',').filter(Boolean),keys=String(req.query.keys||'').split(',').filter(Boolean);if(ids.length<1||ids.length>8||new Set(ids).size!==ids.length||keys.length>30)throw fail('اختر مشروعًا إلى ثمانية مشاريع، وحتى 30 بندًا.');
  const reports=ids.map(id=>{const raw=find(id);if(!raw)throw fail('مشروع غير موجود.',404);allowed(req,raw.unitId,'read');const p=executiveProject(raw);if(!p||p.state!=='approved')throw fail('المقارنة متاحة للنسخ المعتمدة فقط.');return p;});
  const choices=[...new Map(reports.flatMap(p=>(p.data.boq||[]).map((it:any)=>[it.comparisonKey||it.code,{key:it.comparisonKey||it.code,label:it.ar||it.en||it.code}]))).values()];
  res.json({...projectComparison(reports,keys),choices});
 }));
 router.get('/:id/original',handle((req:any,res:any)=>{const raw=find(req.params.id);if(!raw)throw fail('المشروع غير موجود.',404);allowed(req,raw.unitId,'read');const p=executiveProject(raw)||(raw.id==='farasan-reference'?reference():null);if(!p)throw fail('لم تُعتمد نسخة تنفيذية بعد.',404);const html=originalReportHTML(p,String(req.query.section||''),req.query.theme==='light'?'light':'dark');res.removeHeader('X-Frame-Options');res.setHeader('Content-Security-Policy',originalReportCSP);res.type('html').send(html);}));
 router.get('/:id',handle((req:any,res:any)=>{const raw=find(req.params.id);if(!raw)throw fail('المشروع غير موجود.',404);allowed(req,raw.unitId,'read');const editing=req.query.mode==='edit';if(editing&&!canWrite(req,raw.unitId)&&!executiveStore.can(actorOf(req),raw.unitId,'review')&&!executiveStore.can(actorOf(req),raw.unitId,'approve'))throw fail('لا تملك صلاحية إعداد أو مراجعة التقرير.',403);
  const p=editing?raw:executiveProject(raw)||(raw.id==='farasan-reference'?reference():null);if(!p)throw fail('لم تُعتمد نسخة تنفيذية بعد. افتح مساحة إعداد التقارير.',404);
  res.json({report:p,presentation:projectPresentation(p),draftState:raw.state,draftVersion:raw.version,permissions:editing?['edit','upload','review','approve'].filter(a=>executiveStore.can(actorOf(req),raw.unitId,a as any)):[],canAuthor:canWrite(req,raw.unitId)});
 }));
 router.post('/',handle((req:any,res:any)=>{const unitId=text(req.body.unitId)||'national-projects';write(req,unitId);const payload=validateProjectPayload(req.body.payload,true);if((executiveStore.read().projectReports||[]).length>=100)throw fail('تم بلوغ حد 100 مشروع.');const actor=actorOf(req),id=crypto.randomUUID(),contentHash=hash(payload),at=new Date().toISOString();
  const report:ProjectReport={...payload,id,unitId,name:text(payload.data.project.title),version:1,state:'draft',contentHash,attachments:[],events:[{at,actor:actor.email,action:'إنشاء نموذج مشروع',note:'',hash:contentHash}]};save(req,report,'إنشاء مشروع');res.status(201).json({report,presentation:projectPresentation(report)});
 }));
 router.post('/:id/action',handle((req:any,res:any)=>{const p=find(req.params.id);if(!p)throw fail('المشروع غير موجود.',404);const {action,version}=req.body||{},actor=actorOf(req),note=text(req.body.note,2000);allowed(req,p.unitId,'read');if(!['save','submit','review','approve','return','revision'].includes(action))throw fail('إجراء غير صالح.');
  if(action==='approve')allowed(req,p.unitId,'approve');else if(['review','return'].includes(action))allowed(req,p.unitId,'review');else write(req,p.unitId);
  if(p.version!==version)throw fail('تغيرت نسخة التقرير. حدّث البيانات قبل المتابعة.',409);
  if(action==='save'&&p.state!=='reference')throw fail('حُفظ النموذج بالفعل.');if(action==='submit'&&!['draft','returned'].includes(p.state))throw fail('أرسل مسودة محفوظة للمراجعة أولاً.');
  if(action==='submit')validateProjectPayload(payloadOf(p));
  if(action==='review'&&p.state!=='submitted')throw fail('يلزم إرسال التقرير للمراجعة.');if(action==='review'&&p.submittedBy===actor.email)throw fail('يجب أن يراجع التقرير شخص آخر غير مرسله.');if(action==='approve'&&(p.state!=='reviewed'||p.reviewedBy===actor.email))throw fail('يلزم إتمام المراجعة ثم الاعتماد بواسطة شخص آخر غير المراجع.');if(action==='return'&&(!['submitted','reviewed'].includes(p.state)||!note))throw fail('إعادة التقرير تتطلب ملاحظة على نسخة مرسلة أو مراجعة.');if(action==='revision'&&['submitted','reviewed'].includes(p.state))throw fail('أعد التقرير للتصحيح قبل تغيير بيانات نسخة قيد المراجعة.');
  const next:ProjectReport=structuredClone(p);if(action==='revision'){if(next.state==='approved'&&!next.published)next.published={payload:payloadOf(p),version:p.version,at:p.events[0]?.at||new Date().toISOString(),by:p.events[0]?.actor||actor.email,hash:p.contentHash,attachments:p.attachments||[]};const payload=validateProjectPayload(req.body.payload,true);Object.assign(next,payload,{name:text(payload.data.project.title),contentHash:hash({payload,attachments:next.attachments||[]})});delete next.submittedBy;delete next.reviewedBy;}
  next.version++;next.state=action==='submit'?'submitted':action==='review'?'reviewed':action==='approve'?'approved':action==='return'?'returned':'draft';if(action==='submit'){next.submittedBy=actor.email;delete next.reviewedBy;}if(action==='review')next.reviewedBy=actor.email;
  if(action==='approve')next.published={payload:structuredClone(payloadOf(next)),version:next.version,at:new Date().toISOString(),by:actor.email,hash:next.contentHash,attachments:structuredClone(next.attachments||[])};
  const label=({save:'حفظ النسخة المرجعية كمسودة',submit:'إرسال للمراجعة',review:'مراجعة التقرير',approve:'اعتماد التقرير',return:'إعادة للتصحيح',revision:'حفظ مسودة تقرير'})[action] as string;
  next.events.unshift({at:new Date().toISOString(),actor:actor.email,action:label,note,hash:next.contentHash});next.events=next.events.slice(0,100);save(req,next,label);res.json({report:next,presentation:projectPresentation(next)});
 }));
 router.post('/:id/attachments',handle((req:any,res:any)=>{const p=find(req.params.id);if(!p)throw fail('المشروع غير موجود.',404);write(req,p.unitId);allowed(req,p.unitId,'upload');if(!unitOperationAllowed(req,p.unitId,'uploads'))throw fail('رفع المرفقات موقوف لهذه الجهة.',403);if(!['draft','returned'].includes(p.state))throw fail('أرفق المستندات على مسودة التقرير.');if(req.body.version!==p.version)throw fail('تغيرت النسخة. حدّث البيانات.',409);if((p.attachments||[]).length>=10)throw fail('الحد الأقصى عشرة مرفقات.');
  const f=req.body.file;if(!f||typeof f.name!=='string'||f.name.length>200||typeof f.data!=='string'||f.data.length>5600000||!['application/pdf','image/png','image/jpeg','text/plain','text/csv','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(f.mimeType))throw fail('ملف غير مدعوم؛ الحد الأقصى 4 ميغابايت.');if(!/^[A-Za-z0-9+/]*={0,2}$/.test(f.data))throw fail('ترميز الملف غير صالح.');const size=Buffer.from(f.data,'base64').length;if(!size||size>4*1024*1024)throw fail('حجم الملف غير صالح.');const file=executiveStore.document(f);try{p.attachments||=[];p.attachments.push({...file,size,at:new Date().toISOString(),author:actorOf(req).email});p.version++;p.contentHash=hash({payload:payloadOf(p),attachments:p.attachments});p.events.unshift({at:new Date().toISOString(),actor:actorOf(req).email,action:'إرفاق مستند',note:f.name,hash:p.contentHash});save(req,p,'إرفاق مستند');}catch(e){executiveStore.discardDocument(file.id);throw e;}res.status(201).json({report:p});
 }));
 router.get('/:id/attachments/:fileId',handle(async(req:any,res:any)=>{const raw=find(req.params.id);if(!raw)throw fail('المشروع غير موجود.',404);allowed(req,raw.unitId,'read');const editing=req.query.mode==='edit';if(editing&&!canWrite(req,raw.unitId)&&!executiveStore.can(actorOf(req),raw.unitId,'review')&&!executiveStore.can(actorOf(req),raw.unitId,'approve'))throw fail('غير مصرح.',403);const p=editing?raw:executiveProject(raw);const f=p?.attachments?.find(f=>f.id===req.params.fileId);if(!f)throw fail('المرفق غير موجود.',404);res.type(f.mimeType);res.setHeader('Content-Disposition',`attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`);res.send(await executiveStore.bytes(f.id));}));
 return router;
}
