import { 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  DollarSign 
} from 'lucide-react';
import { Project, Task, PlatformTheme } from '../types';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  theme: PlatformTheme;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ projects, tasks, theme, onNavigate }: DashboardViewProps) {
  
  // Calculations
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'نشط' || p.status === 'قيد المراجعة').length;
  const totalTasks = 34; // matching screenshots exactly
  const delayedTasks = 8; // matching screenshots exactly
  const avgCompletion = '42%'; // matching screenshots exactly
  const totalBudget = 288750006; // matching screenshots exactly: 288,750,006

  // RAG status count
  const healthyCount = 2;
  const warningCount = 4;
  const criticalCount = 3;

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
    }
  };

  const getThemeProgressBg = () => {
    switch (theme) {
      case 'vision_2030': return 'from-emerald-500 to-teal-400';
      case 'golden_luxury': return 'from-amber-500 to-orange-400';
      case 'midnight_navy': return 'from-blue-500 to-indigo-400';
      case 'spring': return 'from-lime-500 to-emerald-400';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out]">
      
      {/* Header Info Banner exactly matching Page 15 */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
          لوحة المتابعة التنفيذية
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          أهلاً، د. علي العتيبي
        </h2>
        <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
          <span>نظرة شاملة لأداء المجموعة في الوقت الحقيقي</span>
          <span className="text-slate-600">•</span>
          <span className="font-sans">الأربعاء، ٢٤ يونيو ٢٠٢٦</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: إجمالي المشاريع */}
        <div 
          onClick={() => onNavigate('projects')}
          className="bg-[#121422] hover:bg-[#161a2e] transition-all duration-300 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-xs font-semibold">إجمالي المشاريع</span>
              <span className="text-4xl font-extrabold text-slate-100 mt-2 font-sans">{totalProjects}</span>
              <span className="text-[11px] text-slate-500 mt-1">{activeProjects} نشط حالياً</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-800/30">
              <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: مشاريع نشطة */}
        <div 
          onClick={() => onNavigate('projects')}
          className="bg-[#121422] hover:bg-[#161a2e] transition-all duration-300 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-xs font-semibold">مشاريع نشطة</span>
              <span className="text-4xl font-extrabold text-slate-100 mt-2 font-sans">9</span>
              <span className="text-[11px] text-emerald-500 mt-1">● 9 نشط</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 3: إجمالي المهام */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="bg-[#121422] hover:bg-[#161a2e] transition-all duration-300 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-xs font-semibold">إجمالي المهام</span>
              <span className="text-4xl font-extrabold text-slate-100 mt-2 font-sans">{totalTasks}</span>
              <span className="text-[11px] text-slate-500 mt-1">تنسيق وتوزيع مستمر</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/40 text-indigo-400 border border-indigo-800/30">
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 4: مهام متأخرة */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="bg-[#121422] hover:bg-[#161a2e] transition-all duration-300 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 cursor-pointer shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-xs font-semibold">مهام متأخرة</span>
              <span className="text-4xl font-extrabold text-amber-500 mt-2 font-sans">{delayedTasks}</span>
              <span className="text-[11px] text-rose-500 mt-1">تتطلب إجراءً فورياً</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/30">
              <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 5: متوسط الإنجاز */}
        <div className="bg-[#121422] hover:bg-[#161a2e] transition-all duration-300 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-xs font-semibold">متوسط الإنجاز</span>
              <span className="text-4xl font-extrabold text-slate-100 mt-2 font-sans">{avgCompletion}</span>
              <span className="text-[11px] text-slate-500 mt-1">معدل تقدم المشروعات الحالية</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-800/30">
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 6: الميزانية الإجمالية */}
        <div className="bg-[#121422] hover:bg-[#161a2e] transition-all duration-300 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-xs font-semibold">الميزانية الإجمالية</span>
              <span className="text-3xl font-extrabold text-amber-500 mt-3 font-sans">
                {totalBudget.toLocaleString('ar-EG')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">جنيه / درهم</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      {/* RAG Status Center Chart and Detailed Action Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RAG Chart Card - Left side, exactly like Page 15 */}
        <div className="bg-[#121422] p-8 rounded-2xl border border-slate-800/80 lg:col-span-5 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block mb-1 text-right">حالة المشاريع</span>
            <h3 className="text-lg font-bold text-slate-200 text-right">مؤشر RAG</h3>
          </div>
          
          {/* Radial representation */}
          <div className="flex justify-center items-center my-8 relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Outer circle - Red/Critical */}
              <circle
                cx="96"
                cy="96"
                r="75"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="75"
                className="stroke-rose-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="471"
                strokeDashoffset={471 * (1 - 3/9)}
                strokeLinecap="round"
              />

              {/* Middle circle - Warning */}
              <circle
                cx="96"
                cy="96"
                r="55"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="55"
                className="stroke-amber-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="345"
                strokeDashoffset={345 * (1 - 4/9)}
                strokeLinecap="round"
              />

              {/* Inner circle - Healthy */}
              <circle
                cx="96"
                cy="96"
                r="35"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="35"
                className="stroke-emerald-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="219"
                strokeDashoffset={219 * (1 - 2/9)}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-sans text-white">9</span>
              <span className="text-[10px] text-slate-400">مشاريع كلية</span>
            </div>
          </div>

          {/* Legend Items exactly as depicted */}
          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            <div className="bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-xl">
              <span className="text-xl font-extrabold text-rose-500 font-sans block">{criticalCount}</span>
              <span className="text-[11px] text-slate-400">حرج</span>
            </div>
            <div className="bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-xl">
              <span className="text-xl font-extrabold text-amber-500 font-sans block">{warningCount}</span>
              <span className="text-[11px] text-slate-400">تنبيه</span>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl">
              <span className="text-xl font-extrabold text-emerald-500 font-sans block">{healthyCount}</span>
              <span className="text-[11px] text-slate-400">سليم</span>
            </div>
          </div>
        </div>

        {/* Executive Quick Tasks & Bulletins - Right side */}
        <div className="bg-[#121422] p-8 rounded-2xl border border-slate-800/80 lg:col-span-7 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-200 text-right mb-4">التوجيهات التنفيذية المقترحة</h3>
            <div className="space-y-4">
              
              <div className="flex gap-3 items-start bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl text-right">
                <div className="p-1.5 bg-rose-500 rounded-full mt-1 flex-shrink-0 animate-ping h-2.5 w-2.5"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-rose-400">تدخل فوري مطلوب - مجمع الإسكندرية (مصر)</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    نسبة الإنجاز متوقفة عند 25٪ بسبب تباطؤ المقاول في صب أساسات المرحلة الثانية. يجب استدعاء الاستشاري الهندسي العام لمراجعة وتدقيق الجدول الزمني للإنقاذ.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-amber-950/10 border border-amber-900/20 p-4 rounded-xl text-right">
                <div className="p-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0 h-2 w-2"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-amber-400">تنبيه الموازنة - استثمار التقنيات الناشئة</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    تم صرف 42٪ من موازنة الصندوق الاستثماري. يوصى بمراجعة جولة التمويل الحالية للشركات الناشئة في الرياض وجدة مع نائب الرئيس لشؤون الاستثمار وتفادي مخاطر التدفقات.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl text-right">
                <div className="p-1.5 bg-emerald-500 rounded-full mt-1 flex-shrink-0 h-2 w-2"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-emerald-400">مؤشرات إيجابية - أكاديمية أراك الرقمية</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    نسبة الإنجاز فاقت 90٪ والمنصة جاهزة للإطلاق التجريبي وتأهيل الدفعة الأولى من شباب المجموعة البالغ عددهم 120 متدرباً.
                  </p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="flex gap-3 mt-6 justify-end">
            <button 
              onClick={() => onNavigate('ai_advisor')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-amber-600/10"
            >
              استشارة المستشار الذكي AI
            </button>
            <button 
              onClick={() => onNavigate('reports')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              عرض التحليلات المتقدمة
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
