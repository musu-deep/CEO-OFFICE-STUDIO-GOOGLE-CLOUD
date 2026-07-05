import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  X, 
  FolderClosed, 
  DollarSign, 
  User, 
  CheckCircle, 
  Percent 
} from 'lucide-react';
import { Project, PlatformTheme } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  theme: PlatformTheme;
}

export default function ProjectsView({ projects, setProjects, theme }: ProjectsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('الكل');
  const [showModal, setShowModal] = useState(false);
  
  // New project state form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSector, setNewSector] = useState('الاستثمار');
  const [newBudget, setNewBudget] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newPriority, setNewPriority] = useState<'عالية' | 'متوسطة' | 'منخفضة' | 'حرج'>('عالية');

  const sectors = ['الكل', 'الاستثمار', 'قطاع التنمية', 'أراك لوجستيك', 'الحديد والصناعة', 'أراك التنمية (مصر)'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'الكل' || p.sector.includes(selectedSector);
    return matchesSearch && matchesSector;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newProj: Project = {
      id: `p-${Date.now()}`,
      name: newName,
      description: newDesc,
      sector: newSector,
      progress: 0,
      priority: newPriority,
      status: 'نشط',
      budget: Number(newBudget) || 1000000,
      manager: newManager || 'نائب الرئيس'
    };

    setProjects([newProj, ...projects]);
    setShowModal(false);
    
    // Reset form
    setNewName('');
    setNewDesc('');
    setNewBudget('');
    setNewManager('');
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

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header matching Page 9 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            إدارة المشاريع
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            مشاريع المجموعة
          </h2>
          <span className="text-xs text-slate-400">
            {filteredProjects.length} مشروع • مفلتر حسب صلاحياتك المعتمدة
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>مشروع جديد</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#121422] p-5 rounded-xl border border-slate-800/80">
        
        {/* Search Input */}
        <div className="relative md:col-span-8">
          <input 
            type="text" 
            placeholder="ابحث عن مشروع بالاسم أو الوصف..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 pr-10 pl-4 text-xs text-slate-200 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
        </div>

        {/* Sector Selector */}
        <div className="relative md:col-span-4">
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-4 text-xs text-slate-400 focus:outline-none transition-colors appearance-none"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>{sec === 'الكل' ? 'كل القطاعات' : sec}</option>
            ))}
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 absolute top-3.5 left-3.5 pointer-events-none" />
        </div>

      </div>

      {/* Projects Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const isCritical = p.priority === 'حرج';
          
          return (
            <div 
              key={p.id}
              className="bg-[#121422] rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 relative shadow-lg group overflow-hidden"
            >
              {/* Highlight bar */}
              <div className={`absolute top-0 right-0 left-0 h-1.5 ${isCritical ? 'bg-rose-600' : 'bg-amber-500'}`}></div>

              <div>
                {/* Sector and priority badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] bg-slate-800/80 text-slate-300 font-bold px-2 py-0.5 rounded-md">
                    {p.sector}
                  </span>
                  
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isCritical ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'}`}>
                    {isCritical ? 'حرج' : 'تنبيه'}
                  </span>
                </div>

                {/* Title and Description */}
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-100 group-hover:text-amber-400/90 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[48px] line-clamp-3">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Progress and details footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-4">
                
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">نسبة الإنجاز</span>
                    <span className="font-sans font-bold text-slate-200">{p.progress}%</span>
                  </div>
                  <div className="bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-l ${isCritical ? 'from-rose-500 to-rose-400' : 'from-amber-500 to-orange-400'}`} 
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Budget and Manager Info */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-sans">
                  <div className="flex items-center gap-1.5 justify-end">
                    <DollarSign className="w-3 h-3 text-slate-600" />
                    <span className="font-sans font-bold">{p.budget.toLocaleString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <User className="w-3 h-3 text-slate-600" />
                    <span className="truncate">{p.manager}</span>
                  </div>
                </div>

                {/* State Controls */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-bold">
                    أولوية: {p.priority}
                  </span>
                  
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30 font-bold">
                    {p.status}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* New Project Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FolderClosed className="w-4 h-4 text-amber-500" />
                <span>إضافة مشروع استراتيجي جديد</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">اسم المشروع</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: خطة التنمية الاستراتيجية 2030" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">تفاصيل المشروع / الوصف</label>
                <textarea 
                  rows={3}
                  placeholder="اكتب نبذة مختصرة عن أهداف ونطاق المشروع..." 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">القطاع</label>
                  <select 
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="الاستثمار">الاستثمار</option>
                    <option value="التنمية العامة">التنمية العامة</option>
                    <option value="أراك لوجستيك">أراك لوجستيك</option>
                    <option value="الحديد والصناعة">الحديد والصناعة</option>
                    <option value="أراك التنمية (مصر)">أراك التنمية (مصر)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">أولوية المشروع</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="حرج">حرج</option>
                    <option value="عالية">عالية</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="منخفضة">منخفضة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">الميزانية التقديرية (درهم / جنيه)</label>
                  <input 
                    type="number" 
                    placeholder="مثال: 50000000" 
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">المدير المسؤول</label>
                  <input 
                    type="text" 
                    placeholder="مثال: نائب الرئيس - الاستثمار" 
                    value={newManager}
                    onChange={(e) => setNewManager(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
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
                  حفظ المشروع
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
