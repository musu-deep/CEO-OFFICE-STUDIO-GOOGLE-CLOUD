import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hasPermission,comparable,resolveEntity,entities,registrationEntities } from '../src/lib/executiveModel';
import { ExecutiveStore } from '../src/server/executiveStore';
test('companies retain operational units but never inherit shared departments',()=>{
 const grants={'a@test.com':{units:['national'],actions:['read','upload'] as any}};
 assert.equal(hasPermission('a@test.com','head',grants,'trading','read'),true);
 assert.equal(hasPermission('a@test.com','head',grants,'sites','read'),true);
 for(const id of ['finance','legal','warehouse','it','national::finance','digital::finance'])assert.equal(hasPermission('a@test.com','head',grants,id,'read'),false);
 assert.equal(hasPermission('a@test.com','head',grants,'national','approve'),false);
 assert.equal(hasPermission('b@test.com','head',grants,'national','read'),false);
 assert.equal(resolveEntity('national::legal'),undefined);
 assert.equal(resolveEntity('warehouse')?.root,'support');
 assert.equal(entities().some(e=>e.id.includes('::')),false);
 const options=registrationEntities();
 assert.equal(options.filter(e=>e.id==='finance').length,1);
 assert.equal(options.filter(e=>e.id==='warehouse').length,1);
 assert.equal(options.some(e=>['support','sites','pricing-project-link','contracts-procurement'].includes(e.id)),false);
 const oldGrant={'a@test.com':{units:['national::finance'],actions:['read'] as any}};
 assert.equal(hasPermission('a@test.com','head',oldGrant,'finance','read'),false);
});
test('comparison refuses missing definitions, periods, currencies and direction mismatches',()=>{
 const a:any={definition:'net sales',dimension:'revenue',period:'2026-Q4',unit:'SAR',direction:'up'};
 assert.equal(comparable(a,{...a}),true);
 for(const b of [{...a,unit:'USD'},{...a,period:'2026-Q3'},{...a,direction:'down'},{...a,definition:''},{...a,dimension:'cash'}])assert.equal(comparable(a,b),false);
});
test('records survive store restart and stale writes cannot overwrite them',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'araak-records-'));
 try{const s=new ExecutiveStore(dir),actor={email:'ceo@test.com',role:'ceo'},draft={summary:'سجل',metrics:[{label:'إنجاز',value:75,target:100,unit:'٪',period:'2026-Q4',direction:'up',dimension:'plan',definition:'plan milestones'}]};
 s.saveDraft(actor,'national',draft,0,'تقرير');
 assert.throws(()=>s.saveDraft(actor,'national',draft,0,'قديم'),/تغيرت/);
 const reopened=new ExecutiveStore(dir);assert.equal(reopened.read().units.national.pending?.snapshot.metrics[0].value,75);assert.equal(reopened.read().units.national.approved,undefined);
 assert.throws(()=>s.saveDraft({email:'stranger@test.com',role:'partner'},'national',draft,1,'اختبار'),/صلاحية/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
