import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dashboardCounters,dashboardCounterItems} from '../src/server/dashboardCounters';
import {emptyRecord,type ExecutiveState} from '../src/lib/executiveModel';

test('counter sources distinguish three reports, reviews, one record, goals and KPI approval',()=>{
 const state:ExecutiveState={units:{},objectives:[],grants:{},audit:[],businessRecords:{investment:[{id:'record',unitId:'investment',profileId:'investment',title:'فرصة مستودع',values:{asset:'مستودع',currency:'SAR',stage:'study'},version:1,author:'ceo@test',createdAt:'2026-11-01',updatedAt:'2026-11-01'}]},reports:[0,1,2].map(i=>({id:`report-${i}`,unitId:i===0?'araak-stores':'national-projects',title:i===0?'اجتماع أراك ستورز':'تقرير تكلفة المشروع',period:'2026-11',summary:'تقرير فعلي',author:'ceo@test',createdAt:'2026-11-03',status:i===0?'reviewed':'submitted',attachments:[{id:`file-${i}`,name:'report.pdf',size:10,mimeType:'application/pdf'}]}))};
 const counters=dashboardCounters(state),get=(id:string)=>counters.find(c=>c.id===id)!;
 assert.equal(get('records').value,1);assert.equal(get('reports').value,3);assert.equal(get('reports-submitted').value,2);assert.equal(get('reports-reviewed').value,1);
 assert.equal(get('open-tasks').value,0);assert.equal(get('approved-units').value,0);assert.equal(get('pending-metrics').value,0);assert.equal(get('objectives').value,0);
 for(const counter of counters)assert.equal(counter.value,dashboardCounterItems(state,counter.id).length);
 assert.deepEqual(dashboardCounterItems(state,'reports-submitted').map(i=>i.id),['report-1','report-2']);
 assert.match(get('approved-units').description,/لا يُحتسب/);assert.ok(get('approved-units').emptyMessage.length>0);
 state.reports![1].status='reviewed';const updated=dashboardCounters(state);assert.equal(updated.find(c=>c.id==='reports-submitted')!.value,1);assert.equal(updated.find(c=>c.id==='reports-reviewed')!.value,2);
 assert.equal(updated.find(c=>c.id==='approved-units')!.value,0);
});

test('overdue means before Riyadh today, excludes closed tasks; returned KPI drafts are separate',()=>{
 const unit=emptyRecord();unit.directives=[['yesterday','2026-11-03','open'],['today','2026-11-04','working'],['closed','2026-11-01','closed']].map(([id,due,status])=>({id,title:id,due,status:status as any,owner:'مدير',author:'ceo@test',createdAt:'2026-11-01'}));
 unit.pending={id:'draft',state:'returned',author:'ceo@test',createdAt:'2026-11-01',snapshot:{summary:'ملف مؤشرات معاد',metrics:[],risks:[],decisions:[],source:'اختبار'}} as any;
 const state:ExecutiveState={units:{finance:unit},objectives:[],grants:{},audit:[]},now=new Date('2026-11-03T21:30:00Z');
 assert.equal(dashboardCounterItems(state,'open-tasks',now).length,2);assert.deepEqual(dashboardCounterItems(state,'overdue-tasks',now).map(i=>i.id),['yesterday']);
 assert.equal(dashboardCounterItems(state,'pending-metrics',now).length,0);
 unit.pending!.state='reviewed';assert.equal(dashboardCounterItems(state,'pending-metrics',now).length,1);
});
