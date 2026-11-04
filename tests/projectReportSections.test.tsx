import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import seed from '../src/server/data/farasan-report.json';
import {projectPresentation} from '../src/server/projectPresentation';
import {projectReportTabs,supplyRows,inventoryRows,laborRows,additionalProjectSections} from '../src/lib/projectReportSections';
import {validateProjectPayload} from '../src/server/projectReports';
import Sections from '../src/components/ProjectReportSections';
import type {ProjectPayload} from '../src/lib/projectReports';
const copy=():ProjectPayload=>structuredClone(seed);

test('every original report menu section has a distinct horizontal destination',()=>{
 const required=['إدارة المهام','المقايسة','جداول الكميات','مستخلصات المشروع','الجدول الزمني','جدول التوريدات','المشتريات','المستودعات','العمالة ومقاولو الباطن','الموقع وأوامر العمل','سجل التدقيق'];
 assert.ok(required.every(label=>projectReportTabs.some(t=>t[1]===label)));assert.equal(new Set(projectReportTabs.map(t=>t[0])).size,projectReportTabs.length);
});

test('supply detail preserves schedule provenance, hidden and orphan records and calculates lead dates without inventing missing values',()=>{
 const p=copy(),rows=supplyRows(p,projectPresentation(p));assert.ok(rows.length>=p.data.schedule3.rows.length);assert.equal(rows[0].status,'delivered');assert.equal(rows[0].sourceRow.ar,'أعمال البلوك');assert.ok(rows.some(r=>r.orderNo==='P.O-42302'));
 p.snapshot.s.sup={lead:21,rows:{'m3:r0':{need:'2026-11-30',hidden:true}},tbl:{},manual:[]};const first=supplyRows(p,projectPresentation(p))[0];assert.equal(first.orderBy,'2026-11-09');assert.equal(first.needSource,'موعد مسجل');assert.equal(first.visible,false);
});

test('warehouse balances require documented opening stock and exclude unissued requests',()=>{
 const p=copy(),before=JSON.stringify(p),initial=inventoryRows(p,projectPresentation(p));assert.ok(initial.length>100);assert.equal(initial[0].opening,null);assert.equal(initial[0].balance,null);assert.equal(initial[0].received,0);assert.equal(JSON.stringify(p),before);
 p.data.qtyTables[0].rows[0]['المتوفر']=10;p.snapshot.s.grns=[{k:'0#0',qty:5,no:'GRN-1'}];p.snapshot.s.mirs=[{k:'0#0',qty:2,st:'issued'},{k:'0#0',qty:4,st:'requested'}];const r=inventoryRows(p,projectPresentation(p))[0];assert.equal(r.balance,13);assert.equal(r.requested,4);assert.equal(r.issued,2);
});

test('labor records retain missing prices, exact contractor links and optional rate directories',()=>{
 const p=copy(),model=laborRows(p,projectPresentation(p));assert.equal(model.contractors.length,3);assert.ok(model.contractors.every(c=>c.contractValue===null));assert.equal(model.rates.length,0);assert.ok(model.labor.some(r=>r.rate===null&&r.amount===null));
 p.snapshot.s.rates={r:{'عامل':100}};assert.equal(validateProjectPayload(p).snapshot.s.rates.r['عامل'],100);
});

test('each added section renders its full detail tables and safe empty project state',()=>{
 const Panel=({title,children}:any)=>createElement('section',null,createElement('h2',null,title),children),Metric=({label}:any)=>createElement('div',null,label),DataTable=({rows}:any)=>createElement('div',null,rows.length+' records'),DetailValue=()=>null;
 const render=(view:string,p:any)=>renderToStaticMarkup(createElement(Sections,{view,report:{...p,id:'source',events:[]},presentation:projectPresentation(p),Panel,Metric,DataTable,DetailValue,onTab:()=>{}}));
 for(const view of additionalProjectSections){assert.ok(render(view,copy()).includes('<section'));assert.ok(render(view,{data:{project:{title:'فارغ'}},snapshot:{s:{}},source:{}}).includes('<section'));}
});
