import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  FileText,
  Gauge,
  Package,
  Search,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppUser } from '../types';

type ScopeNode = { id: string; name: string; root: string; orgId: string; children?: ScopeNode[] };
const scopeTree: ScopeNode[] = [
  { id: 'investment', name: 'أراك للاستثمار', root: 'investment', orgId: 'investment', children: [
    { id: 'national', name: 'أراك الوطنية', root: 'investment', orgId: 'national', children: [
      { id: 'projects', name: 'أراك المشاريع', root: 'investment', orgId: 'national-projects' },
      { id: 'trading', name: 'أراك التجارية', root: 'investment', orgId: 'trading' },
    ]},
    { id: 'industrial', name: 'أراك الصناعية', root: 'investment', orgId: 'industrial', children: [
      { id: 'steel', name: 'أراك الحديد', root: 'investment', orgId: 'steel-factory' },
      { id: 'food', name: 'أراك الغذائية', root: 'investment', orgId: 'food' },
    ]},
    { id: 'digital', name: 'أراك الرقمية', root: 'investment', orgId: 'digital', children: [
      { id: 'stores', name: 'أراك ستور', root: 'investment', orgId: 'araak-stores' },
      { id: 'home', name: 'أراك هوم', root: 'investment', orgId: 'araak-home' },
    ]},
  ]},
  { id: 'logistics', name: 'أراك اللوجستية', root: 'logistics', orgId: 'logistics' },
  { id: 'development', name: 'أراك التنمية', root: 'development', orgId: 'development', children: [
    { id: 'education', name: 'الحلول التعليمية', root: 'development', orgId: 'education' },
    { id: 'consulting', name: 'الاستشارات والتطوير', root: 'development', orgId: 'consulting' },
  ]},
  { id: 'strategic-projects', name: 'المشاريع الاستراتيجية', root: 'strategic-projects', orgId: 'strategic-projects', children: [
    { id: 'university', name: 'جامعة أراك', root: 'strategic-projects', orgId: 'university' },
    { id: 'volunteering', name: 'منصة أراك للتطوع', root: 'strategic-projects', orgId: 'volunteering' },
    { id: 'tanmyat', name: 'مجتمع تنميات', root: 'strategic-projects', orgId: 'tanmyat' },
  ]},
];

type Indicator = { id: string; title: string; group: string; icon: LucideIcon; description: string; source: string; measures: string[] };
const indicators: Indicator[] = [
  { id: 'sales', title: 'المبيعات', group: 'مالي وتجاري', icon: ShoppingCart, description: 'القيمة والكميات حسب الشركة والقناة والمنتج، ومقارنتها بالمستهدف والفترة السابقة.', source: 'الفواتير ونقاط البيع والمتاجر الإلكترونية', measures: ['المبيعات حسب الشركة والمنتج', 'المبيعات حسب القناة: متجر، معرض، مصنع، مشاريع', 'المستهدف مقابل الفعلي واتجاه النمو'] },
  { id: 'margins', title: 'الهوامش والربحية', group: 'مالي', icon: CircleDollarSign, description: 'هامش الربح والتكلفة والربحية حسب المنتج والخدمة والقناة.', source: 'المالية والتكاليف وقسم التسعير المركزي', measures: ['هامش الربح الإجمالي والتشغيلي', 'التكلفة مقابل سعر البيع', 'الربحية حسب المنتج والخدمة والجهة'] },
  { id: 'effectiveness', title: 'الفاعلية', group: 'أداء', icon: Target, description: 'مدى تحقق الأهداف والنتائج والأنشطة ذات الأولوية.', source: 'الخطط والمشاريع ومؤشرات الإدارات', measures: ['تحقق الأهداف مقابل الخطة', 'حالة المبادرات والأنشطة', 'النتائج التي تحتاج إلى تدخل'] },
  { id: 'efficiency', title: 'الكفاءة', group: 'أداء', icon: Gauge, description: 'كفاءة استخدام الوقت والموارد والتكلفة لإنتاج النتائج.', source: 'بيانات التشغيل والمشاريع والمالية', measures: ['تكلفة الوحدة أو الخدمة', 'الوقت ودورة الإنجاز', 'الإنتاجية واستخدام الموارد'] },
  { id: 'assets', title: 'الأصول وحالتها', group: 'تشغيل', icon: Wrench, description: 'حالة الأصول ومدى استخدامها واحتياجات الصيانة.', source: 'سجل الأصول والصيانة', measures: ['حالة الأصل وجاهزيته', 'معدل الاستخدام والاستفادة', 'الصيانة المتأخرة والمخاطر'] },
  { id: 'people', title: 'أداء العاملين', group: 'موارد بشرية', icon: Users, description: 'مؤشرات الأداء والإنجاز والقدرات على مستوى الإدارات.', source: 'الموارد البشرية وأهداف الإدارات', measures: ['إنجاز الأهداف والمسؤوليات', 'القدرات والاحتياج التدريبي', 'توزيع القوى العاملة'] },
  { id: 'market', title: 'السوق والمنافسة', group: 'سوق', icon: TrendingUp, description: 'حركة أسعار السوق ومقارنتها بتكلفة المجموعة وأسعار المنافسين.', source: 'مصدر سوقي خارجي يعتمد قبل تفعيله', measures: ['السعر المرجعي للحديد اليوم واتجاهه', 'مؤشرات مواد البناء', 'مقارنة أسعار المنافسين والقدرة الشرائية'] },
];

function findNode(id: string, nodes: ScopeNode[] = scopeTree, trail: ScopeNode[] = []): ScopeNode[] {
  for (const node of nodes) {
    const path = [...trail, node];
    if (node.id === id) return path;
    const found = findNode(id, node.children || [], path);
    if (found.length) return found;
  }
  return [];
}

export default function ExecutiveWorkspaceHome({
  user, onNavigate, onCommand, canAccess, onOpenOrganization,
}: {
  user: AppUser;
  onNavigate: (target: string) => void;
  onCommand: () => void;
  canAccess: (view: string) => boolean;
  onOpenOrganization: (root: string, orgId: string) => void;
}) {
  const [scopeId, setScopeId] = useState<string | null>(null);
  const [indicatorId, setIndicatorId] = useState('sales');
  const path = useMemo(() => scopeId ? findNode(scopeId) : [], [scopeId]);
  const currentScope = path[path.length - 1];
  const selectedIndicator = indicators.find(item => item.id === indicatorId) || indicators[0];
  const children = currentScope?.children || [];
  const scopeTitle = currentScope?.name || 'مجموعة أراك';

  return <div className="space-y-6 text-right" dir="rtl">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
      <div>
        <p className="text-xs text-[var(--theme-accent)]">مكتب الرئيس التنفيذي · لوحة قيادة الأداء</p>
        <h1 className="mt-2 text-3xl font-black">{scopeTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">أهلاً {user.name}، اختر مستوى العرض ثم افتح المؤشر للتفاصيل والجهة المرتبطة به.</p>
      </div>
      <button onClick={onCommand} className="flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-accent-soft)] px-4 py-3 text-sm font-bold text-[var(--theme-accent)]">
        <Search className="h-4 w-4"/>اطلب ما تحتاجه
      </button>
    </header>

    <nav aria-label="مستوى لوحة الأداء" className="flex flex-wrap items-center gap-2 text-sm">
      <button onClick={() => setScopeId(null)} className={!currentScope ? 'font-black text-[var(--theme-accent)]' : 'text-slate-400 hover:text-white'}>المجموعة</button>
      {path.map((node, index) => <span key={node.id} className="flex items-center gap-2">
        <ArrowRight className="h-3.5 w-3.5 text-slate-600"/>
        <button onClick={() => setScopeId(node.id)} className={index === path.length - 1 ? 'font-black text-[var(--theme-accent)]' : 'text-slate-400 hover:text-white'}>{node.name}</button>
      </span>)}
      <span className="mr-auto rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 text-[10px] font-bold text-amber-300">حالة الربط: بعض مصادر البيانات غير متصلة</span>
    </nav>

    {!currentScope && <section aria-label="جهات المجموعة" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {scopeTree.map(node => <button key={node.id} onClick={() => setScopeId(node.id)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-right transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-accent-soft)]">
        <span className="font-bold">{node.name}</span><ArrowUpRight className="h-4 w-4 text-[var(--theme-accent)]"/>
      </button>)}
    </section>}

    {currentScope && children.length > 0 && <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-black">التفصيل حسب الجهة أو النشاط</h2>
        <button onClick={() => onOpenOrganization(currentScope.root, currentScope.orgId)} className="text-xs font-bold text-[var(--theme-accent)] hover:underline">فتح الهيكل التنظيمي <ArrowUpLeftIcon/></button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {children.map(node => <button key={node.id} onClick={() => setScopeId(node.id)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-right transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-accent-soft)]">
          <span className="font-bold">{node.name}</span><ArrowUpRight className="h-4 w-4 text-[var(--theme-accent)]"/>
        </button>)}
      </div>
    </section>}

    {currentScope && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div><p className="text-xs text-slate-500">المؤسسة المحددة</p><p className="mt-1 font-bold">{currentScope.name}</p></div>
      <button onClick={() => onOpenOrganization(currentScope.root, currentScope.orgId)} className="rounded-lg bg-[var(--theme-accent-soft)] px-4 py-2 text-xs font-bold text-[var(--theme-accent)]">فتح صفحة الجهة والقسم</button>
    </div>}

    <section aria-label="مؤشرات الأداء" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="font-black">مؤشرات الأداء</h2><p className="mt-1 text-xs text-slate-500">اضغط أي مؤشر لعرض مكوناته ومصدر بياناته، ثم انتقل إلى الجهة المعنية.</p></div>
        {canAccess('reports') && <button onClick={() => onNavigate('reports')} className="text-xs font-bold text-[var(--theme-accent)] hover:underline">التقارير التفصيلية</button>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {indicators.map(item => {
          const Icon = item.icon;
          const active = item.id === indicatorId;
          return <button key={item.id} onClick={() => setIndicatorId(item.id)} aria-pressed={active} className={'rounded-xl border p-4 text-right transition ' + (active ? 'border-[var(--theme-border)] bg-[var(--theme-accent-soft)]' : 'border-white/10 bg-white/[0.035] hover:border-white/20')}>
            <div className="flex items-center justify-between gap-3"><span className="font-black">{item.title}</span><Icon className="h-5 w-5 text-[var(--theme-accent)]"/></div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{item.description}</p>
            <span className="mt-3 inline-flex rounded-full border border-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-300">بانتظار ربط المصدر</span>
          </button>;
        })}
      </div>
    </section>

    <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div><p className="text-[10px] text-[var(--theme-accent)]">{selectedIndicator.group}</p><h2 className="mt-1 text-xl font-black">{selectedIndicator.title} · {scopeTitle}</h2></div>
          <selectedIndicator.icon className="h-6 w-6 text-[var(--theme-accent)]"/>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-400">{selectedIndicator.description}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {selectedIndicator.measures.map(measure => <div key={measure} className="flex items-center gap-2 rounded-lg bg-white/[0.035] px-3 py-2.5 text-xs text-slate-300"><CheckCircle2 className="h-4 w-4 shrink-0 text-slate-500"/>{measure}</div>)}
        </div>
        <p className="mt-4 text-xs text-slate-500">مصدر البيانات المقترح: {selectedIndicator.source}</p>
        <p className="mt-1 text-xs font-bold text-amber-300">لا تظهر قيمة فعلية حتى يكتمل ربط مصدر البيانات والتحقق من تحديثه.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {canAccess('reports') && <button onClick={() => onNavigate('reports')} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5">عرض التقارير</button>}
          {currentScope && <button onClick={() => onOpenOrganization(currentScope.root, currentScope.orgId)} className="rounded-lg bg-[var(--theme-accent-soft)] px-3 py-2 text-xs font-bold text-[var(--theme-accent)]">فتح الجهة المرتبطة</button>}
        </div>
      </div>

      <aside className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <h2 className="font-black">ما يحتاج التركيز</h2>
        <p className="mt-2 text-xs leading-6 text-slate-400">تظهر هنا الأنشطة التي تحتاج تدخلاً بعد ورود بيانات موثقة عن الأهداف، الحالة، الفاعلية والكفاءة.</p>
        <div className="mt-4 rounded-xl border border-dashed border-white/10 p-4 text-xs leading-6 text-slate-500">لا توجد أولويات تشغيلية مؤكدة حالياً؛ مصادر الأداء لم تُربط بعد.</div>
      </aside>
    </section>

    <section className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-slate-500">
      <FileText className="h-4 w-4"/>
      <span>المبيعات والمالية من الأنظمة المحاسبية وقنوات البيع · المشاريع من سجلات التنفيذ · الأصول من سجل الأصول والصيانة · العاملون من الموارد البشرية · السوق من مزود بيانات خارجي يعتمد قبل الربط.</span>
    </section>
  </div>;
}

function ArrowUpLeftIcon() {
  return <ArrowUpRight className="inline h-3.5 w-3.5 rotate-[-90deg]"/>;
}
