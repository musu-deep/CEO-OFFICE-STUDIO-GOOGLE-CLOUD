import { useEffect, useState } from 'react';
import { Building2, ChevronLeft, Network, Search } from 'lucide-react';
import { organization, findOrgPath, type OrgNode } from '../data/organization';
import type { PlatformTheme } from '../types';
import ArakEgyptView from './ArakEgyptView';
import ProcurementWorkspace from './ProcurementWorkspace';
import EcommercePerformanceView from './EcommercePerformanceView';

type Props = { theme: PlatformTheme; userKey?: string; rootId?: string; selectedId?: string; onSelect?: (id: string) => void; hideNavigation?: boolean; onNavigate?: (view: string) => void; allowedViews?: string[] };
export default function ExecutiveDepartmentsView({ theme, userKey = 'local-user', rootId = 'investment', selectedId, onSelect, hideNavigation = false, onNavigate, allowedViews = [] }: Props) {
  const [selected, setSelected] = useState(rootId);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('structure');
  useEffect(() => { setSelected(selectedId || rootId); setQuery(''); setTab('structure'); }, [rootId, selectedId]);
  const path = findOrgPath(selected);
  const current = path.at(-1) || organization[0];
  const root = organization.find(n => n.id === rootId) || organization[0];
  const select = (id: string) => { setSelected(id); onSelect?.(id); setTab('structure'); };
  const canOpen = (view?: string) => !!view && allowedViews.includes(view);
  const renderTree = (items: OrgNode[], depth = 0): any => items.map(item => {
    const matches = !query.trim() || [item, ...flatten(item.children || [])].some(n => n.name.includes(query.trim()));
    if (!matches) return null;
    return <div key={item.id}>
      <button onClick={() => select(item.id)} style={{ paddingInlineStart: 12 + depth * 14 }} className={`w-full rounded-xl py-2.5 pl-3 text-right text-sm transition ${selected === item.id ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] font-black' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>{item.name}</button>
      {item.children && renderTree(item.children, depth + 1)}
    </div>;
  });
  if (['procurement','contracts-procurement'].includes(current.id)) return <ProcurementWorkspace userKey={userKey}/>;
  if (current.id === 'cairo' && canOpen('egypt')) return <div dir="rtl" className="space-y-5"><div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">{path.map(n=><button key={n.id} onClick={()=>select(n.id)}>{n.name} /</button>)}</div><h2 className="text-2xl font-black">القاهرة · أراك مصر</h2><p className="text-xs text-amber-300">يتضمن هذا القسم بيانات تجريبية؛ لم يربط بالمصدر التشغيلي بعد.</p><ArakEgyptView theme={theme}/></div>;
  const services = [['projects','المشاريع والمبادرات'],['tasks','التكليفات والمهام'],['reports','التقارير والتحليلات'],['documents','الوثائق']];
  return <div dir="rtl" className="space-y-6 text-right">
    <header className="border-b border-white/10 pb-5"><p className="mb-2 flex items-center gap-2 text-xs text-[var(--theme-accent)]"><Network className="h-4 w-4"/>مجموعة اراك للتنمية · الهيكل التنظيمي 2026</p><h2 className="text-3xl font-black">{root.name}</h2><p className="mt-2 text-sm text-slate-400">مجلس الإدارة ← الرئيس التنفيذي · المصفوفة المؤرخة في 29 يوليو 2026</p></header>
    <div className={`grid items-start gap-5 ${hideNavigation ? 'grid-cols-1' : 'xl:grid-cols-[300px_1fr]'}`}>
      {!hideNavigation && <aside className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><label className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 px-3"><Search className="h-4 w-4 text-slate-500"/><input aria-label="بحث في الهيكل التنظيمي" value={query} onChange={e=>setQuery(e.target.value)} placeholder="بحث في الهيكل" className="min-w-0 w-full bg-transparent py-3 text-sm outline-none"/></label><div className="max-h-[65vh] overflow-auto">{renderTree([root])}{query && !flatten([root]).some(n=>n.name.includes(query.trim())) && <p className="p-3 text-sm text-slate-500">لا توجد نتائج</p>}</div></aside>}
      <section className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">{path.map(n=><button key={n.id} onClick={()=>select(n.id)} className="flex items-center gap-2 hover:text-[var(--theme-accent)]">{n.name}<ChevronLeft className="h-3 w-3"/></button>)}</div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><div className="flex items-center gap-3"><Building2 className="h-7 w-7 text-[var(--theme-accent)]"/><h3 className="text-2xl font-black">{current.name}</h3></div><p className="mt-3 text-sm text-slate-400">{path.length > 1 ? `يتبع: ${path.at(-2)?.name}` : current.id === 'ceo' ? 'يرتبط بمجلس الإدارة' : 'يرتبط بالرئيس التنفيذي'}</p>{path[0]?.planned && <span className="mt-3 inline-block rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">قيد التنفيذ</span>}</div>
        <div className="flex flex-wrap gap-2">{[['structure','التبعية والوحدات'],['performance','الخطط والأداء']].map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold ${tab === id ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]' : 'text-slate-400'}`}>{label}</button>)}</div>
        {tab === 'structure' && hideNavigation ? <p className="rounded-2xl border border-white/10 p-5 text-sm text-slate-400">لا توجد بيانات تشغيلية مرتبطة بهذه الجهة حالياً. ستظهر هنا خطتها وأداؤها والقرارات المطلوبة عند ربط مصادر البيانات.</p> : tab === 'structure' ? <div className="grid gap-3 md:grid-cols-2">{current.children?.length ? current.children.map(child=><button key={child.id} onClick={()=>select(child.id)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-right hover:border-[var(--theme-accent)]"><span><span className="block font-bold">{child.name}</span><span className="mt-2 block text-xs text-slate-500">{child.children?.length ? `${child.children.length} وحدات تابعة` : 'عرض الوحدة'}</span></span><ChevronLeft className="h-4 w-4"/></button>) : <p className="col-span-full rounded-2xl border border-white/10 p-5 text-sm text-slate-400">لا توجد وحدات فرعية مسماة لهذه الجهة في المصفوفة.</p>}</div> : ['digital','araak-stores','araak-home'].includes(current.id) ? <EcommercePerformanceView theme={theme} unitId={current.id === 'digital' ? undefined : current.id}/> : <div className="rounded-2xl border border-white/10 p-6"><h4 className="font-bold">الخطط والمؤشرات والميزانية</h4><p className="mt-3 text-sm leading-7 text-slate-400">لم تُربط خطة أو بيانات أداء معتمدة بهذه الجهة بعد. تظهر النتائج بعد ربطها بمصدر البيانات الخاص بها.</p></div>}
        {canOpen(current.view) && <button onClick={()=>onNavigate?.(current.view!)} className="rounded-xl bg-[var(--theme-accent-soft)] px-5 py-3 font-bold text-[var(--theme-accent)]">فتح خدمات {current.name}</button>}
        <details className="rounded-2xl border border-white/10 p-5"><summary className="cursor-pointer text-sm font-bold">مصادر إضافية</summary><div className="flex flex-wrap gap-2">{services.filter(([id])=>canOpen(id)).map(([id,label])=><button key={id} onClick={()=>onNavigate?.(id)} className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:text-slate-100">{label}</button>)}</div><p className="mt-3 text-xs text-slate-500">تفتح الأدوات العامة للمنصة حسب صلاحياتك.</p></details>
      </section>
    </div>
  </div>;
}
function flatten(nodes: OrgNode[]): OrgNode[] { return nodes.flatMap(n=>[n,...flatten(n.children || [])]); }
