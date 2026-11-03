import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dashboardActivity} from '../src/server/dashboardActivity';
import {MemoryExecutiveStore} from '../src/server/storeCore';
import {setDefaultStore} from '../src/server/storeContext';
import {ManagerAccounts} from '../src/server/managerAccounts';
import {createApplication} from '../src/server/app';
import type {ExecutiveState} from '../src/lib/executiveModel';
const fixture=():ExecutiveState=>({units:{},objectives:[],grants:{'head@test.example':{units:['investment'],actions:['read']}},audit:[],businessRecords:{investment:[{id:'opportunity',unitId:'investment',profileId:'investment',title:'فرصة مستودع لوجستي',values:{asset:'مستودع',currency:'SAR',invested:500000,stage:'study'},version:1,author:'ceo@test.example',createdAt:'2026-11-01T10:00:00Z',updatedAt:'2026-11-01T10:00:00Z'}]},reports:[{id:'report',unitId:'araak-stores',title:'تقرير أراك ستورز',period:'2026-11',summary:'الملخص الفعلي للتقرير',status:'submitted',author:'head@test.example',createdAt:'2026-11-02T10:00:00Z',attachments:[{id:'file',name:'report.pdf',mimeType:'application/pdf',size:1000}]}]});

test('dashboard projects stored investment and incoming report without fabricating approved metrics',()=>{
 const state=fixture(),before=structuredClone(state),activity=dashboardActivity(state);
 assert.equal(activity.recordCount,1);assert.equal(activity.reportCount,1);assert.equal(activity.reportsAwaitingReview,1);
 assert.equal(activity.records[0].title,'فرصة مستودع لوجستي');assert.equal(activity.records[0].status,'recorded');
 assert.equal(activity.reports[0].title,'تقرير أراك ستورز');assert.equal(activity.reports[0].attachmentCount,1);assert.equal(activity.reports[0].status,'submitted');
 assert.deepEqual(state,before);assert.equal(Object.values(state.units).filter(r=>r.approved).length,0);
 const pending={...state.businessRecords!.investment[0],title:'تعديل ينتظر الموافقة',updatedAt:'2026-11-03T10:00:00Z',version:2};
 state.platformSettings={pendingRecords:[{record:pending,baseVersion:1}]};
 const updated=dashboardActivity(state);assert.equal(updated.records.length,1);assert.equal(updated.records[0].status,'pending');assert.equal(updated.pendingRecordCount,1);
 assert.equal(state.businessRecords!.investment[0].title,'فرصة مستودع لوجستي');
 state.businessRecords!.investment.push(...Array.from({length:15},(_,i)=>({...pending,id:`extra-${i}`,updatedAt:`2026-11-${String(i+4).padStart(2,'0')}T10:00:00Z`})));
 const limited=dashboardActivity(state);assert.equal(limited.records.length,10);assert.equal(limited.recordCount,16);assert.equal(limited.records[0].id,'extra-14');
});

test('office receives live dashboard activity while scoped users cannot obtain the group feed',async()=>{
 const store=new MemoryExecutiveStore(fixture());setDefaultStore(store);
 const managers=new ManagerAccounts({read:()=>({}),write:()=>{}});
 const app=createApplication({sessionSecret:'dashboard-test-only',authUsers:{'ceo@test.example':{password:'test',role:'ceo'},'head@test.example':{password:'test',role:'head'}},managers});
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const request=async(path:string,body?:unknown,cookie?:string)=>{const r=await fetch(base+path,{headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 try{
  assert.equal((await request('/api/executive/state')).status,401);
  const ceo=(await request('/api/auth/login',{email:'ceo@test.example',password:'test'})).cookie;
  const head=(await request('/api/auth/login',{email:'head@test.example',password:'test'})).cookie;
  const office=(await request('/api/executive/state',undefined,ceo)).data;
  assert.equal(office.dashboardActivity.records[0].id,'opportunity');assert.equal(office.dashboardActivity.reports[0].id,'report');
  assert.equal(office.units.investment.approved,undefined);
  const scoped=(await request('/api/executive/state',undefined,head)).data;
  assert.equal(scoped.dashboardActivity,undefined);assert.equal(JSON.stringify(scoped).includes('تقرير أراك ستورز'),false);
  store.update(s=>{s.reports![0].status='reviewed';});
  assert.equal((await request('/api/executive/state',undefined,ceo)).data.dashboardActivity.reportsAwaitingReview,0);
 }finally{await new Promise<void>(r=>server.close(()=>r()));}
});
