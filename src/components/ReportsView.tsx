import { useState } from 'react';
import { Activity, BarChart3, Building2, CircleDollarSign, Package, Target, TrendingUp, Users, Wrench } from 'lucide-react';
import type { PlatformTheme } from '../types';

const reportAreas = [
  { id: 'sales', name: 'المبيعات والهوامش', source: 'الفواتير ونقاط البيع والمتاجر · المالية والتسعير', icon: CircleDollarSign },
  { id: 'effectiveness', name: 'الفاعلية والكفاءة', source: 'المشاريع والخطط ومؤشرات الإدارات', icon: Target },
  { id: 'assets', name: 'الأصول والصيانة', source: 'سجل الأصول وطلبات الصيانة', icon: Wrench },
  { id: 'people', name: 'أداء العاملين', source: 'الموارد البشرية وأهداف الإدارات', icon: Users },
  { id: 'market', name: 'السوق والمنافسة', source: 'مزود بيانات سوقية خارجي يعتمد قبل الربط', icon: TrendingUp },
  { id: 'operations', name: 'التشغيل والمشاريع', source: 'سجلات التنفيذ والتشغيل', icon: Building2 },
];

const themeAccent: Record<PlatformTheme, string> = {
  vision_2030: 'text-emerald-400',
  golden_luxury: 'text-amber-400',
  midnight_navy: 'text-blue-400',
  spring: 'text-lime-400',
};

export default function ReportsView({ theme }: { theme: PlatformTheme }) {
  const [selected, setSelected] = useState('sales');
  const selectedArea = reportAreas.find(area => area.id === selected) || reportAreas[0];
  const SelectedIcon = selectedArea.icon;

  return <div className="space-y-6 text-right" dir="rtl">
    <header className="border-b border-white/10 pb-5">
      <p className={'text-xs font-bold ' + themeAccent[theme]}>مكتب الرئيس التنفيذي · التقارير التفصيلية</p>
      <h1 className="mt-2 text-3xl font-black">تحليل مؤشرات المجموعة</h1>
      <p className="mt-2 text-sm text-slate-400">تفاصيل المؤشرات حسب الجهة والفترة، مع توضيح مصدر كل قيمة وحالة تحديثها.</p>
    </header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="مجالات التقارير">
      {reportAreas.map(area => {
        const Icon = area.icon;
        return <button key={area.id} onClick={() => setSelected(area.id)} aria-pressed={selected === area.id} className={'rounded-xl border p-4 text-right transition ' + (selected === area.id ? 'border-[var(--theme-border)] bg-[var(--theme-accent-soft)]' : 'border-white/10 bg-white/[0.035] hover:border-white/20')}>
          <div className="flex items-center justify-between"><span className="font-bold">{area.name}</span><Icon className="h-5 w-5 text-[var(--theme-accent)]"/></div>
          <p className="mt-2 text-xs leading-5 text-slate-500">{area.source}</p>
        </button>;
      })}
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-xs text-slate-500">التقرير المحدد</p><h2 className="mt-1 text-xl font-black">{selectedArea.name}</h2></div>
        <SelectedIcon className="h-7 w-7 text-[var(--theme-accent)]"/>
      </div>
      <div className="mt-5 rounded-xl border border-dashed border-amber-400/20 bg-amber-400/[0.035] p-5">
        <p className="font-bold text-amber-200">لا توجد بيانات موثقة متصلة لهذا التقرير حتى الآن.</p>
        <p className="mt-2 text-sm leading-7 text-slate-400">بعد ربط المصدر، ستظهر القيم الفعلية، الفترة الزمنية، تاريخ آخر تحديث، ومقارنة الأداء بالمستهدف. لن تُعرض أرقام تجريبية على أنها نتائج للمجموعة.</p>
        <p className="mt-3 text-xs text-slate-500">مصدر البيانات المتوقع: {selectedArea.source}</p>
      </div>
    </section>

    <p className="flex items-center gap-2 text-xs leading-6 text-slate-500"><Activity className="h-4 w-4"/><span>تظهر مؤشرات المبيعات والهوامش، الأصول، العاملين، الفاعلية والكفاءة، وأسعار السوق بعد ربط مصادرها والتحقق من دورية تحديثها.</span></p>
  </div>;
}
