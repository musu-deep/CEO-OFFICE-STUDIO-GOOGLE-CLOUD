import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
test('authenticated shared records: scopes, review, approval, documents, directives, conflicts and AI gating',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'araak-api-')),port=4478;
 const users={'ceo@test.com':{password:'test',role:'ceo'},'head@test.com':{password:'test',role:'head'},'partner@test.com':{password:'test',role:'partner'}};
 const p=spawn(process.execPath,['dist/server.cjs'],{env:{...process.env,NODE_ENV:'production',PORT:String(port),EXECUTIVE_DATA_DIR:dir,SESSION_SECRET:'unit-integration-test-only',ARAAK_AUTH_USERS:JSON.stringify(users),GEMINI_API_KEY:''},stdio:'ignore'});
 const request=async(route,body,cookie)=>{const r=await fetch(`http://127.0.0.1:${port}${route}`,{headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body!==undefined?{method:'POST',body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 try{
 for(let i=0;i<60;i++){try{await fetch(`http://127.0.0.1:${port}/health`);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 assert.equal((await request('/api/executive/state')).status,401);
 const login=async email=>(await request('/api/auth/login',{email,password:'test'})).cookie;
 const ceo=await login('ceo@test.com'),head=await login('head@test.com'),partner=await login('partner@test.com');
 assert.equal((await request('/api/executive/state',undefined,head)).data.entities.length,0);
 assert.equal((await request('/api/executive/grants',{email:'head@test.com',grant:{units:['national'],actions:['read','edit','review']}},head)).status,403);
 await request('/api/executive/grants',{email:'head@test.com',grant:{units:['national'],actions:['read','edit','review']}},ceo);
 await request('/api/executive/grants',{email:'partner@test.com',grant:{units:['national'],actions:['upload']}},ceo);
 assert.equal((await request('/api/executive/units/digital',undefined,head)).status,403);
 assert.equal((await request('/api/unit-workspace/analyze',{unitId:'digital',message:'test'},head)).status,403);
 const snapshot={summary:'Q4',metrics:[{label:'إنجاز',value:75,target:100,unit:'٪',period:'2026-Q4',dimension:'plan',definition:'milestones',direction:'up'}],risks:[],decisions:[]};
 assert.equal((await request('/api/executive/units/national/draft',{snapshot,version:0},head)).status,200);
 assert.equal((await request('/api/executive/units/national/draft',{snapshot,version:0},head)).status,409);
 let shared=(await request('/api/executive/units/national',undefined,ceo)).data.record;
 assert.equal(shared.pending.snapshot.metrics[0].value,75);assert.equal(shared.approved,undefined);
 assert.equal((await request('/api/executive/units/national/review',{action:'approve',version:1},ceo)).status,400);
 assert.equal((await request('/api/executive/units/national/review',{action:'review',version:1},head)).status,200);
 assert.equal((await request('/api/executive/units/national/review',{action:'approve',version:2},head)).status,403);
 assert.equal((await request('/api/executive/units/national/review',{action:'approve',version:2},ceo)).status,200);
 shared=(await request('/api/executive/units/national',undefined,head)).data.record;assert.equal(shared.approved.snapshot.metrics[0].dimension,'plan');assert.equal(shared.pending,undefined);
 const partnerRecord=(await request('/api/executive/units/national',undefined,partner)).data.record;assert.equal(partnerRecord.approved,undefined);
 const doc={name:'report.txt',mimeType:'text/plain',data:Buffer.from('test report').toString('base64')};
 assert.equal((await request('/api/unit-workspace/documents',{unitId:'national',document:doc},partner)).status,200);
 shared=(await request('/api/executive/units/national',undefined,head)).data.record;
 let r=await fetch(`http://127.0.0.1:${port}/api/executive/units/national/documents/${shared.documents[0].id}`,{headers:{Cookie:head}});assert.equal(await r.text(),'test report');
 r=await fetch(`http://127.0.0.1:${port}/api/executive/units/national/documents/${shared.documents[0].id}`,{headers:{Cookie:partner}});assert.equal(r.status,403);
 assert.equal((await request('/api/unit-workspace/analyze',{unitId:'national',message:'test'},head)).status,503);
 assert.equal((await request('/api/executive/units/national/directives',{title:'تصحيح',owner:'مسؤول',due:'2026-12-01'},ceo)).status,200);
 assert.equal((await request('/api/executive/units/national/directives',{title:'تصحيح',owner:'مسؤول',due:'2026-12-01'},head)).status,403);
 assert.equal((await request('/api/executive/administration',undefined,ceo)).data.audit.length>0,true);
 assert.equal((await request('/api/executive/backup',undefined,partner)).status,403);
 }finally{p.kill();await new Promise(resolve=>p.once('exit',resolve));fs.rmSync(dir,{recursive:true,force:true});}
});
