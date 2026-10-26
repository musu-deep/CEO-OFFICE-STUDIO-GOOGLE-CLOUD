import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildExecutiveFeed, DEMO_INTERVAL, orgUnits } from '../src/lib/executiveFeed';
test('every named organization has an explicitly simulated snapshot with finite metrics',()=>{
 const f=buildExecutiveFeed(1793000000000);
 assert.equal(f.units.length,orgUnits().length);
 assert.equal(new Set(f.units.map(u=>u.id)).size,f.units.length);
 for(const u of f.units){assert.match(u.snapshot.source,/تجريبية/);assert.ok(u.snapshot.metrics.length);for(const m of u.snapshot.metrics)assert.ok(Number.isFinite(m.value));}
 assert.ok(f.events.every(e=>f.units.some(u=>u.id===e.unitId)));
});
test('polls in one interval preserve events and subsequent interval adds one stable event',()=>{
 const t=DEMO_INTERVAL*15000000;
 const a=buildExecutiveFeed(t),b=buildExecutiveFeed(t+1000),c=buildExecutiveFeed(t+DEMO_INTERVAL);
 assert.deepEqual(a.events,b.events);
 assert.equal(c.events[1].id,a.events[0].id);
 assert.notEqual(c.events[0].id,a.events[0].id);
 assert.ok(a.events.every(e=>Date.parse(e.at)<=t));
 assert.equal(new Set(a.events.map(e=>e.unitId)).size,a.units.length);
});
