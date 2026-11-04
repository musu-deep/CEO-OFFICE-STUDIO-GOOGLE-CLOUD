import type {ProjectPayload} from './projectReports';
export type SitePresentation={originalReportAvailable?:boolean;sitePlan?:any;targetGroups?:any[];origin?:string};
const finite=(v:any):number|null=>(typeof v==='number'||typeof v==='string'&&v.trim()!=='')&&Number.isFinite(Number(v))?Number(v):null;
const sum=(a:number[])=>a.reduce((s,x)=>s+x,0);
export function workOrderCost(w:any){
 let missing=0;
 const line=(r:any,keys:string[])=>{const v=keys.map(k=>finite(r[k]));if(v.some(x=>x===null||x<0)){missing++;return 0;}return v.reduce((a,b)=>a*b,1);};
 const labor=w.mode==='sub'?0:sum((w.labor||[]).map((r:any)=>line(r,['n','days','rate']))),materials=sum((w.mats||[]).map((r:any)=>line(r,['qty','price']))),equipment=sum((w.equip||[]).map((r:any)=>line(r,['hours','rate'])));
 let subcontract=0;if(w.mode==='sub'){const v=finite(w.value);if(v===null||v<0)missing++;else subcontract=v;}
 return {labor,materials,equipment,subcontract,total:labor+materials+equipment+subcontract,missing};
}
export function projectOperations(report:ProjectPayload,presentation:SitePresentation={}){
 const d=report.data,s=report.snapshot.s,types=d.types||[],activities=d.activities||[],units=d.unitProgress||[],boq=d.boq||[],ipcs=d.ipcs||[],ipc=[...ipcs].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||Number(a.no)-Number(b.no)).at(-1);
 const groups=(d.targetGroups||presentation.targetGroups||[]).map((g:any)=>({...g,buildingIds:[...(g.buildingIds||[])]}));
 const byId=new Map<string,any>();for(const u of units){const id=`${u.t}-${u.b}`;if(!byId.has(id))byId.set(id,{id,type:u.t,sequence:u.b,plot:u.plot,units:[],targetId:groups.find((g:any)=>g.buildingIds.includes(id))?.id||'unassigned'});byId.get(id).units.push(u);}
 const buildings=[...byId.values()].sort((a,b)=>String(a.type).localeCompare(String(b.type))||a.sequence-b.sequence);
 if(buildings.some(b=>b.targetId==='unassigned'))groups.push({id:'unassigned',name:'غير مصنف ضمن مستهدف',buildingIds:buildings.filter(b=>b.targetId==='unassigned').map(b=>b.id)});
 const typeOf=(k:string)=>types.find((t:any)=>t.k===k);
 const value=(b:any,it:any)=>{const rate=finite(it.rate?.[b.type]),area=finite(typeOf(b.type)?.bua);return rate===null||area===null?null:rate*area;};
 for(const b of buildings){
  b.typeName=typeOf(b.type)?.ar||b.type;b.targetName=groups.find((g:any)=>g.id===b.targetId)?.name||'غير مصنف';
  const ps=b.units.map((u:any)=>Array.isArray(u.p)&&activities.length&&u.p.length===activities.length&&u.p.every((p:any)=>typeof p==='number')?sum(u.p.map((x:number,j:number)=>x*(activities[j]?.w||0))):null);
  b.progress=ps.length&&ps.every((x:any)=>x!==null)?sum(ps)/ps.length:null;
  const vals=boq.map((it:any)=>value(b,it));b.contractValue=boq.length&&vals.every((v:any)=>v!==null)?sum(vals):null;
  const ic=ipc?.units?.[b.type]||[];const matches=b.units.map((u:any)=>{const a=ic.filter((r:any)=>String(r.u)===String(u.u));return a.length===1&&typeof a[0].cum==='number'?a[0].cum:null;});
  b.certified=matches.length&&matches.every((x:any)=>x!==null)?sum(matches):null;
 }
 // Same biproportional distribution as the reference; these are model allocations,
 // not independently measured/certified quantities per BOQ item and building.
 const allocated:Record<string,Record<string,number>>={};
 for(const t of types){const bs=buildings.filter(b=>b.type===t.k),items=boq.filter((it:any)=>(finite(it.rate?.[t.k])??0)>0&&typeof it.exec?.[t.k]==='number');if(!bs.length||!items.length||bs.some(b=>b.certified===null))continue;
  const gp=(b:any,it:any)=>{if(!Array.isArray(it.subs)||!it.subs.length)return 1e-6;const mean=(j:number)=>sum(b.units.map((u:any)=>finite(u.p?.[j])||0))/b.units.length;let total=0,weight=0;for(const sb of it.subs){const sh=finite(sb.share)||0,k=finite(sb.k)||0,a=finite(sb.act)||0;total+=sh*((1-k)*(a>=1&&a<=20?mean(a-1):0)+k*(mean(17)+mean(18)+mean(19))/3);weight+=sh;}return weight?total/weight:0;};
  const matrix=bs.map(b=>Object.fromEntries(items.map((it:any)=>[it.code,Math.max(1e-6,gp(b,it))*(value(b,it)||0)])));
  for(let n=0;n<200;n++){matrix.forEach((r,i)=>{const total=sum(Object.values(r) as number[]),f=total?bs[i].certified/total:0;for(const k in r)r[k]*=f;});for(const it of items){const total=sum(matrix.map(r=>r[it.code])),f=total?it.exec[t.k]/total:0;matrix.forEach(r=>r[it.code]*=f);}matrix.forEach((r,i)=>{for(const it of items)r[it.code]=Math.min(r[it.code],value(bs[i],it)||0);});}
  bs.forEach((b,i)=>allocated[b.id]=matrix[i]);
 }
 const remaining:Record<string,number>={};for(const b of buildings)for(const it of boq){const v=value(b,it),cert=allocated[b.id]?.[it.code];if(v!==null&&cert!==undefined)remaining[`${b.id}/${it.code}`]=Math.max(0,v-cert);}
 for(const c of s.nipc||[])if(['draft','submitted'].includes(c.status))for(const l of c.lines||[]){const b=byId.get(l.b),it=boq.find((x:any)=>x.code===l.code);if(b&&it){const key=`${b.id}/${it.code}`;if(remaining[key]!==undefined)remaining[key]=Math.max(0,remaining[key]-(value(b,it)||0)*Math.max(0,finite(l.pct)||0)/100);}}
 const work=(s.wos||[]).map((w:any)=>{const keys=[...new Set<string>(w.bldgs||[])],known=keys.filter(id=>byId.has(id)),valid=keys.length>0&&known.length===keys.length,totalUnits=sum(known.map(id=>byId.get(id).units.length)),cost=workOrderCost(w);
  return {...w,buildingIds:keys,targetIds:[...new Set(known.map(id=>byId.get(id).targetId))],cost,allocationValid:valid,shares:valid?Object.fromEntries(known.map(id=>[id,byId.get(id).units.length/totalUnits])):{},billByBuilding:{} as Record<string,number>,billable:null as number|null};});
 for(const w of [...work].sort((a,b)=>String(a.closed||a.end||a.date||'').localeCompare(String(b.closed||b.end||b.date||''))||String(a.no).localeCompare(String(b.no)))){
  if(w.status!=='closed'||w.billed){w.billable=0;continue;}const it=boq.find((x:any)=>x.code===w.boq),p=finite(w.billPct);if(!it||!w.allocationValid||p===null||p<=0||p>100)continue;
  if(w.buildingIds.some((id:string)=>remaining[`${id}/${it.code}`]===undefined))continue;
  for(const id of w.buildingIds){const k=`${id}/${it.code}`,v=Math.min(remaining[k],(value(byId.get(id),it)||0)*p/100);w.billByBuilding[id]=v;remaining[k]-=v;}w.billable=sum(Object.values(w.billByBuilding));
 }
 for(const b of buildings){b.workOrders=work.filter(w=>w.buildingIds.includes(b.id));b.cost=sum(b.workOrders.filter(w=>['approved','closed'].includes(w.status)&&w.allocationValid).map(w=>w.cost.total*w.shares[b.id]));b.costIncomplete=b.workOrders.some(w=>w.cost.missing||!w.allocationValid);b.ready=sum(b.workOrders.map(w=>w.billByBuilding[b.id]||0));}
 const tasks=[...(s.tasks||[]).map((t:any)=>({...t,key:`task:${t.id}`,source:'task',buildingIds:t.bldgs||[],assignee:t.asgName||t.asg||'',title:t.title||'مهمة دون عنوان'})),...work.map(w=>({key:`wo:${w.no}`,id:w.no,title:w.title||'أمر عمل',source:'wo',status:w.status==='closed'?'done':w.status==='approved'?'doing':['sup','pm'].includes(w.status)?'wait':['cancelled','rejected'].includes(w.status)?w.status:'new',assignee:w.contractor||(w.mode==='own'?'عمالة الشركة':'غير محدد'),start:w.start,due:w.end,buildingIds:w.buildingIds,workOrder:w}))].map(t=>({...t,targetIds:[...new Set(t.buildingIds.filter((id:string)=>byId.has(id)).map((id:string)=>byId.get(id).targetId))]}));
 const groupStats=groups.map((g:any)=>{const bs=buildings.filter(b=>g.buildingIds.includes(b.id)),u=bs.flatMap(b=>b.units),weighted=bs.every(b=>b.progress!==null)&&u.length?sum(bs.map(b=>b.progress*b.units.length))/u.length:null,contracts=bs.map(b=>b.contractValue),certs=bs.map(b=>b.certified),schedule=g.scheduleKey?d[g.scheduleKey]:null;
  return {...g,buildings:bs,units:u.length,progress:weighted,contractValue:bs.length&&contracts.every(v=>v!==null)?sum(contracts):null,certified:bs.length&&certs.every(v=>v!==null)?sum(certs):null,cost:sum(bs.map(b=>b.cost)),ready:sum(bs.map(b=>b.ready)),schedule};});
 const wip=(ids:string[])=>boq.map((it:any)=>{const bs=buildings.filter(b=>ids.includes(b.id)),values=bs.map(b=>value(b,it)),certs=bs.map(b=>allocated[b.id]?.[it.code]),contract=bs.length&&values.every(v=>v!==null)?sum(values):null,cert=certs.length&&certs.every(v=>v!==undefined)?sum(certs):null,ws=work.filter(w=>w.boq===it.code&&w.buildingIds.some((id:string)=>ids.includes(id))),cost=sum(ws.filter(w=>['approved','closed'].includes(w.status)).map(w=>w.cost.total*sum(ids.map(id=>w.shares[id]||0)))),ready=sum(ws.map(w=>sum(ids.map(id=>w.billByBuilding[id]||0))));return {code:it.code,title:it.ar||it.en,contract,allocatedCertified:cert,progress:contract&&cert!==null?cert/contract:null,open:ws.filter(w=>!['closed','cancelled','rejected'].includes(w.status)).length,cost,ready,workOrders:ws};}).filter(x=>(x.contract??0)>0&&(x.progress!==null&&x.progress>0&&x.progress<1||x.open>0));
 return {buildings,groups:groupStats,work,tasks,ipc,allocated,wip};
}
