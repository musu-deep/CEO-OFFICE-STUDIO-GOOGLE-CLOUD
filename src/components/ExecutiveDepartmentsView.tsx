import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Bot, ChevronLeft, Database, FileCheck2, Gauge,
  Layers3, LineChart, Network, RefreshCw, ShoppingCart, Store, Target
} from 'lucide-react';
import type { PlatformTheme } from '../types';

type Status = 'on-track' | 'watch' | 'critical' | 'ahead' | 'pending';
type Kpi = {
  name: string; period: string; target?: string; reported?: string; verified?: string;
  variance?: string; forecast?: string; status: Status; source: string; updated?: string;
};
type Unit = { id: string; name: string; description: string; plan: string; budget: string; kpis: Kpi[] };
type Department = { id: string; name: string; description: string; units: Unit[] };

const departments: Department[] = [
  {
    id: 'ecommerce',
    name: 'إدارة التجارة الإلكترونية',
    description: 'إدارة تنفيذية تجمع أنشطة ومتاجر التجارة الإلكترونية التابعة للمجموعة، وتعرض أداءها من خلال وظائف المنصة القائمة دون تكرارها.',
    units: [
      {
        id: 'araak-home',
        name: 'أراك هوم',
        description: 'التجارة الإلكترونية لمواد البناء والتشطيب ومستلزمات المشاريع.',
        plan: 'الخطة التنفيذية لأراك هوم',
        budget: 'يُقرأ من الخطة المعتمدة',
        kpis: [
          { name: 'المبيعات', period: 'شهري', status: 'pending', source: 'أراك هوم + التخطيط التنفيذي' },
          { name: 'الطلبات المكتملة', period: 'أسبوعي', status: 'pending', source: 'أراك هوم' },
          { name: 'متوسط قيمة الطلب', period: 'شهري', status: 'pending', source: 'أراك هوم' },
          { name: 'توافر المخزون', period: 'أسبوعي', status: 'pending', source: 'أراك هوم / مصدر المخزون' },
        ],
      },
      {
        id: 'araak-stores',
        name: 'أراك ستورز',
        description: 'القناة التجارية الرقمية لأراك ستورز ومؤشرات المبيعات والطلبات والعملاء.',
        plan: 'خطة أراك ستورز',
        budget: 'يُقرأ من الخطة المعتمدة',
        kpis: [
          { name: 'المبيعات', period: 'شهري', status: 'pending', source: 'أراك ستورز + التخطيط التنفيذي' },
          { name: 'الطلبات', period: 'أسبوعي', status: 'pending', source: 'أراك ستورز' },
          { name: 'نسبة تحقيق المستهدف', period: 'شهري', status: 'pending', source: 'التخطيط التنفيذي + أراك ستورز' },
        ],
      },
    ],
  },
];

const statusMeta: Record<Status, { label: string; cls: string }> = {
  'on-track': { label: 'ضمن المستهدف', cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
  ahead: { label: 'أعلى من المستهدف', cls: 'text-sky-300 bg-sky-500/10 border-sky-500/20' },
  watch: { label: 'متابعة', cls: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
  critical: { label: 'انحراف جوهري', cls: 'text-rose-300 bg-rose-500/10 border-rose-500/20' },
  pending: { label: 'بانتظار البيانات', cls: 'text-slate-300 bg-slate-500/10 border-slate-500/20' },
};

export default function ExecutiveDepartmentsView({ theme }: { theme: PlatformTheme }) {
  const [departmentId, setDepartmentId] = useState('ecommerce');
  const [unitId, setUnitId] = useState('araak-home');
  const department = useMemo(() => departments.find(d => d.id === departmentId) || departments[0], [departmentId]);
  const unit = useMemo(() => department.units.find(u => u.id === unitId) || department.units[0], [department, unitId]);
  const accent = theme === 'golden_luxury' ? 'text-amber-400' : theme === 'midnight_navy' ? 'text-blue-400' : 'text-emerald-400';

  return (
    <div className="space-y-6 text-right animate-[fadeIn_0.35s_ease-out]" dir="rtl">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className={`mb-2 flex items-center gap-2 text-xs font-black ${accent}`}><Network className="h-4 w-4" /> منظومة التنفيذ المؤسسي</div>
          <h2 className="text-3xl font-black text-white">الإدارات التنفيذية ومراقبة الأداء</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-400">
            هذه الشاشة تمثل الهيكل الإداري التنفيذي الفعلي فقط. التخطيط والمشاريع والمهام والتقارير والحوكمة والوثائق تبقى وظائف مشتركة في القائمة الرئيسية وتخدم الإدارات دون تكرار.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300"><FileCheck2 className="ml-1 inline h-4 w-4" /> التخطيط التنفيذي: مصدر المستهدفات</span>
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300"><Bot className="ml-1 inline h-4 w-4" /> Araak Agent: تحليل ومطابقة</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          [Target, 'الإدارات', departments.length, 'إدارات فعلية معتمدة'],
          [Layers3, 'الوحدات المرتبطة', departments.reduce((n,d)=>n+d.units.length,0), 'شركات ووحدات تابعة للإدارة'],
          [Gauge, 'المؤشرات', departments.flatMap(d=>d.units).reduce((n,u)=>n+u.kpis.length,0), 'بدون أرقام افتراضية'],
          [AlertTriangle, 'قرارات مطلوبة', '—', 'تظهر عند تحقق شروط التنبيه'],
        ].map(([Icon,label,value,sub]) => {
          const I = Icon as typeof Target;
          return <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold text-slate-500">{String(label)}</p><p className="mt-2 text-3xl font-black text-white">{String(value)}</p></div><I className={`h-5 w-5 ${accent}`} /></div>
            <p className="mt-2 text-xs text-slate-500">{String(sub)}</p>
          </div>
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <p className="mb-3 px-2 text-xs font-black text-slate-500">الإدارات</p>
          <div className="space-y-2">
            {departments.map(d => (
              <button key={d.id} onClick={() => { setDepartmentId(d.id); setUnitId(d.units[0]?.id || ''); }}
                className={`w-full rounded-xl border p-3 text-right transition ${departmentId===d.id ? 'border-emerald-500/30 bg-emerald-500/10 text-white' : 'border-white/5 bg-white/[0.025] text-slate-400 hover:bg-white/[0.06]'}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-sm font-extrabold">{d.name}</span><ChevronLeft className="h-4 w-4 opacity-50" /></div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{d.description}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div><p className={`text-xs font-black ${accent}`}>الإدارة المختارة</p><h3 className="mt-1 text-2xl font-black text-white">{department.name}</h3><p className="mt-2 text-sm text-slate-400">{department.description}</p></div>
              <div className="flex gap-2">
                <span className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-300">دورية المتابعة: أسبوعي / شهري</span>
                <span className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-300">تجميع تنفيذي دون ازدواجية</span>
              </div>
            </div>
          </div>

          {department.units.length ? (
            <>
              <div className="flex flex-wrap gap-2">
                {department.units.map(u => <button key={u.id} onClick={()=>setUnitId(u.id)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-black transition ${unit?.id===u.id?'border-emerald-400/30 bg-emerald-500/15 text-emerald-200':'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`}>
                  {u.id==='araak-home'?<ShoppingCart className="ml-2 inline h-4 w-4"/>:<Store className="ml-2 inline h-4 w-4"/>}{u.name}
                </button>)}
              </div>

              {unit && <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0b0e17]/55 p-6">
                <div className="grid gap-3 lg:grid-cols-4">
                  <div className="lg:col-span-2"><p className="text-xs text-slate-500">الوحدة</p><h4 className="mt-1 text-xl font-black text-white">{unit.name}</h4><p className="mt-2 text-xs leading-6 text-slate-400">{unit.description}</p></div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-500">الخطة المرتبطة</p><p className="mt-2 text-sm font-bold text-white">{unit.plan}</p></div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-500">الميزانية</p><p className="mt-2 text-sm font-bold text-white">{unit.budget}</p></div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[980px] text-right text-xs">
                    <thead className="bg-white/5 text-slate-500"><tr>{['المؤشر','الدورية','المستهدف','المرفوع','المتحقق منه','الانحراف ±','التوقع','الحالة','مصدر البيانات'].map(h=><th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr></thead>
                    <tbody>{unit.kpis.map(k=><tr key={k.name} className="border-t border-white/5 text-slate-300">
                      <td className="px-4 py-3 font-bold text-white">{k.name}</td><td className="px-4 py-3">{k.period}</td>
                      <td className="px-4 py-3">{k.target||'—'}</td><td className="px-4 py-3">{k.reported||'—'}</td><td className="px-4 py-3">{k.verified||'—'}</td>
                      <td className="px-4 py-3">{k.variance||'—'}</td><td className="px-4 py-3">{k.forecast||'—'}</td>
                      <td className="px-4 py-3"><span className={`rounded-lg border px-2 py-1 ${statusMeta[k.status].cls}`}>{statusMeta[k.status].label}</span></td>
                      <td className="px-4 py-3 text-slate-500">{k.source}</td>
                    </tr>)}</tbody>
                  </table>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><Database className={`mb-3 h-5 w-5 ${accent}`}/><p className="font-black text-white">مصادر البيانات</p><p className="mt-1 text-xs leading-6 text-slate-500">التخطيط التنفيذي + بيانات الوحدة + المصادر المرتبطة المتاحة للمنصة.</p></div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><RefreshCw className={`mb-3 h-5 w-5 ${accent}`}/><p className="font-black text-white">المطابقة والتحقق</p><p className="mt-1 text-xs leading-6 text-slate-500">Target ↔ Reported ↔ Verified مع تفسير الاختلاف قبل إصدار التنبيه.</p></div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><LineChart className={`mb-3 h-5 w-5 ${accent}`}/><p className="font-black text-white">التوقع ودعم القرار</p><p className="mt-1 text-xs leading-6 text-slate-500">اتجاه الأداء، التوقع، الاستثناءات والقرارات التي تتطلب تدخل الإدارة العليا.</p></div>
                </div>
              </div>}
            </>
          ) : null}
        </section>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-4 flex items-center gap-2"><Activity className={`h-5 w-5 ${accent}`}/><h3 className="font-black text-white">مسار الإدارة التنفيذية داخل المنصة</h3></div>
        <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-8">
          {['الخطة المعتمدة','الإدارة الفعلية','الشركة / الوحدة','KPI + Budget','مصادر البيانات','المطابقة والتحليل','تنبيه / توقع','قرار ومتابعة'].map((s,i)=><div key={s} className="rounded-xl border border-white/10 bg-black/15 p-3 text-center text-xs font-bold text-slate-300"><span className="mb-1 block text-[10px] text-slate-600">{String(i+1).padStart(2,'0')}</span>{s}</div>)}
        </div>
      </div>

      <p className="text-[11px] leading-5 text-slate-600">
        ملاحظة تكاملية: أي ربط قائم مع Odoo محفوظ كما هو ولم يُحذف أو يُستبدل. لا تعتمد هذه الشاشة عليه في المرحلة الحالية، ويمكن إضافته لاحقاً كمصدر بيانات عند استئناف المزامنة.
      </p>
    </div>
  );
}
