import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApplication} from '../src/server/app';
import {MemoryExecutiveStore} from '../src/server/storeCore';
import {setDefaultStore} from '../src/server/storeContext';
import {ManagerAccounts,type Account} from '../src/server/managerAccounts';
import {encodeState,decodeState} from '../src/worker/storage';
import {hasPermission} from '../src/lib/executiveModel';

test('entity policies enforce scoped rights, publishing, individual write gates, agent constraints and stale-edit protection',async()=>{
 const store=new MemoryExecutiveStore();setDefaultStore(store);let accounts:Record<string,Account>={};
 const managers=new ManagerAccounts({read:()=>structuredClone(accounts),write:a=>{accounts=structuredClone(a);}});
 const app=createApplication({sessionSecret:'entity-admin-test',authUsers:{'ceo@test.example':{password:'test',role:'ceo'}},managers});
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
 const request=async(path:string,body?:unknown,cookie?:string)=>{const r=await fetch(base+path,{headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 const root='/api/platform-administration/entities/finance';
 try{
  const ceo=(await request('/api/auth/login',{email:'ceo@test.example',password:'test'})).cookie;
  await request('/api/manager-accounts',{email:'manager@test.example',password:'Password-test-2026',name:'مدير الاختبار',title:'مدير',unitId:'finance',units:['finance'],participation:'direct'},ceo);
  const manager=(await request('/api/auth/login',{email:'manager@test.example',password:'Password-test-2026'})).cookie;
  assert.equal((await request(root,undefined,manager)).status,403);
  const detail=await request(root,undefined,ceo);const original=detail.data.policy;
  assert.equal(original.version,0);assert.equal(detail.data.users[0].accessSource,'account');
  const grant=detail.data.users[0].grant;
  assert.equal((await request(root+'/access',{email:'manager@test.example',actions:['admin'],expectedGrant:grant},ceo)).status,400);
  assert.equal((await request(root+'/access',{email:'manager@test.example',actions:['read'],expectedGrant:grant},manager)).status,403);
  assert.equal((await request(root+'/access',{email:'manager@test.example',actions:['read'],expectedGrant:grant},ceo)).status,200);
  const input={title:'سجل مالي',values:{period:'2026',currency:'SAR',budget:20,actual:10,source:'اختبار'}};
  assert.equal((await request('/api/workspace/units/finance/records',input,manager)).status,403);
  assert.equal((await request(root+'/access',{email:'manager@test.example',actions:['read','edit'],expectedGrant:grant},ceo)).status,409);
  const edited=(await request(root,undefined,ceo)).data.users[0].grant;
  await request(root+'/access',{email:'manager@test.example',actions:[],inherit:true,expectedGrant:edited},ceo);
  assert.equal((await request('/api/workspace/units/finance/records',input,manager)).status,201);
  let p={...original,review:'review',agent:{...original.agent,name:'وكيل المالية والمخاطر',instructions:'ركز على السيولة والمخاطر',allowDocuments:false,maxQuestionLength:500}};
  assert.equal((await request(root+'/policy',{version:0,policy:p},ceo)).status,200);
  assert.equal((await request(root+'/policy',{version:0,policy:p},ceo)).status,409);
  const submitted=await request('/api/workspace/units/finance/records',{...input,title:'تحت المراجعة'},manager);
  assert.equal(submitted.data.pendingApproval,true);assert.equal(store.read().businessRecords!.finance.length,1);
  const agentInfo=(await request('/api/executive/units/finance',undefined,manager)).data.agent;
  assert.equal(agentInfo.name,'وكيل المالية والمخاطر');assert.equal(agentInfo.maxQuestionLength,500);
  assert.equal((await request('/api/unit-workspace/analyze',{unitId:'finance',message:'x'.repeat(501)},manager)).status,400);
  assert.equal((await request('/api/unit-workspace/analyze',{unitId:'finance',message:'تحليل',document:{name:'x.txt'}},ceo)).status,403);
  p=(await request(root,undefined,ceo)).data.policy;
  assert.equal((await request(root+'/policy',{version:p.version,policy:{...p,records:false,reports:false,uploads:false,tasks:false}},ceo)).status,200);
  assert.equal((await request('/api/workspace/units/finance/records',input,manager)).status,403);
  assert.equal((await request('/api/unit-workspace/documents',{unitId:'finance',document:{}},manager)).status,403);
  assert.equal((await request('/api/performance-reports',{unitId:'finance',title:'test',period:'now',summary:'x',attachments:[]},manager)).status,403);
  assert.equal((await request('/api/workspace/units/finance/records',input,ceo)).status,201);
  const saved=decodeState([...encodeState(store.read(),accounts).values()]);
  assert.equal(saved.state.platformSettings!.entityPolicies!.finance.agent.instructions,'ركز على السيولة والمخاطر');
  assert.ok((await request(root,undefined,ceo)).data.audit.every((a:any)=>a.unitId==='finance'));
  // Local deny wins over parent scope; another sibling keeps its inherited rights.
  const g={'a@test':{units:['support'],actions:['read','edit'] as any,unitActions:{finance:[]}}};
  assert.equal(hasPermission('a@test','head',g,'finance','read'),false);
  assert.equal(hasPermission('a@test','head',g,'hr','read'),true);
  assert.equal(hasPermission('a@test','ceo',g,'finance','read'),true);
 }finally{await new Promise<void>(r=>server.close(()=>r()));}
});
