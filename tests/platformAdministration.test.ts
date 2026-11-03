import crypto from 'node:crypto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApplication} from '../src/server/app';
import {MemoryExecutiveStore} from '../src/server/storeCore';
import {setDefaultStore} from '../src/server/storeContext';
import {ManagerAccounts,type Account} from '../src/server/managerAccounts';
import {encodeState,decodeState} from '../src/worker/storage';

test('administration: protected bootstrap, managed users, moderation isolation, closure, agents, registration and persistence',async()=>{
 class TestStore extends MemoryExecutiveStore {
  files=new Map<string,Buffer>();
  document(input:{name:string;mimeType:string;data:string}){const id=crypto.randomUUID();this.files.set(id,Buffer.from(input.data,'base64'));return {id,name:input.name,mimeType:input.mimeType};}
  bytes(id:string){return this.files.get(id)!;}
  removeDocument(id:string){this.files.delete(id);}
 }
 const store=new TestStore();setDefaultStore(store);
 let accounts:Record<string,Account>={};
 const managers=new ManagerAccounts({read:()=>structuredClone(accounts),write:a=>{accounts=structuredClone(a);}});
 const app=createApplication({sessionSecret:'admin-test-only',authUsers:{'ceo@test.example':{password:'test',role:'ceo'}},managers});
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
 const address=server.address() as {port:number},base=`http://127.0.0.1:${address.port}`;
 const request=async(path:string,body?:unknown,cookie?:string,method?:string)=>{const response=await fetch(base+path,{method:method||(body===undefined?'GET':'POST'),headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};};
 const registration={email:'manager@test.example',name:'مدير',title:'مدير جهة',unitId:'finance',password:'Manager-password-2026'};
 const settings={registration:'approval',closedUnits:[],disabledAgents:[]};
 try{
  assert.equal((await request('/api/platform-administration')).status,401);
  const ceo=(await request('/api/auth/login',{email:'ceo@test.example',password:'test'})).cookie;
  assert.equal((await request('/api/manager-accounts',{...registration,units:['finance'],participation:'review'},ceo)).status,201);
  const manager=(await request('/api/auth/login',{email:registration.email,password:registration.password})).cookie;
  assert.equal((await request('/api/platform-administration',undefined,manager)).status,403);
  assert.equal((await request('/api/platform-administration/settings',settings,manager)).status,403);
  assert.equal((await request('/api/manager-accounts/ceo%40test.example',undefined,ceo,'DELETE')).status,404);
  const listing=(await request('/api/manager-accounts',undefined,ceo)).data;
  assert.equal(listing.protectedAccounts.length,1);assert.equal(listing.accounts[0].hash,undefined);assert.equal(listing.accounts[0].participation,'review');
  const input={title:'سجل ينتظر الموافقة',values:{period:'2026',currency:'SAR',budget:100,actual:80,source:'اختبار'}};
  const submitted=await request('/api/workspace/units/finance/records',input,manager);
  assert.equal(submitted.status,201);assert.equal(submitted.data.pendingApproval,true);
  assert.equal(store.read().businessRecords?.finance.length,0);
  const pending=submitted.data.record;
  const own=(await request('/api/workspace/units/finance/records',undefined,manager)).data.records;
  assert.equal(own[0].pendingApproval,true);
  await request('/api/manager-accounts',{...registration,email:'other@test.example',units:['finance'],participation:'direct'},ceo);
  const other=(await request('/api/auth/login',{email:'other@test.example',password:registration.password})).cookie;
  assert.equal((await request('/api/workspace/units/finance/records',undefined,other)).data.records.length,0);
  const action={kind:'pending',id:pending.id,unitId:'finance',version:pending.version};
  assert.equal((await request('/api/platform-administration/content/action',{...action,action:'approve'},manager)).status,403);
  assert.equal((await request('/api/platform-administration/content/action',{...action,action:'return',note:'أكمل المرجع'},ceo)).status,200);
  assert.equal((await request('/api/workspace/units/finance/records',undefined,manager)).data.records[0].moderationNote,'أكمل المرجع');
  const revision=await request('/api/workspace/units/finance/records',{...input,id:pending.id,version:pending.version,title:'سجل بعد التعديل'},manager);
  assert.equal(revision.status,200);
  assert.equal((await request('/api/platform-administration/content/action',{...action,version:revision.data.record.version,action:'approve'},ceo)).status,200);
  assert.equal(store.read().businessRecords?.finance[0].title,'سجل بعد التعديل');
  assert.equal((await request('/api/workspace/units/finance/records',undefined,other)).data.records.length,1);
  const published=store.read().businessRecords!.finance[0];
  const update=await request('/api/workspace/units/finance/records',{...input,title:'تعديل لم ينشر بعد',id:published.id,version:published.version},manager);
  assert.equal(update.status,200);
  assert.equal((await request('/api/workspace/units/finance/records',undefined,other)).data.records[0].title,'سجل بعد التعديل');
  assert.equal((await request('/api/platform-administration/content/action',{kind:'pending',id:published.id,unitId:'finance',version:update.data.record.version,action:'approve'},ceo)).status,200);
  const task=await request('/api/workspace/tasks',{unitId:'finance',title:'تكليف إغلاق',due:'2026-12-01',assigneeEmail:registration.email},ceo);
  assert.equal(task.status,201);
  assert.equal((await request('/api/platform-administration/content/action',{kind:'task',id:task.data.task.id,unitId:'finance',action:'close'},ceo)).status,200);
  assert.equal(store.read().units.finance.directives[0].status,'closed');
  const uploaded=await request('/api/unit-workspace/documents',{unitId:'finance',document:{name:'test.pdf',mimeType:'application/pdf',data:Buffer.from('sample').toString('base64')}},manager);
  assert.equal(uploaded.status,200);
  const doc=store.read().units.finance.documents[0];assert.equal(doc.moderation,'pending');
  assert.equal((await request('/api/executive/units/finance',undefined,other)).data.record.documents.length,0);
  assert.equal((await request(`/api/executive/units/finance/documents/${doc.id}`,undefined,other)).status,404);
  assert.equal((await request('/api/platform-administration/content/action',{kind:'document',id:doc.id,unitId:'finance',action:'approve'},ceo)).status,200);
  assert.equal((await request('/api/executive/units/finance',undefined,other)).data.record.documents.length,1);
  assert.equal((await request('/api/platform-administration/content/action',{kind:'document',id:doc.id,unitId:'finance',action:'delete'},ceo)).status,200);
  assert.equal(store.files.has(doc.id),false);
  await request('/api/manager-accounts/manager%40test.example/participation',{participation:'blocked'},ceo);
  assert.equal((await request('/api/workspace/units/finance/records',input,manager)).status,403);
  assert.equal((await request('/api/workspace/units/finance/records',undefined,manager)).status,200);
  await request('/api/platform-administration/settings',{...settings,closedUnits:['finance'],disabledAgents:['finance']},ceo);
  assert.equal((await request('/api/workspace/units/finance/records',input,other)).status,403);
  assert.equal((await request('/api/unit-workspace/analyze',{unitId:'finance',message:'اختبار'},ceo)).status,403);
  const persisted=decodeState([...encodeState(store.read(),accounts).values()]);
  assert.deepEqual(persisted.state.platformSettings?.disabledAgents,['finance']);assert.equal(persisted.accounts[registration.email].participation,'blocked');
  await request('/api/platform-administration/settings',{...settings,registration:'closed'},ceo);
  assert.equal((await request('/api/auth/register',{...registration,email:'new@test.example'})).status,503);
  await request('/api/platform-administration/settings',{...settings,registration:'automatic'},ceo);
  assert.equal((await request('/api/auth/register',{...registration,email:'new@test.example'})).status,202);
  assert.equal((await request('/api/auth/login',{email:'new@test.example',password:registration.password})).status,200);
  assert.deepEqual(store.read().grants['new@test.example'].units,['finance']);
  assert.equal((await request('/api/manager-accounts/manager%40test.example',undefined,ceo,'DELETE')).status,200);
  assert.equal((await request('/api/auth/me',undefined,manager)).status,401);
  assert.ok(store.read().audit.some(a=>a.action.includes('حذف حساب')));
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
