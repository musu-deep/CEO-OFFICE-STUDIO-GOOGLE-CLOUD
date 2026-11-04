import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createApplication} from '../src/server/app';
import {ManagerAccounts} from '../src/server/managerAccounts';
import {MemoryExecutiveStore} from '../src/server/storeCore';
import {setDefaultStore} from '../src/server/storeContext';
import {validateProjectPayload} from '../src/server/projectReports';
import {projectInsights} from '../src/lib/projectReports';
import {encodeState,decodeState} from '../src/worker/storage';
import seed from '../src/server/data/farasan-report.json';

test('reference preserves source business sections, excludes authentication and reconciles known source caveats',()=>{
 const p=validateProjectPayload(seed);assert.equal(p.data.unitProgress.length,92);assert.equal(p.data.boq.length,63);assert.equal(p.data.qtyTables.length,11);assert.equal(p.snapshot.s.wos.length,9);assert.equal(p.snapshot.s.pos.length,6);
 assert.equal(p.snapshot.s.users,undefined);assert.ok(!JSON.stringify(p).includes('password'));assert.equal(p.snapshot.s.audit[0].ip,undefined);
 assert.equal(projectInsights(p).certified,22012602.526307702);assert.ok(projectInsights(p).warnings.some(w=>w.includes('ضمان')));assert.ok(projectInsights(p).warnings.some(w=>w.includes('نطاق')));
 assert.throws(()=>validateProjectPayload({data:{project:{title:'x'},activities:'bad'}}));assert.throws(()=>validateProjectPayload({data:{project:{title:'x'},activities:[null]}}));assert.throws(()=>validateProjectPayload({data:{project:{title:'x',client:{} }}}));assert.throws(()=>validateProjectPayload({data:{project:{title:'x',password:'secret'}}}));assert.throws(()=>validateProjectPayload({data:{project:{title:'x'},overallProgress:2}}));
 const sql=fs.readFileSync('migrations/0002_project_reference.sql','utf8');assert.ok(sql.includes('INSERT OR IGNORE'));assert.ok(!sql.includes('password'));
});

test('authenticated project isolation, version conflicts, separate reviewer, approval, revision and durable encoding',async()=>{
 const store=new MemoryExecutiveStore({units:{},objectives:[],grants:{'head@test.example':{units:['finance'],actions:['read','edit']},'writer@test.example':{units:['national-projects'],actions:['read','edit','upload','review']}},audit:[]});setDefaultStore(store);
 const app=createApplication({sessionSecret:'project-test-only',authUsers:{'ceo@test.example':{password:'test',role:'ceo'},'admin@test.example':{password:'test',role:'admin'},'head@test.example':{password:'test',role:'head'},'writer@test.example':{password:'test',role:'head'}},managers:new ManagerAccounts({read:()=>({}),write:()=>{}})});
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));const base=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const req=async(path:string,body?:unknown,cookie?:string)=>{const r=await fetch(base+path,{headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 try{
  assert.equal((await req('/api/project-reports')).status,401);assert.equal((await req('/api/project-reports/farasan-reference')).status,401);
  const ceo=(await req('/api/auth/login',{email:'ceo@test.example',password:'test'})).cookie,admin=(await req('/api/auth/login',{email:'admin@test.example',password:'test'})).cookie,head=(await req('/api/auth/login',{email:'head@test.example',password:'test'})).cookie;
  assert.equal((await req('/api/project-reports',undefined,head)).data.projects.length,0);assert.equal((await req('/api/project-reports/farasan-reference',undefined,head)).status,403);
  const fetched=(await req('/api/project-reports/farasan-reference',undefined,ceo)).data;assert.equal(fetched.presentation.sitePlan.buildings.length,24);assert.equal(fetched.presentation.targetGroups.length,3);const reference=fetched.report;
  assert.equal((await req('/api/project-reports/farasan-reference/original?section=boq')).status,401);assert.equal((await req('/api/project-reports/farasan-reference/original?section=boq',undefined,head)).status,403);
  const document=await fetch(base+'/api/project-reports/farasan-reference/original?section=boq&theme=light',{headers:{Cookie:ceo!}});assert.equal(document.status,200);assert.ok(document.headers.get('content-type')?.includes('text/html'));assert.ok(document.headers.get('content-security-policy')?.includes("frame-ancestors 'self'"));assert.equal(document.headers.get('x-frame-options'),null);assert.ok((await document.text()).includes('data-theme="light"'));
assert.equal(reference.state,'reference');assert.equal(store.read().projectReports,undefined);
  const writer=(await req('/api/auth/login',{email:'writer@test.example',password:'test'})).cookie;
  const action=(a:string,v:number,c=writer,extra:any={})=>req('/api/project-reports/farasan-reference/action',{action:a,version:v,...extra},c);
  assert.equal((await action('save',0)).status,200);assert.equal(store.read().projectReports![0].version,1);
  assert.equal((await action('submit',0)).status,409);assert.equal((await action('submit',1)).status,200);
  assert.equal((await action('review',2)).status,400);assert.equal((await action('approve',2,admin)).status,400);
  assert.equal((await action('review',2,admin)).status,200);assert.equal((await action('approve',3,admin)).status,400);assert.equal((await action('approve',3,ceo)).status,200);
  let p=store.read().projectReports![0];assert.equal(p.state,'approved');assert.equal(p.events.length,4);assert.equal(p.events[0].actor,'ceo@test.example');
  const payload={data:{project:{title:'مشروع مستقل',contractNo:'NEW-1'}},snapshot:{at:'2026-11-04',by:'',s:{}},source:{name:'إدخال',at:'2026-11-04',by:''}};
  const fresh=await req('/api/project-reports',{payload},writer);assert.equal(fresh.status,201);assert.equal(fresh.data.report.data.overallProgress,undefined);assert.equal(fresh.data.report.data.ipcs,undefined);assert.notEqual(fresh.data.report.id,p.id);
  assert.equal((await req('/api/project-reports/'+fresh.data.report.id,undefined,head)).status,403);
  const oldHash=p.contentHash;assert.equal((await action('revision',4,writer,{payload})).status,200);p=store.read().projectReports![0];assert.equal(p.state,'draft');assert.equal(p.submittedBy,undefined);assert.notEqual(p.contentHash,oldHash);assert.equal(p.events[1].hash,oldHash);
  const restored=decodeState([...encodeState(store.read(),{}).values()]).state;assert.deepEqual(restored.projectReports?.find(r=>r.id===p.id),p);assert.equal(restored.projectReports?.length,2);
  assert.equal((await req('/api/project-reports',{payload},head)).status,403);
  assert.equal((await action('submit',5)).status,200);assert.equal((await action('return',6,admin)).status,400);assert.equal((await action('return',6,admin,{note:'استكمال المرفقات'})).status,200);
  assert.equal(store.read().projectReports![0].state,'returned');
 }finally{await new Promise<void>(r=>server.close(()=>r()));}
});
