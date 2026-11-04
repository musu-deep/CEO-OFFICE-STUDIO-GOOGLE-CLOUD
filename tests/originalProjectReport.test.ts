import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import seed from '../src/server/data/farasan-report.json';
import template from '../src/server/data/original-project-renderer.json';
import {originalReportHTML,originalSections,originalReportAvailable,originalReportCSP} from '../src/server/originalProjectReport';
function runtime(html:string){
 const nodes=new Map<string,any>();const node=(id:string)=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},hidden:false,src:'',getBoundingClientRect:()=>({height:1000}),querySelectorAll:()=>[],addEventListener(){},focus(){},select(){}});return nodes.get(id);};
 const context={document:{querySelector:(s:string)=>s.startsWith('.bkwrap')?null:node(s),querySelectorAll:()=>[],getElementById:(s:string)=>node('#'+s),documentElement:{setAttribute(){}},addEventListener(){},activeElement:null},location:{hash:''},history:{replaceState(){}},navigator:{},parent:{postMessage(){}},ResizeObserver:class{observe(){}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},addEventListener(){},console};(context as any).window=context;
 const sandbox=vm.createContext(context,{codeGeneration:{strings:false,wasm:false}});const script=html.match(/<script>([\s\S]*)<\/script>/)![1];vm.runInContext(script,sandbox,{timeout:4000});return {sandbox,nodes};
}
test('original presentation excludes source login/storage/collaboration and accepts only the matching project',()=>{
 assert.equal(originalReportAvailable(seed),true);assert.equal(originalReportAvailable({...seed,source:{...seed.source,sha256:'different'}}),false);
 assert.throws(()=>originalReportHTML(seed,'users','light'));for(const token of ['pwHash','localStorage','window.claude','auth/users'])assert.equal(template.script.includes(token),false);
 assert.ok(originalReportCSP.includes('sandbox allow-scripts'));assert.ok(!originalReportCSP.includes('allow-same-origin'));assert.ok(originalReportCSP.includes("connect-src 'none'"));assert.ok(originalReportCSP.includes("frame-ancestors 'self'"));
 const html=originalReportHTML(seed,'boq','light');assert.ok(html.includes('data-theme="light"'));assert.ok(html.includes('--ink:#0b1014'));assert.ok(!html.includes('__PROJECT_DATA__'));
 const payload=structuredClone(seed);payload.data.project.title='</script><script>throw Error("injection")</script>';assert.doesNotThrow(()=>runtime(originalReportHTML(payload,'boq','light')));
});
test('every original source section renders its detailed source markup without runtime errors',()=>{
 for(const section of Object.keys(originalSections)){
  const {nodes,sandbox}=runtime(originalReportHTML(seed,section,'light'));assert.ok(nodes.get('#view')?.innerHTML.length>100,section);
  vm.runInContext("if(can('wo')||modLv('boq')!==1||!RO)throw Error('Unexpected write access')",sandbox);
 }
});
