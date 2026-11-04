import seed from './data/farasan-report.json';
import layout from './data/farasan-site-plan.json';
export type InputSchema={kind:'object'|'array'|'number'|'boolean'|'string';fields?:Record<string,InputSchema>;item?:InputSchema;fixed?:number;additional?:InputSchema};
function schema(values:any[],path=''):InputSchema{
 const present=values.filter(v=>v!==undefined&&v!==null);const objects=present.filter(v=>v&&typeof v==='object'&&!Array.isArray(v));
 if(objects.length){const keys=[...new Set(objects.flatMap(v=>Object.keys(v)))];return {kind:'object',fields:Object.fromEntries(keys.map(k=>[k,schema(objects.map(v=>v[k]),path+'.'+k)]))};}
 const arrays=present.filter(Array.isArray);if(arrays.length){const children=arrays.flat();const item=schema(children,path+'[]');return {kind:'array',item,...(item.kind==='number'&&path.includes('.lines.')?{fixed:3}:{})};}
 if(present.some(v=>typeof v==='number'))return {kind:'number'};if(present.some(v=>typeof v==='boolean'))return {kind:'boolean'};return {kind:'string'};
}
const base={data:{...seed.data,project:{...seed.data.project,currency:'',periodFrom:'',periodTo:''},boq:seed.data.boq.map(x=>({...x,unit:'',comparisonKey:'',contractValue:null,certifiedValue:null})),sitePlan:layout.sitePlan,targetGroups:layout.targetGroups},snapshot:{s:{...seed.snapshot.s,rates:{r:{}}}}};
export const projectInputSchema=schema([base]);
export const blankProject=(title:string)=>({data:{project:{title,currency:'SAR',periodFrom:'',periodTo:''},types:[],activities:[],boq:[],unitProgress:[],ipcs:[],qtyTables:[],catalog:[],quotes:[],targetGroups:[]},snapshot:{at:new Date().toISOString(),by:'',s:{tasks:[],wos:[],pos:[],grns:[],mirs:[],contr:{list:[]},sup:{rows:{},tbl:{},manual:[]},rates:{r:{}}}},source:{name:'تقرير مشروع مدخل عبر المنصة',at:new Date().toISOString(),by:''}});
const extra=schema([{grns:[{no:'',k:'',name:'',qty:0,dn:'',att:'',date:''}],mirs:[{no:'',k:'',name:'',unit:'',qty:0,st:'',date:''}],nipc:[{no:0,from:'',to:'',date:'',status:'',lines:[{b:'',code:'',pct:0}]}],manual:[{id:'',name:'',K:'',need:'',eta:'',mat:0,total:0,lead:0,st:'',sup:'',po:'',note:'',price:0,tbls:[0]}]}]);
const state=projectInputSchema.fields!.snapshot.fields!.s.fields!;for(const k of ['grns','mirs','nipc'])state[k]=extra.fields![k];state.sup.fields!.manual=extra.fields!.manual;
function merge(nodes:any[]):InputSchema{const first=nodes[0];if(nodes.every(n=>n.kind==='object')){const keys=[...new Set(nodes.flatMap(n=>Object.keys(n.fields||{})))];return {kind:'object',fields:Object.fromEntries(keys.map(k=>[k,merge(nodes.map(n=>n.fields?.[k]).filter(Boolean))]))};}if(nodes.every(n=>n.kind==='array'))return {kind:'array',item:merge(nodes.map(n=>n.item))};if(nodes.some(n=>n.kind==='number'))return {kind:'number'};return first;}
function dictionaries(node:any,key=''){if(node.kind==='object'){for(const [k,v] of Object.entries(node.fields||{}))dictionaries(v,k);if(['rate','exec','q','prog','p','units','rows','tbl','links','r'].includes(key)&&Object.keys(node.fields||{}).length){const values=Object.values(node.fields);node.additional=merge(values);node.fields={};}}if(node.item)dictionaries(node.item,key+'[]');}
// Dynamic dictionaries represent project types, suppliers and linkage keys rather than fixed reference IDs.
dictionaries(projectInputSchema);

state.rates.fields!.r.additional={kind:'number'};
const boq=projectInputSchema.fields!.data.fields!.boq.item!.fields!;boq.contractValue={kind:'number'};boq.certifiedValue={kind:'number'};

state.prices.fields!.p.additional={kind:'number'};state.catp.fields!.p.additional={kind:'number'};
state.cqt.fields!.tables={kind:'array',item:{...projectInputSchema.fields!.data.fields!.qtyTables.item!,fields:{...projectInputSchema.fields!.data.fields!.qtyTables.item!.fields,id:{kind:'string'}}}};

const operational=schema([{mats:[{name:'',unit:'',qty:0,price:0}],equip:[{name:'',hours:0,rate:0}],check:[{t:'',d:false}],notes:[{by:'',at:'',t:''}]}]).fields!;
state.wos.item!.fields!.mats=operational.mats;state.wos.item!.fields!.equip=operational.equip;
state.tasks.item!.fields!.check=operational.check;state.tasks.item!.fields!.notes=operational.notes;
