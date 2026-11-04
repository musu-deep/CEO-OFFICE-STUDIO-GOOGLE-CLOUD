import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createApplication} from '../src/server/app';
import {ManagerAccounts} from '../src/server/managerAccounts';
import {ExecutiveStore} from '../src/server/executiveStore';
import {setDefaultStore} from '../src/server/storeContext';
import {blankProjectInput,inputSections,getAt,setAt} from '../src/lib/projectInputModel';
import {projectInputSchema} from '../src/server/projectInputSchema';
import {projectComparison} from '../src/server/projectComparison';
import {encodeState,decodeState} from '../src/worker/storage';

test('input schema covers all editable sections without importing reference amounts into new projects',()=>{
 const blank=blankProjectInput('اختبار');assert.equal(blank.data.boq.length,0);assert.equal(blank.data.types.length,0);assert.equal(blank.snapshot.s.wos.length,0);
 for(const [,name,paths] of inputSections)for(const p of paths){const s=getAt(projectInputSchema,['fields',...p.flatMap((k,i)=>i<p.length-1?[k,'fields']:[k])]);assert.ok(s,`${name}/${p.join('.')}`);}
 assert.equal(projectInputSchema.fields!.data.fields!.boq.item!.fields!.certifiedValue.kind,'number');
 const edited=setAt(blank,['data','project','title'],'معدل');assert.equal(blank.data.project.title,'اختبار');assert.equal(edited.data.project.title,'معدل');
});

test('scoped authoring, attachment access, independent review, frozen publication and comparison',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'project-author-')),store=new ExecutiveStore(dir);setDefaultStore(store);
 store.update(s=>{s.grants['engineer@test.example']={units:['national-projects'],actions:['read','upload']};s.grants['reviewer@test.example']={units:['national-projects'],actions:['read','review']};s.grants['other@test.example']={units:['finance'],actions:['read','edit']};});
 const accounts={'engineer@test.example':{password:'test',role:'head'},'reviewer@test.example':{password:'test',role:'head'},'other@test.example':{password:'test',role:'head'},'ceo@test.example':{password:'test',role:'ceo'}};
 const app=createApplication({sessionSecret:'authoring-test-only',authUsers:accounts,managers:new ManagerAccounts({read:()=>({}),write:()=>{}})});const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));const base=`http://127.0.0.1:${(server.address() as any).port}`;
 async function req(url:string,body:any,cookie=''){const r=await fetch(base+url,{headers:{Cookie:cookie,'Content-Type':'application/json'},...(body===undefined?{}:{method:'POST',body:JSON.stringify(body)})});const d=await r.json();return {status:r.status,data:d};}
 const cookies:Record<string,string>={};
 try{
  for(const email of Object.keys(accounts)){const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:'test'})});assert.equal(r.status,200);cookies[email.split('@')[0]]=r.headers.get('set-cookie')!.split(';')[0];}
  const {engineer,reviewer,ceo,other}=cookies;
  assert.equal((await req('/api/project-reports/input-schema',undefined,reviewer)).status,200);
  assert.equal((await req('/api/workspace',undefined,engineer)).data.canProjectReporting,true);
  assert.equal((await req('/api/workspace',undefined,ceo)).data.canProjectReporting,false);
  assert.equal((await req('/api/project-reports',undefined,ceo)).data.canCreate,false);
  const payload=blankProjectInput('مشروع أ') as any;Object.assign(payload.data.project,{periodFrom:'2026-11-01',periodTo:'2026-11-30'});payload.data.boq=[{code:'CONC',ar:'الخرسانة',unit:'م³',comparisonKey:'concrete',contractValue:1000,certifiedValue:400}];
  assert.equal((await req('/api/project-reports',{payload,unitId:'national-projects'},ceo)).status,403);
  const made=await req('/api/project-reports',{payload,unitId:'national-projects'},engineer);assert.equal(made.status,201);let p=made.data.report;
  const url='/api/project-reports/'+p.id;
  const capability=(await req(url+'?mode=edit',undefined,ceo)).data;assert.equal(capability.canAuthor,false);assert.ok(!capability.permissions.includes('edit'));assert.ok(!capability.permissions.includes('upload'));
  for(const action of ['save','revision','submit'])assert.equal((await req(url+'/action',{action,version:p.version,payload},ceo)).status,403);
  assert.equal((await req(url+'/attachments',{version:p.version,file:{name:'test.pdf',mimeType:'application/pdf',data:Buffer.from('%PDF').toString('base64')}},ceo)).status,403);
  assert.equal((await req(url,undefined,ceo)).status,404);assert.equal((await req(url+'?mode=edit',undefined,other)).status,403);
  assert.equal((await req('/api/project-reports',{payload,unitId:'national-projects'},reviewer)).status,403);
  const attached=await req(url+'/attachments',{version:p.version,file:{name:'قياس.pdf',mimeType:'application/pdf',data:Buffer.from('%PDF-test').toString('base64')}},engineer);assert.equal(attached.status,201);p=attached.data.report;const f=p.attachments[0];
  assert.equal((await fetch(base+url+'/attachments/'+f.id,{headers:{Cookie:ceo}})).status,404);
  assert.equal((await fetch(base+url+'/attachments/'+f.id+'?mode=edit',{headers:{Cookie:reviewer}})).status,200);
  assert.equal((await fetch(base+url+'/attachments/'+f.id+'?mode=edit',{headers:{Cookie:other}})).status,403);
  async function action(kind:string,cookie:string,extra={}){const r=await req(url+'/action',{action:kind,version:p.version,...extra},cookie);if(r.status===200)p=r.data.report;return r;}
  assert.equal((await action('submit',engineer)).status,200);
  assert.equal((await action('revision',engineer,{payload})).status,400);
  assert.equal((await action('review',engineer)).status,403);
  assert.equal((await action('review',reviewer)).status,200);
  assert.equal((await action('approve',reviewer)).status,403);
  assert.equal((await action('approve',ceo)).status,200);
  const publishedVersion=p.version;assert.equal((await req(url,undefined,ceo)).data.report.data.boq[0].certifiedValue,400);
  assert.equal(await (await fetch(base+url+'/attachments/'+f.id,{headers:{Cookie:ceo}})).text(),'%PDF-test');
  const changed=structuredClone(payload);changed.data.project.title='مسودة معدلة';changed.data.boq[0].certifiedValue=800;
  assert.equal((await action('revision',engineer,{payload:changed})).status,200);
  const visible=(await req(url,undefined,ceo)).data.report;assert.equal(visible.version,publishedVersion);assert.equal(visible.name,'مشروع أ');assert.equal(visible.data.boq[0].certifiedValue,400);
  assert.equal((await req(url+'?mode=edit',undefined,engineer)).data.report.data.boq[0].certifiedValue,800);
  const rows=encodeState(store.read(),{});assert.ok([...rows.values()].some((r:any)=>r.kind==='project-published'));assert.deepEqual(decodeState([...rows.values()]).state.projectReports,store.read().projectReports);
  const restored=new ExecutiveStore(dir);assert.equal(restored.read().projectReports![0].published!.payload.data.boq[0].certifiedValue,400);
  const compared=await req('/api/project-reports/comparison?ids='+p.id+'&keys=concrete',undefined,ceo);assert.equal(compared.status,200);assert.equal(compared.data.rows[0].cells[0].certifiedValue,400);assert.equal(compared.data.rows[0].comparable,true);
  assert.equal((await req('/api/project-reports/comparison?ids='+p.id+'&keys=concrete',undefined,other)).status,403);
  const p2=structuredClone(visible);p2.id='other-project';p2.name='مشروع ب';p2.data.project.currency='USD';p2.data.boq[0].unit='م²';p2.data.project.periodTo='2026-12-31';
  const matrix=projectComparison([visible,p2],['concrete','missing']);assert.equal(matrix.rows[0].comparable,false);assert.equal(matrix.rows[0].reasons.length,3);assert.equal(matrix.rows[1].cells[0].available,false);
 }finally{await new Promise<void>(r=>server.close(()=>r()));fs.rmSync(dir,{recursive:true,force:true});}
});
