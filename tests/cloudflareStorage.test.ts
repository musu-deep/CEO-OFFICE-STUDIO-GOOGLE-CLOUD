import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {CloudflareStore} from '../src/worker/storage';
import type {D1Database,R2Bucket} from '@cloudflare/workers-types';

const schema=fs.readFileSync('migrations/0001_cloudflare.sql','utf8');
const fixtures=()=>({SESSION_SECRET:'workers-integration-secret-only',ARAAK_AUTH_USERS:JSON.stringify({'ceo@test.com':{password:'Ceo-test-password-2026',role:'ceo'}})});
const instance=(persist?:string)=>{
 const options=convertV4MiniflareOptions({name:'ceo-office-test',modules:true,scriptPath:path.resolve('build/worker/index.js'),compatibilityDate:'2025-10-31',compatibilityFlags:['nodejs_compat'],bindings:fixtures(),d1Databases:{DB:'test-db'},r2Buckets:{BUCKET:'test-bucket'}});
 options.workers[0].dev={...options.workers[0].dev,stripCfConnectingIp:false};
 return new Miniflare({...options,...(persist?{resourcePersistencePath:persist}:{})});
};
async function migrate(mf:Miniflare){const db=await mf.getD1Database('DB');for(const statement of schema.replace(/--[^\n]*/g,'').split(';').map(s=>s.trim()).filter(Boolean))await db.prepare(statement).run();}

test('D1 atomically rejects stale snapshots, rolls back uploaded R2 objects and keeps accounts/grants together',async()=>{
 const mf=instance();
 try{
  await migrate(mf);const db=await mf.getD1Database('DB') as unknown as D1Database,bucket=await mf.getR2Bucket('BUCKET') as unknown as R2Bucket;
  const first=await CloudflareStore.open(db,bucket),stale=await CloudflareStore.open(db,bucket);
  first.update(s=>{s.grants['first@test.com']={units:['finance'],actions:['read']};});await first.commit();
  const doc=stale.document({name:'stale.txt',mimeType:'text/plain',data:Buffer.from('rollback').toString('base64')});
  stale.update(s=>{s.grants['lost@test.com']={units:['digital'],actions:['read']};});
  await assert.rejects(()=>stale.commit(),{status:409});
  assert.equal(await bucket.get(`documents/${doc.id}`),null);
  const restored=await CloudflareStore.open(db,bucket);
  assert.ok(restored.read().grants['first@test.com']);assert.equal(restored.read().grants['lost@test.com'],undefined);
 }finally{await mf.dispose();}
});

test('Workers registration, approval, private reports, persistent restart, suspension, origin checks and durable rate limiting',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'araak-workers-'));let mf=instance(dir);
 const request=async(route:string,body?:unknown,cookie?:string,extra:Record<string,string>={})=>{
  const response=await mf.dispatchFetch(`https://office.test${route}`,{headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...(cookie?{Cookie:cookie}:{}),...extra},...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)})});
  const text=await response.text();return {status:response.status,data:text?JSON.parse(text):null,cookie:response.headers.get('set-cookie')?.split(';')[0]};
 };
 const login=(email:string)=>request('/api/auth/login',{email,password:email==='ceo@test.com'?'Ceo-test-password-2026':'Manager-password-2026'});
 const register=(email:string)=>request('/api/auth/register',{email,name:'مدير المالية',title:'مدير',unitId:'finance',password:'Manager-password-2026',role:'ceo'});
 try{
  await migrate(mf);
  assert.equal((await request('/api/auth/status')).data.registrationAvailable,true);
  assert.equal((await request('/api/auth/me',undefined,'araak_session=%ZZ')).status,401);
  assert.equal((await register('finance@test.com')).status,202);
  assert.equal((await login('finance@test.com')).status,401);
  const ceo=(await login('ceo@test.com')).cookie!;assert.ok(ceo);
  assert.equal((await request('/api/manager-accounts/finance%40test.com/decision',{action:'approve',units:['finance']},ceo)).status,200);
  const user=(await login('finance@test.com')).cookie!;assert.ok(user);
  const scope=await request('/api/executive/state',undefined,user);assert.deepEqual(scope.data.entities.map((e:any)=>e.id),['finance']);
  assert.equal((await request('/api/manager-accounts',undefined,user)).status,403);
  const sent=await request('/api/performance-reports',{unitId:'finance',title:'تقرير',period:'أكتوبر',summary:'الأداء الفعلي',attachments:[{name:'report.txt',data:Buffer.from('private report').toString('base64')}]},user);
  assert.equal(sent.status,201,JSON.stringify(sent.data));
  const large=await request('/api/performance-reports',{unitId:'finance',title:'تقرير بمرفقات كاملة',period:'أكتوبر',summary:'التحقق من الحد الأقصى للملفات',attachments:Array.from({length:5},(_,i)=>({name:`report-${i}.pdf`,data:Buffer.alloc(4*1024*1024,65).toString('base64')}))},user);
  assert.equal(large.status,201,JSON.stringify(large.data));
  const report=sent.data.report,download=`/api/performance-reports/${report.id}/attachments/${report.attachments[0].id}`;
  let response=await mf.dispatchFetch(`https://office.test${download}`,{headers:{Cookie:user}});assert.equal(response.status,200);assert.equal(await response.text(),'private report');
  await register('other@test.com');await request('/api/manager-accounts/other%40test.com/decision',{action:'approve',units:['finance']},ceo);
  const other=(await login('other@test.com')).cookie!;
  assert.equal((await request(download,undefined,other)).status,404);
  assert.equal((await request('/api/performance-reports',undefined,other)).data.reports.length,0);
  assert.equal((await request('/api/auth/register',{},undefined,{Origin:'https://attacker.test'})).status,403);
  assert.equal((await request('/api/not-a-route',undefined,user)).status,404);
  await mf.dispose();mf=instance(dir);
  assert.equal((await login('finance@test.com')).status,200);
  response=await mf.dispatchFetch(`https://office.test${download}`,{headers:{Cookie:user}});assert.equal(await response.text(),'private report');
  assert.equal((await request('/api/performance-reports',undefined,ceo)).data.reports.length,2);
  await request('/api/manager-accounts/finance%40test.com/decision',{action:'suspend'},ceo);
  assert.equal((await request('/api/auth/me',undefined,user)).status,401);
  for(let i=0;i<11;i++)await request('/api/auth/login',{email:'bad@test.com',password:'wrong'},undefined,{'CF-Connecting-IP':'192.0.2.99'});
  await mf.dispose();mf=instance(dir);
  assert.equal((await request('/api/auth/login',{email:'bad@test.com',password:'wrong'},undefined,{'CF-Connecting-IP':'192.0.2.99'})).status,429);
 }finally{await mf.dispose();fs.rmSync(dir,{recursive:true,force:true});}
});

test('administration settings persist in D1 and R2 deletion waits for successful metadata commit',async()=>{
 const mf=instance();
 try{
  await migrate(mf);const db=await mf.getD1Database('DB') as unknown as D1Database,bucket=await mf.getR2Bucket('BUCKET') as unknown as R2Bucket;
  const initial=await CloudflareStore.open(db,bucket);
  const doc=initial.document({name:'admin-delete.pdf',mimeType:'application/pdf',data:Buffer.from('keep until commit').toString('base64')});
  initial.update(s=>{
   s.platformSettings={registration:'closed',closedUnits:['finance'],disabledAgents:['finance'],pendingRecords:[]};
   s.units.finance={version:1,history:[],directives:[],documents:[{...doc,author:'ceo@test.com',at:new Date().toISOString()}]};
  });await initial.commit();
  const fresh=await CloudflareStore.open(db,bucket),stale=await CloudflareStore.open(db,bucket);
  assert.equal(fresh.read().platformSettings?.registration,'closed');assert.deepEqual(fresh.read().platformSettings?.disabledAgents,['finance']);
  fresh.update(s=>{s.platformSettings!.registration='approval';});await fresh.commit();
  stale.update(s=>{s.units.finance.documents=[];});stale.removeDocument(doc.id);
  await assert.rejects(()=>stale.commit(),{status:409});assert.ok(await bucket.get(`documents/${doc.id}`));
  const final=await CloudflareStore.open(db,bucket);final.update(s=>{s.units.finance.documents=[];});final.removeDocument(doc.id);await final.commit();
  assert.equal(await bucket.get(`documents/${doc.id}`),null);
 }finally{await mf.dispose();}
});

test('project reference migration preserves private source data, survives D1 commit and never overwrites an existing report',async()=>{
 const mf=instance();
 try{
  await migrate(mf);const db=await mf.getD1Database('DB') as unknown as D1Database,bucket=await mf.getR2Bucket('BUCKET') as unknown as R2Bucket;
  const sql=fs.readFileSync('migrations/0002_project_reference.sql','utf8');const seed=async()=>{for(const line of sql.split('\n').filter(s=>s.trim()&&!s.startsWith('--')))await db.prepare(line).run();};await seed();
  const store=await CloudflareStore.open(db,bucket),p=store.read().projectReports![0];assert.equal(p.id,'farasan-reference');assert.equal(p.data.unitProgress.length,92);assert.equal(p.snapshot.s.users,undefined);
  store.update(s=>{s.projectReports![0].version=1;s.projectReports![0].state='draft';});await store.commit();await seed();
  const reopened=await CloudflareStore.open(db,bucket);assert.equal(reopened.read().projectReports![0].version,1);assert.equal(reopened.read().projectReports![0].state,'draft');
 }finally{await mf.dispose();}
});

test('published project payload remains independent of its draft after D1 and R2 reload',async()=>{
 const mf=instance();try{
  await migrate(mf);const db=await mf.getD1Database('DB') as unknown as D1Database,bucket=await mf.getR2Bucket('BUCKET') as unknown as R2Bucket;
  const store=await CloudflareStore.open(db,bucket);const payload={data:{project:{title:'نسخة معتمدة'},boq:[{code:'A',contractValue:1000}]},snapshot:{at:'2026-11-04',by:'engineer',s:{}},source:{name:'نموذج إدخال',at:'2026-11-04',by:'engineer'}};
  const file=store.document({name:'test.pdf',mimeType:'application/pdf',data:Buffer.from('%PDF-project-test').toString('base64')});const attachment={...file,size:17,at:'2026-11-04',author:'engineer'};
  store.update(s=>{s.projectReports=[{...structuredClone(payload),id:'project-test',unitId:'national-projects',name:'مسودة جديدة',version:5,state:'draft',contentHash:'draft-hash',events:[],attachments:[attachment],published:{payload:structuredClone(payload),version:4,at:'2026-11-04',by:'ceo',hash:'approved-hash',attachments:[attachment]}}];s.projectReports[0].data.project.title='مسودة جديدة';});await store.commit();
  const reloaded=await CloudflareStore.open(db,bucket);const p=reloaded.read().projectReports![0];assert.equal(p.data.project.title,'مسودة جديدة');assert.equal(p.published!.payload.data.project.title,'نسخة معتمدة');assert.equal(p.published!.version,4);assert.equal(Buffer.from(await reloaded.bytes(file.id)).toString(),'%PDF-project-test');
  const rows=await db.prepare("SELECT kind FROM app_records WHERE kind IN ('project-report','project-published')").all();assert.equal(rows.results.length,2);
 }finally{await mf.dispose();}
});
