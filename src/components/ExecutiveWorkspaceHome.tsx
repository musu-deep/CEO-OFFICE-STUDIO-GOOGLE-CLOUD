import { ArrowUpRight, FileText, CheckCircle2, Activity, Search } from 'lucide-react';
import type { AppUser } from '../types';
export type WorkspaceMode = 'information'|'decision'|'followup';
export const workspaceModes = [
 {id:'information' as const,name:'المعلومة',description:'الخطط والتقارير والجهات',icon:FileText},
 {id:'decision' as const,name:'القرار',description:'التوجيهات ومساندة القرار',icon:CheckCircle2},
 {id:'followup' as const,name:'المتابعة',description:'التكليفات والمشاريع والمواعيد',icon:Activity},
];
const actions:Record<WorkspaceMode,{title:string;detail:string;target:string}[]>={
 information:[{title:'خطة المشتريات والعقود',detail:'الخطة المرجعية ومراحل المائة يوم ومستهدفاتها',target:'procurement-plan'},{title:'الخطط والوثائق',detail:'البحث في ملفات المكتب ومراجع العمل',target:'documents'},{title:'تقارير المجموعة',detail:'عرض التقارير مع توضيح حالة بياناتها',target:'reports'}],
 decision:[{title:'القرارات والتوجيهات',detail:'استعراض التوجيهات وإسناد ما يحتاج متابعة',target:'messages'},{title:'مساندة القرار',detail:'طرح سؤال على المستشار وإرفاق سياقه',target:'ai-advisor'},{title:'الحوكمة والالتزامات',detail:'مراجعة السياسات والضوابط ذات الصلة بالقرار',target:'governance'}],
 followup:[{title:'التكليفات',detail:'متابعة المسؤول والحالة والموعد المطلوب',target:'tasks'},{title:'المشاريع',detail:'استعراض التقدم والعوائق بحسب المشروع',target:'projects'},{title:'التقويم',detail:'المواعيد والاجتماعات في مكان واحد',target:'calendar'}],
};
export default function ExecutiveWorkspaceHome({mode,user,onNavigate,onCommand,canAccess}:{mode:WorkspaceMode;user:AppUser;onNavigate:(target:string)=>void;onCommand:()=>void;canAccess:(view:string)=>boolean}){
 const current=workspaceModes.find(m=>m.id===mode)!;
 return <div className="space-y-6" dir="rtl"><header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5"><div><p className="text-xs text-[var(--theme-accent)]">مكتب الرئيس التنفيذي · {new Date().toLocaleDateString('ar-SA',{timeZone:'Asia/Riyadh',calendar:'gregory'})}</p><h1 className="mt-2 text-3xl font-black">{current.name}</h1><p className="mt-2 text-sm text-slate-400">أهلاً {user.name}، {current.description}.</p></div><button onClick={onCommand} className="flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-accent-soft)] px-4 py-3 text-sm font-bold text-[var(--theme-accent)]"><Search className="h-4 w-4"/>اطلب ما تحتاجه</button></header>
 <section aria-label="إجراءات المسار" className="grid gap-4 xl:grid-cols-3">{actions[mode].filter(a=>canAccess(a.target==='procurement-plan'?'executive-departments':a.target)).map(a=><button key={a.target} onClick={()=>onNavigate(a.target)} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-right transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-accent-soft)]"><div className="flex items-start justify-between gap-3"><h2 className="text-lg font-black">{a.title}</h2><ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--theme-accent)]"/></div><p className="mt-3 text-sm leading-7 text-slate-400">{a.detail}</p></button>)}</section>
 <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h2 className="font-black">{mode==='information'?'المتاح الآن':mode==='decision'?'ما يحتاج قرارك':'ما يحتاج متابعتك'}</h2><p className="mt-3 max-w-3xl text-sm leading-8 text-slate-400">{mode==='information'?'خطة المشتريات جاهزة للقراءة. للوصول إلى بقية الخطط والجهات افتح «الجهات والخطط» في القائمة، أو اطلب الخطة من شريط البحث.':mode==='decision'?'لا يوجد سجل تشغيلي متصل لعرض قرارات فعلية تنتظر اعتمادك. يمكنك الوصول إلى التوجيهات والمستشار من هذا المسار.':'لا توجد مزامنة تشغيلية لعرض استثناءات مؤكدة. شاشات التكليفات والمشاريع والتقويم متاحة، ويظهر تنبيه في الأقسام التي تتضمن بيانات تجريبية.'}</p></section>
 <p className="text-xs leading-6 text-slate-500">يعرض المكتب المعلومة أولاً، ثم أدوات القرار والمتابعة عند الحاجة. لا تمثل البيانات التجريبية نتائج فعلية للمجموعة.</p>
 </div>;
}
