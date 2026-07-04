import { 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Mic, 
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { Project, Task, PlatformTheme } from '../types';

interface DailyBriefingViewProps {
  projects: Project[];
  tasks: Task[];
  theme: PlatformTheme;
  onNavigate: (tab: string) => void;
}

export default function DailyBriefingView({ projects, tasks, theme, onNavigate }: DailyBriefingViewProps) {
  
  const criticalProjects = projects.filter(p => p.priority === 'حرج');
  
  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
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
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out]">
      
      {/* Header exatamente igual ao PDF Page 2 */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5 text-right">
        <h2 className="text-3xl font-extrabold text-white">
          مجموعة أراك — التقرير التنفيذي اليومي
        </h2>
        <div className="flex items-center gap-2 text-slate-400 text-xs mt-1 justify-start">
          <span>الأربعاء، ٢٤ يونيو ٢٠٢٦</span>
          <span className="text-slate-600">•</span>
          <span>إلى: <strong className="text-slate-200">د. علي العتيبي</strong></span>
        </div>
      </div>

      {/* AI Briefing - exactly like Page 2 */}
      <div className={`p-6 rounded-2xl border ${getThemeBgClass()} shadow-lg relative overflow-hidden group text-right`}>
        <div className="absolute top-0 left-0 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
              AI Briefing
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">موجز ذكي بواسطة Gemini</span>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-base font-bold text-slate-100">
            موجز اليوم: مراجعة البنود الحرجة، والمهام المتأخرة، وطلبات اللقاء المعلقة لمكتب الـ CEO.
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            سعادة الرئيس د. علي، تظهر تحليلات النظام المترابطة اليوم ضرورة التدخل المباشر في مشروع مجمع الإسكندرية (المصنف حرج بنسبة إنجاز متوقفة عند 25٪) بسبب تعطل توريد الخرسانة للمقاول الإقليمي. كما توجد 8 مهام متأخرة يجب تفويضها بشكل عاجل. بالمقابل، يسجل قطاع التعليم بالأكاديمية تقدماً مبهراً بنسبة 90٪ وجاهز للإطلاق.
          </p>
        </div>
      </div>

      {/* Stats Grid matching layout from Page 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Projects total */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">إجمالي المشاريع</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-bold font-sans text-slate-100 block">9</span>
          <span className="text-[10px] text-slate-500">9 نشط حالياً</span>
        </div>

        {/* Critical projects count */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">مشاريع حرجة</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold font-sans text-rose-500 block">3</span>
          <span className="text-[10px] text-slate-500">تتطلب اهتمام فوري</span>
        </div>

        {/* Delayed tasks */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">مهام متأخرة</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold font-sans text-amber-500 block">8</span>
          <span className="text-[10px] text-slate-500">من أصل 34 مهمة</span>
        </div>

        {/* Today meetings */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">اجتماعات اليوم</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-sans text-slate-100 block">2</span>
          <span className="text-[10px] text-emerald-500">مجدولة اليوم مسبقاً</span>
        </div>

        {/* Pending requests */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">طلبات لقاء معلقة</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold font-sans text-slate-100 block">1</span>
          <span className="text-[10px] text-slate-500">قيد الانتظار والدراسة</span>
        </div>

        {/* Voice guidelines */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">توجيهات صوتية</span>
            <Mic className="w-4 h-4 text-violet-400" />
          </div>
          <span className="text-2xl font-bold font-sans text-slate-100 block">3</span>
          <span className="text-[10px] text-slate-500">تم تسجيلها بنجاح</span>
        </div>

        {/* Average completion rate */}
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right col-span-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">متوسط الإنجاز</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold font-sans text-slate-100">42%</span>
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-l from-amber-500 to-orange-400 h-full rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">مؤشر التقدم العام لمشروعات أراك</span>
        </div>

      </div>

      {/* Critical Projects List exactly like Page 2 */}
      <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 shadow-lg text-right">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800/60 pb-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100">المشاريع الحرجة (تتطلب اهتمام فوري)</h3>
        </div>
        
        <div className="space-y-4">
          {criticalProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-[#16182c] border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1 text-right flex-1">
                <div className="flex items-center gap-3 justify-start">
                  <span className="text-xs bg-rose-500/20 text-rose-400 font-bold px-2.5 py-0.5 rounded-full">حرج</span>
                  <h4 className="text-sm font-bold text-slate-200">{project.name}</h4>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">{project.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans mt-2">
                  <span>القطاع: {project.sector}</span>
                  <span>•</span>
                  <span>المدير: {project.manager}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-400 font-semibold">نسبة الإنجاز</span>
                <div className="flex items-center gap-3 w-full md:w-36 justify-end">
                  <span className="text-sm font-bold font-sans text-rose-500">{project.progress}%</span>
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => onNavigate('tasks')}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
        >
          مراجعة الـ 8 مهام المتأخرة
        </button>
        <button 
          onClick={() => onNavigate('ai_advisor')}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-amber-600/15"
        >
          صياغة توجيه ذكي عاجل
        </button>
      </div>

    </div>
  );
}
