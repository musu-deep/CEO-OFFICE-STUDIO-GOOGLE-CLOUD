import { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download, 
  FileText, 
  Zap, 
  Briefcase, 
  DollarSign, 
  Building2, 
  ArrowUpRight 
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface ReportsViewProps {
  theme: PlatformTheme;
}

export default function ReportsView({ theme }: ReportsViewProps) {
  const [selectedSector, setSelectedSector] = useState<string>('الكل');

  // Corporate stats
  const sectorData = [
    { name: 'الاستثمار', budget: 150, spent: 110, progress: 85, projects: 5, health: 'ممتاز' },
    { name: 'التنمية العامة', budget: 200, spent: 165, progress: 92, projects: 8, health: 'ممتاز' },
    { name: 'أراك لوجستيك', budget: 90, spent: 55, progress: 68, projects: 4, health: 'مستقر' },
    { name: 'الحديد والصناعة', budget: 350, spent: 290, progress: 78, projects: 6, health: 'حرج فني' },
    { name: 'أراك التنمية (مصر)', budget: 45, spent: 35, progress: 78, projects: 3, health: 'مستقر' }
  ];

  const filteredData = selectedSector === 'الكل' 
    ? sectorData 
    : sectorData.filter(d => d.name === selectedSector);

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
    }
  };

  const getThemeBtnClass = () => {
    switch (theme) {
      case 'vision_2030': return 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'golden_luxury': return 'bg-amber-600 hover:bg-amber-500 text-slate-950';
      case 'midnight_navy': return 'bg-blue-600 hover:bg-blue-500 text-white';
      case 'spring': return 'bg-lime-600 hover:bg-lime-500 text-white';
    }
  };

  const getThemeBgClass = () => {
    switch (theme) {
      case 'vision_2030': return 'bg-emerald-950/20 border-emerald-900/40';
      case 'golden_luxury': return 'bg-amber-950/20 border-amber-900/40';
      case 'midnight_navy': return 'bg-blue-950/20 border-blue-900/40';
      case 'spring': return 'bg-lime-950/20 border-lime-900/40';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 14 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            مركز اتخاذ القرارات والتحليلات
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            التقارير الإستراتيجية والتحليلات
          </h2>
          <span className="text-xs text-slate-400">
            لوحة قيادة تفاعلية مجمعة لمتابعة الإنفاق والميزانيات التقديرية ومستويات الإنجاز الفعلي
          </span>
        </div>

        <button 
          onClick={() => alert('جاري تصدير التقرير التنفيذي الشامل بصيغة PDF المشفرة...')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Download className="w-4 h-4" />
          <span>تصدير التقرير العام</span>
        </button>
      </div>

      {/* Grid of 3 key indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Budget Card */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right space-y-2 relative group overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-amber-500"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">إجمالي الميزانية المرصودة</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-3xl font-black text-slate-100 font-sans">835M</span>
            <span className="text-xs text-slate-400 font-bold">درهم / جنيه</span>
          </div>
          <span className="text-[10px] text-slate-500 block">مرصودة لكافة قطاعات ومشاريع المجموعة الـ 5</span>
        </div>

        {/* Expenses Card */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right space-y-2 relative group overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-blue-500"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">المنصرف الفعلي المعتمد</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-3xl font-black text-slate-100 font-sans">655M</span>
            <span className="text-xs text-slate-400 font-bold">درهم / جنيه</span>
          </div>
          <span className="text-[10px] text-slate-500 block">بنسبة إنفاق إجمالية بلغت 78.4%</span>
        </div>

        {/* Combined Completion Level */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right space-y-2 relative group overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-emerald-500"></div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold">متوسط معدل إنجاز المشاريع</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-3xl font-black text-slate-100 font-sans">81.5%</span>
            <span className="text-xs text-slate-400 font-bold">معدل تراكمي</span>
          </div>
          <span className="text-[10px] text-slate-500 block">ارتفاع بمعدل 3% عن الربع المنصرم</span>
        </div>

      </div>

      {/* Interactive Custom SVG Chart Section */}
      <div className="bg-[#121422] rounded-3xl border border-slate-800/80 p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>رسم بياني: توزيع الميزانيات والإنفاق حسب القطاع (بالملايين)</span>
          </h3>

          <div className="flex gap-2">
            {['الكل', 'الاستثمار', 'التنمية العامة', 'أراك لوجستيك', 'الحديد والصناعة'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedSector === sec ? 'bg-amber-600 text-slate-950' : 'bg-[#16182c] text-slate-400 hover:text-slate-100'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Stunning SVG Charts representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Custom SVG Bar Chart */}
          <div className="lg:col-span-8 bg-[#16182c]/40 border border-slate-800/50 p-6 rounded-2xl flex flex-col justify-end min-h-[300px]">
            <div className="flex items-end justify-between h-48 w-full gap-4 pr-4">
              {filteredData.map((d) => (
                <div key={d.name} className="flex flex-col items-center flex-1 group">
                  
                  {/* Bars container */}
                  <div className="flex items-end gap-1.5 h-36 w-full justify-center">
                    {/* Budget bar (amber) */}
                    <div 
                      className="bg-amber-500/80 hover:bg-amber-500 w-4 sm:w-6 rounded-t-md transition-all duration-500 relative cursor-pointer shadow-lg shadow-amber-500/10"
                      style={{ height: `${(d.budget / 350) * 100}%` }}
                      title={`الميزانية: ${d.budget} مليون`}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-200 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-sans whitespace-nowrap">
                        {d.budget}M
                      </span>
                    </div>

                    {/* Spent bar (blue) */}
                    <div 
                      className="bg-blue-500/80 hover:bg-blue-500 w-4 sm:w-6 rounded-t-md transition-all duration-500 relative cursor-pointer shadow-lg shadow-blue-500/10"
                      style={{ height: `${(d.spent / 350) * 100}%` }}
                      title={`المنصرف: ${d.spent} مليون`}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-200 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-sans whitespace-nowrap">
                        {d.spent}M
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <span className="text-[10px] text-slate-400 mt-3 font-semibold text-center truncate w-full max-w-[80px]">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Legends */}
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-800/40 text-[10px] font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>الميزانية التقديرية</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                <span>المصروف الفعلي</span>
              </div>
            </div>
          </div>

          {/* Right side donut progress */}
          <div className="lg:col-span-4 bg-[#16182c]/40 border border-slate-800/50 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
            <h4 className="text-xs font-bold text-slate-300">متوسط الإنجاز المالي والتشغيلي</h4>
            
            {/* Visual circle representing progress */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track circle */}
                <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="transparent" />
                {/* Active progress track */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#f59e0b" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 81.5) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white font-sans">81.5%</span>
                <span className="text-[9px] text-slate-500 font-bold">معدل النمو والتنفيذ</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              تلتزم قطاعات المجموعة بنسب الإنفاق التنموي المخطط لها لتسريع تحقيق مستهدفات رؤية 2030 التنموية.
            </p>
          </div>

        </div>

      </div>

      {/* Corporate table layout exactly like Page 14 */}
      <div className="bg-[#121422] rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800/60 bg-[#16182c]/40">
          <h3 className="text-sm font-black text-slate-100">تفاصيل الأداء المالي والتشغيلي للقطاعات</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-900/40 text-slate-400 font-bold border-b border-slate-800">
                <th className="py-3 px-5">القطاع</th>
                <th className="py-3 px-5 text-center">المشاريع النشطة</th>
                <th className="py-3 px-5 text-center">الميزانية المقررة</th>
                <th className="py-3 px-5 text-center">المصروفات</th>
                <th className="py-3 px-5 text-center">نسبة الإنجاز الفعلي</th>
                <th className="py-3 px-5 text-center">مؤشر السلامة والصحة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sectorData.map((s, index) => (
                <tr key={index} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-4 px-5 font-black text-slate-200">{s.name}</td>
                  <td className="py-4 px-5 text-center font-sans font-bold text-slate-400">{s.projects}</td>
                  <td className="py-4 px-5 text-center font-sans font-bold text-slate-300">{s.budget}M</td>
                  <td className="py-4 px-5 text-center font-sans font-bold text-slate-300">{s.spent}M</td>
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="font-sans font-bold text-slate-200">{s.progress}%</span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${s.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.health === 'ممتاز' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                      s.health === 'مستقر' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' :
                      'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                    }`}>
                      {s.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
