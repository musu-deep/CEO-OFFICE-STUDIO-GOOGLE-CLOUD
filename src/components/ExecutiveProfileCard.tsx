import {BriefcaseBusiness,FileText,ArrowUpLeft,MapPin,Mail,Clock3,ClipboardCheck,ListChecks,Lightbulb} from 'lucide-react';
import type {UnitRecord} from '../lib/executiveModel';
const cvUrl='/executive-cv-ali-alotaibi.html';
export default function ExecutiveProfileCard({units,onTasks}:{units:Record<string,UnitRecord>;onTasks:()=>void}){
 const records=Object.values(units),tasks=records.flatMap(r=>r.directives),open=tasks.filter(d=>d.status!=='closed');
 const dateParts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const part=(type:string)=>dateParts.find(p=>p.type===type)?.value||'';
 const today=`${part('year')}-${part('month')}-${part('day')}`;
 const overdue=open.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.due)&&d.due<today).length;
 const metrics=[
  {label:'تكليفات مفتوحة',value:open.length,icon:ListChecks,warning:false},
  {label:'تكليفات متأخرة',value:overdue,icon:Clock3,warning:overdue>0},
  {label:'ملفات مؤشرات للمراجعة',value:records.filter(r=>r.pending&&r.pending.state!=='returned').length,icon:ClipboardCheck,warning:false},
  {label:'مقترحات قرار موثقة',value:records.reduce((sum,r)=>sum+(r.approved?.snapshot.decisions.length||0),0),icon:Lightbulb,warning:false}
 ];
 return <section aria-labelledby="executive-profile-title" className="relative isolate overflow-hidden rounded-[1.75rem] border border-[var(--theme-border)] bg-[var(--theme-card)] p-5 shadow-lg sm:p-7">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--theme-accent-soft),transparent_65%)]"/>
  <div className="grid items-center gap-7 xl:grid-cols-[1.15fr_1fr]">
   <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-right">
    <a href={cvUrl} target="_blank" rel="noopener noreferrer" aria-label="عرض السيرة الذاتية للدكتور علي العتيبي" className="group relative block shrink-0 rounded-full border border-[var(--theme-border)] bg-white p-1.5 shadow-lg transition-transform hover:scale-[1.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--theme-accent)]"><img src="/images/ceo-ali-alotaibi.png" alt="د. علي عبدالله سليمان العتيبي" width={144} height={144} className="h-32 w-32 rounded-full object-cover sm:h-36 sm:w-36"/><span aria-hidden="true" className="absolute bottom-1 left-1 rounded-full border border-[var(--theme-border)] bg-emerald-700 p-2 text-white"><ArrowUpLeft size={15}/></span></a>
    <div className="min-w-0 flex-1"><p className="inline-flex items-center gap-2 text-xs font-bold text-[var(--theme-accent)]"><BriefcaseBusiness size={15}/>الرئيس التنفيذي · مجموعة أراك للتنمية</p><h2 id="executive-profile-title" className="mt-3 text-xl font-black leading-relaxed sm:text-2xl">المستشار د. علي عبدالله سليمان العتيبي</h2><p className="mt-2 text-sm leading-7 opacity-70">القيادة التنفيذية والتخطيط الاستراتيجي وتطوير الأعمال</p><div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs opacity-70 sm:justify-start"><span className="inline-flex items-center gap-1.5"><MapPin size={13}/>جدة، المملكة العربية السعودية</span><a href="mailto:dr.ali@araak.org" className="inline-flex items-center gap-1.5 hover:text-[var(--theme-accent)]"><Mail size={13}/><span dir="ltr">dr.ali@araak.org</span></a></div><div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start"><a href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-accent-soft)] px-4 py-2.5 text-sm font-bold text-[var(--theme-accent)]"><FileText size={16}/>السيرة الذاتية<ArrowUpLeft size={14}/></a><button onClick={onTasks} className="rounded-xl border border-slate-500/25 px-4 py-2.5 text-sm">متابعة التكليفات</button></div></div>
   </div>
   <div className="min-w-0"><p className="mb-3 text-xs font-bold text-[var(--theme-accent)]">موجز المتابعة التنفيذية</p><dl className="grid grid-cols-2 gap-3">{metrics.map(({label,value,icon:Icon,warning})=><div key={label} className="rounded-2xl border border-slate-500/15 bg-white/[0.035] p-4"><dt className="flex items-start justify-between gap-2 text-xs leading-6 opacity-70"><span>{label}</span><Icon size={16} className={warning?'mt-1 shrink-0 text-amber-500':'mt-1 shrink-0 text-[var(--theme-accent)]'}/></dt><dd className={`mt-2 text-3xl font-black tabular-nums ${warning?'text-amber-500':''}`}>{value.toLocaleString('ar-SA')}</dd></div>)}</dl><p className="mt-3 text-[11px] leading-6 opacity-70">من سجلات الجهات المتاحة في المنصة. التأخير بحسب موعد التكليف وتوقيت الرياض؛ مقترحات القرار من السجلات المعتمدة.</p></div>
  </div>
 </section>;
}
