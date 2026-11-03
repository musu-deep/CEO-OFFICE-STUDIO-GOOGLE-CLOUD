import type {ExecutiveState} from '../lib/executiveModel';
import type {DashboardActivity,DashboardRecord} from '../lib/dashboardActivity';
import {profileFor,type DomainRecord} from '../lib/workspaceProfiles';
export function dashboardActivity(state:ExecutiveState):DashboardActivity{
 const saved=Object.values(state.businessRecords||{}).flat(),pending=state.platformSettings?.pendingRecords||[],reports=state.reports||[];
 const project=(r:DomainRecord,status:DashboardRecord['status']):DashboardRecord=>{
  const profile=profileFor(r.unitId);
  return {id:r.id,unitId:r.unitId,title:r.title,recordLabel:profile.recordLabel,updatedAt:r.updatedAt||r.createdAt,status,preview:profile.fields.filter(f=>r.values[f.id]!==undefined&&r.values[f.id]!=='').slice(0,3).map(f=>{const v=r.values[f.id];return {label:f.label,value:typeof v==='number'?v.toLocaleString('ar-SA'):String(f.options?.find(([id])=>id===v)?.[1]||v).slice(0,200)};})};
 };
 // Show a pending revision once, retaining the recorded copy in storage until approval.
 const records=new Map(saved.map(r=>[JSON.stringify([r.unitId,r.id]),project(r,'recorded')]));
 for(const p of pending)records.set(JSON.stringify([p.record.unitId,p.record.id]),project(p.record,p.status==='returned'?'returned':'pending'));
 return {recordCount:saved.length,pendingRecordCount:pending.filter(p=>p.status!=='returned').length,reportCount:reports.length,reportsAwaitingReview:reports.filter(r=>r.status==='submitted').length,
  records:[...records.values()].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||a.id.localeCompare(b.id)).slice(0,10),
  reports:[...reports].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id)).slice(0,10).map(r=>({id:r.id,unitId:r.unitId,title:r.title,period:r.period,createdAt:r.createdAt,status:r.status,attachmentCount:r.attachments.length,summary:r.summary.slice(0,240)}))};
}
