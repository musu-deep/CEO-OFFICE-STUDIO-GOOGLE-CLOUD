import { useEffect, useState, useRef, type CSSProperties } from 'react';
import { Building2, CheckSquare, FileText, Bot, Layers, Menu, X, LogOut, Sun, Moon, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import type { AppUser, PlatformTheme } from './types';
import type { Entity } from './lib/executiveModel';
import type { WorkspaceTask } from './server/scopedWorkspace';
import { profileFor } from './lib/workspaceProfiles';
import LoginView from './components/LoginView';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import UnitWorkspace, { ScopedUnitAgent } from './components/UnitWorkspace';
import PerformanceReportsView from './components/PerformanceReportsView';
import ManagerAccountAdministration from './components/ManagerAccountAdministration';
import WorkspaceTasksView, { workspaceRequest, type WorkspaceState } from './components/WorkspaceTasksView';

type ThemeDesignTokens = {
  name: string;
  mainBg: string;
  sidebarBg: string;
  headerBg: string;
  panelBg: string;
  softPanelBg: string;
  text: string;
  bg: string;
  bgHover: string;
  border: string;
  strongBorder: string;
  glow: string;
  icon: string;
  gradientButton: string;
  activeMenu: string;
  selectRing: string;
  cssVars: CSSProperties;
};

const themeTokens: Record<PlatformTheme, ThemeDesignTokens> = {
  vision_2030: {
    name: 'سمة رؤية ٢٠٣٠',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.09),transparent_36%),linear-gradient(135deg,#06110d_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-emerald-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-emerald-500/[0.055] backdrop-blur-xl',
    text: 'text-emerald-400',
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-500',
    border: 'border-emerald-500/20',
    strongBorder: 'border-emerald-400/45',
    glow: 'shadow-emerald-500/20',
    icon: 'text-emerald-400',
    gradientButton: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
    activeMenu: 'bg-gradient-to-l from-emerald-500/95 to-teal-500/85 text-white border border-emerald-300/25 shadow-lg shadow-emerald-500/20',
    selectRing: 'focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/10',
    cssVars: {
      '--theme-accent': '#10b981',
      '--theme-accent-soft': 'rgba(16,185,129,.14)',
      '--theme-card': 'rgba(16,185,129,.055)',
      '--theme-border': 'rgba(16,185,129,.22)',
    } as CSSProperties,
  },
  golden_luxury: {
    name: 'سمة فخامة اراك',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.10),transparent_36%),linear-gradient(135deg,#160f05_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-amber-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-amber-500/[0.06] backdrop-blur-xl',
    text: 'text-amber-400',
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-500',
    border: 'border-amber-500/20',
    strongBorder: 'border-amber-400/45',
    glow: 'shadow-amber-500/20',
    icon: 'text-amber-400',
    gradientButton: 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400',
    activeMenu: 'bg-gradient-to-l from-amber-500/95 to-orange-500/85 text-white border border-amber-300/25 shadow-lg shadow-amber-500/20',
    selectRing: 'focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-400/10',
    cssVars: {
      '--theme-accent': '#f59e0b',
      '--theme-accent-soft': 'rgba(245,158,11,.15)',
      '--theme-card': 'rgba(245,158,11,.06)',
      '--theme-border': 'rgba(245,158,11,.24)',
    } as CSSProperties,
  },
  midnight_navy: {
    name: 'سمة ليل اراك',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_36%),linear-gradient(135deg,#061021_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-blue-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-blue-500/[0.06] backdrop-blur-xl',
    text: 'text-blue-400',
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-500',
    border: 'border-blue-500/20',
    strongBorder: 'border-blue-400/45',
    glow: 'shadow-blue-500/20',
    icon: 'text-blue-400',
    gradientButton: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400',
    activeMenu: 'bg-gradient-to-l from-blue-500/95 to-cyan-500/85 text-white border border-blue-300/25 shadow-lg shadow-blue-500/20',
    selectRing: 'focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-400/10',
    cssVars: {
      '--theme-accent': '#3b82f6',
      '--theme-accent-soft': 'rgba(59,130,246,.15)',
      '--theme-card': 'rgba(59,130,246,.06)',
      '--theme-border': 'rgba(59,130,246,.24)',
    } as CSSProperties,
  },
  spring: {
    name: 'الوضع النهاري',
    mainBg: 'bg-[#f3f7f5]',
    sidebarBg: 'bg-white/95 backdrop-blur-2xl',
    headerBg: 'bg-white/90 backdrop-blur-2xl',
    panelBg: 'bg-white/90 backdrop-blur-xl',
    softPanelBg: 'bg-emerald-50/95 backdrop-blur-xl',
    text: 'text-emerald-700',
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-500',
    border: 'border-emerald-700/15',
    strongBorder: 'border-emerald-600/30',
    glow: 'shadow-emerald-600/10',
    icon: 'text-emerald-700',
    gradientButton: 'bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500',
    activeMenu: 'bg-gradient-to-l from-emerald-600 to-teal-500 text-white border border-emerald-700/10 shadow-lg shadow-emerald-600/15',
    selectRing: 'focus-within:border-emerald-600/35 focus-within:ring-2 focus-within:ring-emerald-600/10',
    cssVars: {
      '--theme-accent': '#047857',
      '--theme-accent-soft': 'rgba(5,150,105,.10)',
      '--theme-card': 'rgba(255,255,255,.92)',
      '--theme-border': 'rgba(4,120,87,.16)',
    } as CSSProperties,
  },
};

export default function App() {
 const [theme,setTheme]=useState<PlatformTheme>(()=>localStorage.getItem('arak_display_mode')==='light'?'spring':'vision_2030');
 const [user,setUser]=useState<AppUser|null>(null),[sessionLoading,setSessionLoading]=useState(true),[scope,setScope]=useState<WorkspaceState|null>(null),[error,setError]=useState('');
 const [view,setView]=useState('home'),[selected,setSelected]=useState(''),[sidebar,setSidebar]=useState(false),[reportContext,setReportContext]=useState({unitId:'',taskId:''});
 const sessionEpoch=useRef(0);
 const office=user?.role==='ceo'||user?.role==='admin',t=themeTokens[theme];
 useEffect(()=>{let cancelled=false;localStorage.removeItem('arak_current_user');fetch('/api/auth/me',{credentials:'include'}).then(async r=>{if(r.ok){const d=await r.json();if(!cancelled)setUser(d.user);}}).catch(()=>{}).finally(()=>{if(!cancelled)setSessionLoading(false);});return()=>{cancelled=true;};},[]);
 const load=async()=>{const epoch=sessionEpoch.current;const r=await fetch('/api/auth/me');if(epoch!==sessionEpoch.current)return;if(r.status===401){sessionEpoch.current++;setUser(null);setScope(null);return;}if(!r.ok)throw Error('تعذر التحقق من الجلسة.');const session=await r.json();if(epoch!==sessionEpoch.current)return;setUser(session.user);const data=await workspaceRequest();if(epoch!==sessionEpoch.current)return;setScope(data);setError('');};
 useEffect(()=>{if(!user)return;setScope(null);setView(office?'dashboard':'home');load().catch(e=>setError(e.message));const timer=setInterval(()=>load().catch(e=>setError(e.message)),30000);return()=>clearInterval(timer);},[user?.email]);
 useEffect(()=>{localStorage.setItem('arak_display_mode',theme==='spring'?'light':'dark');},[theme]);
 useEffect(()=>{if(view==='unit'&&scope&&!scope.entities.some(e=>e.id===selected)){setSelected('');setView('home');}},[scope,selected,view]);
 const navigate=(next:string)=>{setView(next);setSidebar(false);};
 const openUnit=(entity:Entity)=>{setSelected(entity.id);navigate('unit');};
 const report=(task?:WorkspaceTask)=>{setReportContext({unitId:task?.unitId||selected,taskId:task?.id||''});navigate('reports');};
 const logout=async()=>{sessionEpoch.current++;await fetch('/api/auth/logout',{method:'POST'}).catch(()=>{});setUser(null);setScope(null);setSelected('');setReportContext({unitId:'',taskId:''});navigate('home');};
 if(sessionLoading)return <div dir="rtl" className="grid min-h-screen place-items-center bg-slate-950 text-slate-300" role="status">جارٍ التحقق من الجلسة…</div>;
 if(!user)return <LoginView onLoginSuccess={account=>{sessionEpoch.current++;setUser(account);}} theme={theme}/>;
 const current=scope?.entities.find(e=>e.id===selected);
 const nav=(id:string,label:string,icon:ReactNodeLike)=><button key={id} onClick={()=>{if(id==='reports')setReportContext({unitId:'',taskId:''});navigate(id);}} aria-current={view===id?'page':undefined} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right text-sm ${view===id?t.activeMenu:'text-slate-400 hover:bg-white/5'}`}>{icon}{label}</button>;
 const unitList=(list:Entity[])=>list.map(e=><button key={e.id} onClick={()=>openUnit(e)} aria-current={view==='unit'&&selected===e.id?'page':undefined} className={`mb-1 block w-full rounded-xl border-r-2 px-4 py-2.5 text-right text-sm ${selected===e.id&&view==='unit'?'border-emerald-400 bg-emerald-500/10 text-emerald-300':'border-transparent text-slate-400 hover:bg-white/5'}`}><span className="block">{e.name}</span><span className="mt-1 block text-[10px] opacity-70">{profileFor(e.id).title}</span></button>);
 return <div dir="rtl" data-theme={theme} style={t.cssVars} className={`min-h-screen font-sans ${t.mainBg} ${theme==='spring'?'text-slate-900':'text-slate-100'}`}>
 {sidebar&&<button aria-label="إغلاق القائمة" onClick={()=>setSidebar(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden"/>}
 <aside className={`fixed inset-y-0 right-0 z-40 flex w-72 flex-col border-l border-white/10 ${t.sidebarBg} transition-transform ${sidebar?'translate-x-0':'translate-x-full'} lg:translate-x-0`}><header className="border-b border-white/10 p-5"><div className="flex items-center justify-between"><img src="/arak-group-logo.png" alt="مجموعة أراك للتنمية" className="h-16 w-24 object-contain"/><button className="p-2 lg:hidden" aria-label="إغلاق القائمة" onClick={()=>setSidebar(false)}><X/></button></div><p className="mt-3 text-lg font-black">{office?'مكتب الرئيس التنفيذي':'مساحة عملي'}</p><p className="mt-2 break-words text-xs text-slate-400">{user.name} · {user.title}</p></header>
 <nav className="flex-1 space-y-5 overflow-y-auto p-4" aria-label="التنقل حسب الصلاحيات">
 <section>{nav(office?'dashboard':'home',office?'لوحة المعلومات التفاعلية':'مساحتي',<Layers size={18}/>)}</section>
 {office?<><section><h2 className="mb-3 px-3 text-xs text-slate-500">شركات ومؤسسات أراك</h2><div className="max-h-64 overflow-y-auto">{unitList(scope?.entities.filter(e=>e.kind==='company'&&!e.functionId)||[])}</div><button onClick={()=>navigate('home')} className="mt-2 w-full px-3 text-right text-xs text-emerald-400">عرض جميع الجهات والوحدات</button></section><section><h2 className="mb-3 px-3 text-xs text-slate-500">الرقابة والمتابعة</h2>{nav('reports','وارد تقارير الأداء',<FileText size={18}/>)}{nav('tasks','التكليفات والمتابعة',<CheckSquare size={18}/>)}{nav('accounts','الحسابات والصلاحيات',<ShieldCheck size={18}/>)}</section><section><h2 className="mb-3 px-3 text-xs text-slate-500">الإدارات المساندة</h2><div className="max-h-56 overflow-y-auto">{unitList(scope?.entities.filter(e=>e.root==='support'&&e.parentId==='support')||[])}</div></section><section><h2 className="mb-3 px-3 text-xs text-slate-500">الوكلاء التنفيذيون</h2>{nav('agent','وكيل بيانات الجهة',<Bot size={18}/>)}</section></>:<><section><h2 className="mb-3 px-3 text-xs text-slate-500">جهاتي المصرّح بها</h2>{unitList(scope?.entities||[])}{scope&&!scope.entities.length&&<p className="px-3 text-xs leading-6 text-slate-500">الحساب مخصص للتكليفات المسندة إليه.</p>}</section><section>{nav('tasks','مهامي المسندة',<CheckSquare size={18}/>)}{nav('reports','تقاريري ومرفقاتي',<FileText size={18}/>)}</section></>}
 </nav><footer className="space-y-3 border-t border-white/10 p-4"><button onClick={()=>setTheme(theme==='spring'?'vision_2030':'spring')} className="flex w-full items-center gap-3 rounded-lg p-2 text-xs text-slate-400">{theme==='spring'?<Moon size={16}/>:<Sun size={16}/>} {theme==='spring'?'الوضع الليلي':'الوضع النهاري'}</button><button onClick={logout} className="flex w-full items-center gap-3 rounded-lg p-2 text-sm text-rose-400"><LogOut size={16}/>تسجيل الخروج</button></footer></aside>
 <div className="lg:mr-72"><header className={`sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 ${t.headerBg}`}><button aria-label="فتح القائمة" onClick={()=>setSidebar(true)} className="p-2 lg:hidden"><Menu/></button><div className="min-w-0"><p className="truncate text-sm font-bold">{current&&view==='unit'?current.name:office?'مكتب الرئيس التنفيذي':'مساحة العمل المخصصة'}</p><p className="mt-1 text-[11px] text-slate-400">{new Date().toLocaleDateString('ar-SA',{timeZone:'Asia/Riyadh',weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p></div><button aria-label="تحديث الصلاحيات والبيانات" onClick={()=>load().catch(e=>setError(e.message))} className="rounded-xl border border-white/10 p-3 text-slate-400"><RefreshCw size={17}/></button></header>
 <main className="mx-auto max-w-[1600px] p-4 sm:p-6 xl:p-9">{error&&<p role="alert" className="mb-5 rounded-xl border border-rose-400/30 p-4 text-rose-300">{error}</p>}{!scope?<p role="status" className="p-8 text-slate-400">جارٍ تحميل الجهات والصلاحيات…</p>:<>
 {view==='dashboard'&&office&&<ExecutiveDashboard userKey={user.email} onReports={()=>report()} onOpen={(_root,id)=>{const e=scope.entities.find(e=>e.id===id);if(e)openUnit(e);}}/>}
 {(view==='home'||(!office&&view==='dashboard'))&&<ScopeHome scope={scope} open={openUnit} tasks={()=>navigate('tasks')}/>}
 {view==='unit'&&current&&<><div className="mb-4 flex flex-wrap justify-between gap-3"><button onClick={()=>navigate('home')} className="text-xs text-slate-400">جميع مساحات العمل</button><button onClick={()=>report()} className="rounded-xl border border-emerald-500/30 px-4 py-2 text-sm text-emerald-400">إرسال تقرير {current.name}</button></div><UnitWorkspace key={`${user.email}:${current.id}`} unit={current} userKey={user.email}/></>}
 {view==='tasks'&&<WorkspaceTasksView onReport={report}/>}
 {view==='reports'&&<PerformanceReportsView key={`${reportContext.unitId}:${reportContext.taskId}`} initialUnitId={reportContext.unitId} initialTaskId={reportContext.taskId}/>}
 {view==='accounts'&&office&&<ManagerAccountAdministration entities={scope.entities}/>}
 {view==='agent'&&office&&<section className="space-y-5"><h1 className="text-3xl font-black">وكيل بيانات الجهة</h1><label className="block text-sm">اختيار الجهة<select className="mt-3 block w-full rounded-xl border border-white/15 bg-slate-900 p-3 text-white" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">اختر الجهة المراد تحليل بياناتها</option>{scope.entities.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label>{current&&<ScopedUnitAgent unitId={current.id} unitName={current.name}/>}</section>}
 </>}</main></div></div>;
}
type ReactNodeLike=import('react').ReactNode;
function ScopeHome({scope,open,tasks}:{scope:WorkspaceState;open:(entity:Entity)=>void;tasks:()=>void}) {
 const [query,setQuery]=useState('');
 return <div className="space-y-6"><header><p className="text-xs text-emerald-400">{scope.manage?'مجموعة أراك للتنمية':'مساحة العمل المخصصة'}</p><h1 className="mt-3 text-3xl font-black">{scope.manage?'الجهات ومساحات العمل':'إداراتي ومؤسساتي ومهامي'}</h1><p className="mt-3 text-sm text-slate-400">{scope.manage?'اختر الجهة للوصول إلى سجلات مجالها ومؤشراتها ووثائقها.':'تظهر هنا الجهات المصرّح لك بها. لكل مجال سجلاته ونماذج متابعته.'}</p></header><button onClick={tasks} className="flex w-full items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 text-right"><span><span className="block font-bold">{scope.manage?'التكليفات المفتوحة':'مهامي المفتوحة'}</span><span className="mt-2 block text-xs text-slate-400">{scope.tasks.filter(t=>t.status!=='closed').length.toLocaleString('ar-SA')} تكليفات فعلية</span></span><ArrowLeft size={20}/></button>{scope.entities.length>5&&<input aria-label="بحث في الجهات المصرح بها" placeholder="ابحث باسم الجهة أو مجال العمل" value={query} onChange={e=>setQuery(e.target.value)} className="w-full rounded-xl border border-white/15 bg-slate-900 p-4 text-sm text-white"/>}<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{scope.entities.filter(e=>`${e.name} ${profileFor(e.id).title}`.includes(query.trim())).map(e=>{const p=profileFor(e.id);return <button key={e.id} onClick={()=>open(e)} className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-right hover:bg-white/[0.06]"><span className="absolute inset-y-0 right-0 w-1" style={{background:p.accent}}/><span className="text-xs" style={{color:p.accent}}>{p.title}</span><span className="mt-3 block text-xl font-bold">{e.name}</span><span className="mt-3 block text-xs leading-6 text-slate-400">{p.description}</span><span className="mt-5 flex items-center gap-2 text-xs" style={{color:p.accent}}>فتح مساحة الجهة<ArrowLeft size={14}/></span></button>;})}</div>{!scope.entities.length&&<p className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-sm leading-7 text-slate-400">لا توجد جهات مصرح بها لهذا الحساب. يمكنك متابعة التكليفات المسندة إليك وإرسال تقارير إنجازها.</p>}</div>;
}
