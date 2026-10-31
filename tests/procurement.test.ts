import test from 'node:test';
import assert from 'node:assert/strict';
import { cashCycle, dayNumber, percent, emptyProcurement, phases } from '../src/data/procurement';
import { validState } from '../src/components/ProcurementWorkspace';
import { findOrgPath } from '../src/data/organization';

test('cash cycle preserves both examples in the source and rejects missing inputs',()=>{
  assert.equal(cashCycle('15','20','45'),-10);
  assert.equal(cashCycle('40','20','45'),15);
  for(const values of [['','20','45'],['-1','20','45'],['x','20','45']])assert.equal(cashCycle(...values as [string,string,string]),null);
});
test('percentages distinguish missing samples, zeros and impossible counts',()=>{
  assert.equal(percent('0','10'),0);assert.equal(percent('9','10'),90);
  for(const pair of [['','10'],['0','0'],['11','10'],['-1','10']])assert.equal(percent(...pair as [string,string]),null);
});
test('program dates are inclusive and phase windows cover exactly one hundred days',()=>{
  assert.equal(dayNumber('2026-10-20','2026-10-20'),1);
  assert.equal(dayNumber('2026-10-20','2026-10-19'),0);
  assert.equal(dayNumber('2026-10-20','2027-01-27'),100);
  assert.equal(dayNumber(''),null);assert.equal(dayNumber('2026-02-30'),null);assert.equal(dayNumber('2026-99-99'),null);
  assert.deepEqual(phases.flatMap(p=>Array.from({length:p.to-p.from+1},(_,i)=>p.from+i)),Array.from({length:100},(_,i)=>i+1));
});
test('backups round-trip without manufactured results and reject corrupt schemas',()=>{
  const state=emptyProcurement();assert.ok(validState(JSON.parse(JSON.stringify(state))));
  assert.equal(Object.keys(state.metrics).length,0);assert.equal(Object.keys(state.tasks).length,0);
  assert.equal(validState({...state,version:2}),false);
  assert.equal(validState({...state,rows:{...state.rows,suppliers:[{id:'1',name:42}]}}),false);
  assert.equal(validState({...state,rows:{...state.rows,suppliers:[{id:'1'},{id:'1'}]}}),false);
  assert.equal(validState({...state,checks:{a:'yes'}}),false);
});
test('procurement and warehouses are group-wide while project operations remain in their company',()=>{
  assert.deepEqual(findOrgPath('procurement').map(n=>n.id),['support','procurement']);
  assert.deepEqual(findOrgPath('contracts-procurement'),[]);
  assert.deepEqual(findOrgPath('warehouse').map(n=>n.id),['support','warehouse']);
  assert.deepEqual(findOrgPath('technical-office').map(n=>n.id),['investment','national','national-projects','technical-office']);
});
