import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSnapshot, achievement } from '../src/lib/unitWorkspace';
test('missing, nonnumeric and nonfinite values cannot become reported metrics',()=>{
 const s=parseSnapshot({summary:'تقرير',metrics:[{label:'مفقود'},{label:'نص',value:'90'},{label:'غير محدود',value:Infinity},{label:'مبيعات',value:0,series:[]}]},'التقرير');
 assert.equal(s.metrics.length,1);assert.equal(s.metrics[0].value,0);assert.equal(achievement(s.metrics[0]),undefined);
});
test('targets respect metric direction and never divide by zero',()=>{
 const s=parseSnapshot({summary:'',metrics:[{label:'الإنتاج',value:80,target:100},{label:'الهدر',value:10,target:5,direction:'down'},{label:'هدر صفري',value:0,target:5,direction:'down'},{label:'هدف صفري',value:1,target:0}]},'التقرير');
 assert.deepEqual(s.metrics.map(achievement),[80,50,100,undefined]);
});
test('series and source are constrained without inventing periods',()=>{
 const s=parseSnapshot({summary:'',metrics:[{label:'الإنتاج',value:10,series:[{label:'يناير',value:4},{label:'فبراير',value:'6'},{label:'مارس',value:10}]}]},'تقرير المصنع.pdf');
 assert.equal(s.metrics[0].source,'تقرير المصنع.pdf');assert.equal(s.metrics[0].period,'');assert.equal(s.metrics[0].series.length,2);
});
