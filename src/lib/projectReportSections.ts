import type {ProjectPayload} from './projectReports';
import {projectOperations,type SitePresentation} from './projectOperations';
export const projectReportTabs=[['operations','لوحة المشروع والمخطط'],['overview','ملخص العقد'],['progress','الإنجاز والوحدات'],['tasks','إدارة المهام'],['boq','المقايسة'],['quantities','جداول الكميات'],['finance','مستخلصات المشروع'],['schedule','الجدول الزمني'],['supply','جدول التوريدات'],['procurement','المشتريات'],['inventory','المستودعات'],['labor','العمالة ومقاولو الباطن'],['work','الموقع وأوامر العمل'],['audit','سجل التدقيق'],['governance','الحوكمة والاعتماد']] as const;
export const additionalProjectSections=['tasks','supply','inventory','labor','work','audit'];
export const recordedNumber=(v:any):number|null=>(typeof v==='number'||typeof v==='string'&&v.trim()!=='')&&Number.isFinite(Number(v))?Number(v):null;
const total=(a:(number|null)[])=>a.every(v=>v!==null)?a.reduce<number>((s,v)=>s+v,0):null;
const day=(v:any)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v?v:null;
export function supplyRows(report:ProjectPayload,presentation:SitePresentation={}){
 const d=report.data,s=report.snapshot.s,sup=s.sup||{},groups=d.targetGroups||presentation.targetGroups||[],out:any[]=[],seen=new Set<string>();
 const scheduleGroups=groups.filter((g:any)=>g.scheduleKey&&d[g.scheduleKey]?.rows);
 if(!scheduleGroups.length&&d.schedule3?.rows)scheduleGroups.push({id:'T3',name:'المستهدف الثالث',scheduleKey:'schedule3'});
 for(const g of scheduleGroups){const schedule=d[g.scheduleKey];for(const [i,r] of (schedule.rows||[]).entries()){
  const key=`${g.scheduleKey==='schedule3'?'m3':g.scheduleKey}:${r.id||'r'+i}`,o=sup.rows?.[key]||{};seen.add(key);
  out.push({key,targetId:g.id,targetName:g.name,name:o.name||r.ar||r.a,total:r.total,delivered:r.mat,deliveryDate:r.matDate,...o,sourceRow:r,source:'الجدول الزمني'});
 }}
 for(const [key,o] of Object.entries<any>(sup.rows||{}))if(!seen.has(key)){const id=key.startsWith('m4:')?'T4':key.startsWith('m3:')?'T3':'';out.push({key,targetId:id,targetName:groups.find((g:any)=>g.id===id)?.name||id||'غير محدد',name:o.name||o.note||`ارتباط توريد ${key}`,...o,source:'تحديث توريد؛ لا يوجد صف حالة مقابل في النسخة'});}
 for(const r of sup.manual||[]){const id=r.targetId||(r.K==='m4'?'T4':r.K==='m3'?'T3':'');out.push({...r,key:`manual:${r.id}`,targetId:id,targetName:groups.find((g:any)=>g.id===id)?.name||id||'غير محدد',delivered:r.mat,deliveryDate:r.eta,source:'إدخال توريد يدوي'});}
 return out.map(r=>{const schedule=groups.find((g:any)=>g.id===r.targetId)?.scheduleKey,sch=schedule?d[schedule]:null,need=day(r.need)||day(r.sourceRow?.start)||day(r.sourceRow?.finish)||day(sch?.due),lead=recordedNumber(r.lead??sup.lead),orderBy=need&&lead!==null&&lead>=0?new Date(Date.parse(need+'T00:00:00Z')-lead*86400000).toISOString().slice(0,10):null;
  const arrived=r.deliveryDate==='Delivered'||(recordedNumber(r.total)??0)>0&&(recordedNumber(r.delivered)??-1)>=(recordedNumber(r.total)??Infinity);
  return {...r,need,lead,orderBy,needSource:day(r.need)?'موعد مسجل':need?'مستنتج من تاريخ النشاط أو استحقاق المستهدف':'غير مسجل',status:r.st|| (arrived?'delivered':(recordedNumber(r.delivered)??0)>0?'partial':'unspecified'),supplier:r.sup,orderNo:r.po,visible:r.hidden!==true};});
}
export function inventoryRows(report:ProjectPayload,presentation:SitePresentation={}){
 const ops=projectOperations(report,presentation),s=report.snapshot.s;
 return (report.data.qtyTables||[]).flatMap((t:any,i:number)=>(t.rows||[]).map((r:any,j:number)=>{
  const key=`${i}#${j}`,receipts=(s.grns||[]).filter((x:any)=>x.k===key&&!['draft','cancelled','rejected'].includes(x.st||x.status)),issues=(s.mirs||[]).filter((x:any)=>x.k===key&&x.st==='issued'),requests=(s.mirs||[]).filter((x:any)=>x.k===key&&x.st==='requested');
  const opening=recordedNumber(r['المتوفر']),received=total(receipts.map((x:any)=>recordedNumber(x.qty))),issued=total(issues.map((x:any)=>recordedNumber(x.qty))),requested=total(requests.map((x:any)=>recordedNumber(x.qty)));
  const direct=recordedNumber(r['اجمالي الاعداد']),qs=ops.buildings.map(b=>recordedNumber(r.q?.[b.type])),allocated=direct!==null?direct:ops.buildings.length&&qs.every(v=>v!==null)?total(qs):null;
  return {key,sheet:t.sheet,item:r.item,unit:r.unit,allocated,allocationSource:direct!==null?'حقل إجمالي الأعداد بالمصدر':allocated!==null?'كمية نموذج المبنى × عدد مبانيه':'غير متاحة',opening,received,issued,requested,balance:opening!==null&&received!==null&&issued!==null?opening+received-issued:null,receipts,issues,requests,sourceRow:r};
 }));
}
export function laborRows(report:ProjectPayload,presentation:SitePresentation={}){
 const ops=projectOperations(report,presentation),s=report.snapshot.s;
 const contractors=(s.contr?.list||[]).map((c:any)=>{const orders=ops.work.filter(w=>w.mode==='sub'&&(w.contractorId?w.contractorId===c.id:String(w.contractor||'').trim()===String(c.name||'').trim()));const approved=orders.filter(w=>['approved','closed'].includes(w.status));return {...c,contractValue:recordedNumber(c.value),orderCount:orders.length,recordedOrderCost:approved.length?approved.reduce((n,w)=>n+w.cost.total,0):0,orders};});
 const labor=ops.work.flatMap(w=>(w.labor||[]).map((r:any,i:number)=>({...r,key:`${w.no}:${i}`,workOrder:w.no,workTitle:w.title,status:w.status,buildings:w.buildingIds,headcount:recordedNumber(r.n),days:recordedNumber(r.days),rate:recordedNumber(r.rate),amount:[r.n,r.days,r.rate].every(v=>recordedNumber(v)!==null)?Number(r.n)*Number(r.days)*Number(r.rate):null})));
 const rates=Object.entries(s.rates?.r||{}).map(([trade,rate])=>({trade,rate:recordedNumber(rate)}));
 return {contractors,labor,rates,work:ops.work};
}
