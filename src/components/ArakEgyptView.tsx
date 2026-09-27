import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  ArrowUpRight, 
  Coins, 
  X,
  Clock
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface ArakTrainingViewProps {
  theme: PlatformTheme;
}

interface TrainingProgram {
  id: string;
  name: string;
  location: string;
  budget: string;
  spent: string;
  progress: number;
  teamCount: number;
  status: 'قيد التنفيذ' | 'قيد المراجعة' | 'مكتمل';
  issuesCount: number;
}

export default function ArakTrainingView({ theme }: ArakTrainingViewProps) {
  const [projects, setProjects] = useState<TrainingProgram[]>([
    {
      id: 'eg-p1',
      name: 'برنامج تطوير الحقائب التدريبية المؤسسية',
      location: 'تنفيذ رقمي وعن بُعد',
      budget: 'حسب نطاق الخدمة',
      spent: 'حسب نطاق الخدمة',
      progress: 78,
      teamCount: 42,
      status: 'قيد التنفيذ',
      issuesCount: 1
    },
    {
      id: 'eg-p2',
      name: 'خدمة كتابة وإعداد المحتوى التدريبي',
      location: 'تنفيذ رقمي وعن بُعد',
      budget: 'حسب نطاق الخدمة',
      spent: 'حسب نطاق الخدمة',
      progress: 85,
      teamCount: 18,
      status: 'قيد التنفيذ',
      issuesCount: 0
    },
    {
      id: 'eg-p3',
      name: 'برنامج تصميم الأدلة والمدربين ومواد التعلم',
      location: 'تنفيذ رقمي وعن بُعد',
      budget: 'حسب نطاق الخدمة',
      spent: 'حسب نطاق الخدمة',
      progress: 65,
      teamCount: 9,
      status: 'قيد المراجعة',
      issuesCount: 0
    }
  ]);

  const [showModal, setShowModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('تنفيذ رقمي وعن بُعد');
  const [newBudget, setNewBudget] = useState('حسب نطاق الخدمة');
  const [newProgress, setNewProgress] = useState(10);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newProj: TrainingProgram = {
      id: `eg-p-${Date.now()}`,
      name: newName,
      location: newLocation,
      budget: newBudget,
      spent: '0 جنيه',
      progress: newProgress,
      teamCount: 5,
      status: 'قيد التنفيذ',
      issuesCount: 0
    };

    setProjects([...projects, newProj]);
    setShowModal(false);
    setNewName('');
  };

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
      
      {/* Header exactly like Page 12 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            أراك التنمية
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            برامج أراك التنمية للتدريب والمحتوى
          </h2>
          <span className="text-xs text-slate-400">
            إدارة برامج التدريب وخدمات كتابة وإعداد وتطوير المحتوى والحقائب التدريبية
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة برنامج تدريبي</span>
        </button>
      </div>

      {/* Grid counters exactly like Page 12 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">البرامج والخدمات النشطة</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">{projects.length}</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">الحقائب قيد التطوير</span>
          <span className="text-3xl font-extrabold text-amber-500 font-sans">12</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">متوسط إنجاز البرامج</span>
          <span className="text-3xl font-extrabold text-emerald-500 font-sans">78.5%</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">مراجعات جودة مفتوحة</span>
          <span className="text-3xl font-extrabold text-rose-500 font-sans">1</span>
        </div>
      </div>

      {/* Specific Conflict highlight card */}
      <div className="bg-[#121422] rounded-2xl border border-rose-500/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-rose-500"></div>
        <div className="space-y-1.5 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-900/40">
              مراجعة جودة
            </span>
            <span className="text-xs text-slate-500 font-sans">آخر تحديث: منذ يومين</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-100">مستجدات تطوير المحتوى التدريبي</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            تخضع الحقيبة التدريبية لمراجعة المحتوى والأهداف والأنشطة وأدوات القياس قبل اعتماد النسخة النهائية وتسليمها للجهة المستفيدة.
          </p>
        </div>
        <button 
          onClick={() => alert('تم تكليف فريق الجودة بمراجعة النسخة التدريبية ورفع توصيات الاعتماد.')}
          className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/30 text-xs font-bold rounded-xl cursor-pointer transition-colors whitespace-nowrap"
        >
          تكليف مراجعة الجودة
        </button>
      </div>

      {/* Training Projects Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => {
          const isWarning = p.issuesCount > 0;
          return (
            <div 
              key={p.id}
              className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/80 transition-all duration-300 relative shadow-xl text-right flex flex-col justify-between min-h-[280px]"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'قيد التنفيذ' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                  }`}>
                    {p.status}
                  </span>

                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{p.location}</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100 leading-relaxed">{p.name}</h3>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>نسبة الإنجاز</span>
                    <span className="font-sans font-bold">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>

                {/* Budget Details */}
                <div className="grid grid-cols-2 gap-2 bg-[#16182c]/40 p-3 rounded-xl border border-slate-800/60 text-right">
                  <div>
                    <span className="text-[9px] text-slate-500 block">الميزانية الكلية</span>
                    <span className="text-[11px] font-black text-slate-300 font-sans">{p.budget}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">المنصرف المالي</span>
                    <span className="text-[11px] font-black text-slate-300 font-sans">{p.spent}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/60 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{p.teamCount} عضو بفريق المحتوى</span>
                </div>

                {isWarning && (
                  <span className="text-rose-400 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                    <span>توجد مشكلة معلقة</span>
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Insert Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>إضافة برنامج تدريب أو محتوى</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">اسم البرنامج أو خدمة المحتوى</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: حقيبة القيادة التنفيذية" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">نمط التنفيذ</label>
                  <input 
                    type="text" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">نطاق الخدمة</label>
                  <input 
                    type="text" 
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">نسبة الإنجاز الأولية (%)</label>
                <input 
                  type="number" 
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors text-slate-300"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${getThemeBtnClass()}`}
                >
                  إضافة إلى برامج التدريب
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
