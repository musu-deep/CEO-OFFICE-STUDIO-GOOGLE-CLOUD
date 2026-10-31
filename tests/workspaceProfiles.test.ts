import {test} from 'node:test';
import assert from 'node:assert/strict';
import {entities} from '../src/lib/executiveModel';
import {profileFor,validateDomainValues,workspaceProfiles} from '../src/lib/workspaceProfiles';

test('all actual entities have a domain and shared departments have dedicated profiles',()=>{
 for(const e of entities())assert.ok(workspaceProfiles[profileFor(e.id).id]);
 assert.equal(profileFor('finance').id,'finance');
 assert.equal(profileFor('hr').id,'hr');
 assert.equal(profileFor('marketing-social').id,'marketing');
 assert.equal(profileFor('warehouse').id,'logistics');
 assert.equal(profileFor('pricing-projects').id,'pricing');
 assert.equal(profileFor('steel-factory').layout,'production');
 assert.equal(profileFor('hr').layout,'staffing');
 assert.equal(profileFor('governance').layout,'register');
});
test('domain schemas reject unrelated fields and preserve missing values instead of zeros',()=>{
 const values=validateDomainValues('finance',{period:'2026-10',currency:'SAR',budget:0,actual:0,source:'كشف'});
 assert.equal(values.cash,undefined);assert.equal(values.actual,0);
 assert.throws(()=>validateDomainValues('hr',{budget:10}),/حقول/);
 assert.throws(()=>validateDomainValues('finance',{period:'2026-10',currency:'SAR',budget:NaN,actual:0,source:'كشف'}),/غير صالحة/);
 assert.throws(()=>validateDomainValues('national-projects',{project:'مشروع',milestone:'معلم',progress:101,currency:'SAR',status:'open'}),/غير صالحة/);
});
