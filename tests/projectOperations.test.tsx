import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import type {ProjectPayload} from '../src/lib/projectReports';
import seed from '../src/server/data/farasan-report.json';
import {projectPresentation} from '../src/server/projectPresentation';
import {projectOperations,workOrderCost} from '../src/lib/projectOperations';
import {validateProjectPayload} from '../src/server/projectReports';
import Dashboard from '../src/components/ProjectOperationsDashboard';
const copy=():ProjectPayload=>structuredClone(seed);

test('source site layout and target classification are isolated, preserve real progress and reconcile work-order allocations',()=>{
 const p=copy(),before=JSON.stringify(p),layout=projectPresentation(p),m=projectOperations(p,layout);
 assert.equal(layout.sitePlan.buildings.length,24);assert.equal(m.buildings.length,24);assert.equal(m.buildings.reduce((s,b)=>s+b.units.length,0),92);
 assert.deepEqual(m.groups.map(g=>[g.id,g.buildings.length,g.units]),[['T12',8,32],['T3',6,20],['T4',10,40]]);
 assert.equal(m.groups[0].reportedComplete,true);assert.ok(m.groups[0].progress<1);assert.ok(m.groups[0].progress>.87);
 assert.equal(m.work.filter(w=>w.billable!>0).length,0);assert.equal(m.tasks.length,10);assert.equal(workOrderCost(p.snapshot.s.wos[0]).total,15850);
 const cost=m.work.reduce((s,w)=>s+w.cost.total,0);assert.ok(Math.abs(m.groups.reduce((s,g)=>s+g.cost,0)-cost)<.001);assert.equal(JSON.stringify(p),before);
 const other=copy();other.data.project.contractNo='OTHER';assert.equal(projectPresentation(other).sitePlan,null);assert.equal(projectPresentation(other).targetGroups.length,0);
 const b=m.buildings.find(b=>b.id==='D2-7');assert.ok(b?.workOrders.some(w=>w.no==='WO-0009'));assert.ok(m.wip(['D2-7']).every(r=>r.workOrders.every(w=>w.buildingIds.includes('D2-7'))));
});

test('billing eligibility caps overlapping closed orders, reserves draft invoices and leaves unknown allocations unpriced',()=>{
 const p=copy(),w={...p.snapshot.s.wos[0],status:'closed',billPct:100,billed:false};
 p.snapshot.s.wos=[{...w,no:'A'},{...w,no:'B'}];let m=projectOperations(p,projectPresentation(p));const contract=m.buildings.find(b=>b.id==='D2-7')!.contractValue!;assert.ok(m.work[0].billable!>0);assert.equal(m.work[1].billable,0);assert.ok(m.work[0].billable!<contract);
 p.snapshot.s.nipc=[{status:'draft',lines:[{b:'D2-7',code:w.boq,pct:100}]}] as any;m=projectOperations(p,projectPresentation(p));assert.equal(m.work.reduce((s,w)=>s+(w.billable||0),0),0);
 p.snapshot.s.nipc=[];p.snapshot.s.wos=[{...w,bldgs:['unknown']}];m=projectOperations(p,projectPresentation(p));assert.equal(m.work[0].billable,null);assert.equal(m.work[0].allocationValid,false);
 const partial=workOrderCost({mode:'sub',value:100,mats:[{qty:3,price:''}]});assert.equal(partial.total,100);assert.equal(partial.missing,1);
});

test('presentation can be exported and imported with validated geometry; blank projects inherit no targets, buildings or billing',()=>{
 const p=copy(),presentation=projectPresentation(p),exported={...p,data:{...p.data,sitePlan:presentation.sitePlan,targetGroups:presentation.targetGroups}};
 assert.equal(validateProjectPayload(exported).data.sitePlan.buildings.length,24);
 const bad=structuredClone(exported);bad.data.sitePlan.buildings[0].width=NaN;assert.throws(()=>validateProjectPayload(bad));
 const duplicate=structuredClone(exported);duplicate.data.targetGroups[1].buildingIds.push(duplicate.data.targetGroups[0].buildingIds[0]);assert.throws(()=>validateProjectPayload(duplicate));
 const blank=validateProjectPayload({data:{project:{title:'مشروع آخر'}},snapshot:{s:{}},source:{}}),m=projectOperations(blank,projectPresentation(blank));assert.equal(m.buildings.length,0);assert.equal(m.work.length,0);assert.equal(m.groups.length,0);assert.equal(m.ipc,undefined);
 const broken=copy();broken.snapshot.s.wos[0].mats='invalid' as any;assert.throws(()=>validateProjectPayload(broken));
});

test('project dashboard renders source-driven map controls, all requested dashboard sections and safe empty states',()=>{
 const Panel=({title,children}:any)=>createElement('section',null,createElement('h2',null,title),children),Metric=({label,value}:any)=>createElement('div',null,label,value),DataTable=({rows}:any)=>createElement('div',null,rows.length+' records'),DetailValue=()=>null;
 const render=(p:any)=>renderToStaticMarkup(createElement(Dashboard,{report:p,presentation:projectPresentation(p),Panel,Metric,DataTable,DetailValue,onFinance:()=>{},onBoq:()=>{}}));
 const html=render({...copy(),id:'source'});for(const label of ['مؤشرات المستهدفات','مخطط الموقع التفاعلي','بنود جاهزة للفوترة','المهام المجدولة والتكليفات','أوامر العمل وتكلفتها وتكليفاتها','الأعمال الجارية حسب كل مستهدف'])assert.ok(html.includes(label));
 assert.equal((html.match(/class="pr-map-building"/g)||[]).length,48);assert.ok(html.includes('توسيع المخطط'));assert.ok(!html.includes('نبض'));
 const empty=render({data:{project:{title:'فارغ'}},snapshot:{s:{}},source:{},id:'blank'});assert.ok(empty.includes('لا يوجد مستخلص موثق'));
});
