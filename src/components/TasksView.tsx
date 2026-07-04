import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeftRight, 
  Check, 
  AlertCircle,
  X
} from 'lucide-react';
import { Task, PlatformTheme } from '../types';

interface TasksViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  theme: PlatformTheme;
}

export default function TasksView({ tasks, setTasks, theme }: TasksViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSector, setNewSector] = useState('الاستثمار');
  const [newPriority, setNewPriority] = useState<'حرج' | 'هام' | 'عادي'>('عادي');
  const [newAssignee, setNewAssignee] = useState('نائب الرئيس - التنمية');

  // Status lists
  const statuses: Task['status'][] = ['قيد المتابعة', 'قيد التنفيذ', 'بانتظار الاعتماد', 'مكتمل'];

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'قيد المتابعة': return 'border-amber-500/30 text-amber-400 bg-amber-950/20';
      case 'قيد التنفيذ': return 'border-blue-500/30 text-blue-400 bg-blue-950/20';
      case 'بانتظار الاعتماد': return 'border-violet-500/30 text-violet-400 bg-violet-950/20';
      case 'مكتمل': return 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'قيد المتابعة': return 'قيد المتابعة / الانتظار';
      case 'قيد التنفيذ': return 'قيد التنفيذ المباشر';
      case 'بانتظار الاعتماد': return 'بانتظار اعتماد الـ CEO';
      case 'مكتمل': return 'تم إنجازها بنجاح';
    }
  };

  const transitionTask = (taskId: string, nextStatus: Task['status']) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTitle,
      dueDate: new Date().toISOString().split('T')[0],
      sector: newSector,
      priority: newPriority,
      status: 'قيد المتابعة',
      assignee: newAssignee
    };

    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setNewTitle('');
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
      
      {/* Header exactly like Page 16 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            إدارة المهام والتكليفات
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            لوحة المتابعة اليومية
          </h2>
          <span className="text-xs text-slate-400">
            34 مهمة كلية • 5 حالات تدقيق مفعلة لمستشاري المكتب
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>مهمة جديدة</span>
        </button>
      </div>

      {/* Kanban / Status List Board representation */}
      <div className="space-y-6">
        {statuses.map((status) => {
          const statusTasks = tasks.filter(t => t.status === status);
          
          return (
            <div key={status} className="bg-[#121422] rounded-2xl border border-slate-800/80 p-5 shadow-lg space-y-4">
              
              {/* Status Header matching Page 16 column format */}
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-sans ${getStatusColor(status)}`}>
                  {statusTasks.length}
                </span>
                
                <h3 className="text-sm font-extrabold text-slate-200">
                  {getStatusLabel(status)}
                </h3>
              </div>

              {/* Tasks List in status */}
              {statusTasks.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                  لا توجد مهام تحت هذه الحالة حالياً
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statusTasks.map((t) => {
                    const isUrgent = t.priority === 'حرج';
                    
                    return (
                      <div 
                        key={t.id} 
                        className="bg-[#16182c] border border-slate-800/80 p-5 rounded-xl hover:border-slate-700 transition-colors flex flex-col justify-between gap-4 relative"
                      >
                        {/* Red alarm dot exactly matching Page 16 top right */}
                        {isUrgent && (
                          <span className="absolute top-4 left-4 h-2.5 w-2.5 rounded-full bg-rose-500 block"></span>
                        )}

                        <div className="space-y-2">
                          {/* Sector Badge */}
                          <div className="flex items-center gap-2 justify-start">
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                              {t.sector}
                            </span>
                            
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isUrgent ? 'text-rose-400 bg-rose-950/20' : 'text-slate-400 bg-slate-800'}`}>
                              {t.priority}
                            </span>
                          </div>

                          {/* Task title */}
                          <p className="text-xs text-slate-200 font-extrabold leading-relaxed pr-2">
                            {t.title}
                          </p>
                        </div>

                        {/* Task metadata */}
                        <div className="flex justify-between items-center border-t border-slate-800/60 pt-3 text-[10px] text-slate-500 font-sans mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            <span>استحقاق: {t.dueDate}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-600" />
                            <span className="truncate max-w-[120px]">{t.assignee}</span>
                          </div>
                        </div>

                        {/* Action buttons exactly matching Page 16 transition buttons */}
                        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800/20">
                          {status === 'قيد المتابعة' && (
                            <>
                              <button 
                                onClick={() => transitionTask(t.id, 'قيد التنفيذ')}
                                className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-900/30 px-3 py-1 rounded-md hover:bg-blue-900/40 cursor-pointer"
                              >
                                → قيد التنفيذ
                              </button>
                              <button 
                                onClick={() => transitionTask(t.id, 'بانتظار الاعتماد')}
                                className="text-[10px] bg-violet-950/40 text-violet-400 border border-violet-900/30 px-3 py-1 rounded-md hover:bg-violet-900/40 cursor-pointer"
                              >
                                → بانتظار الاعتماد
                              </button>
                            </>
                          )}
                          
                          {status === 'قيد التنفيذ' && (
                            <>
                              <button 
                                onClick={() => transitionTask(t.id, 'قيد المتابعة')}
                                className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/30 px-3 py-1 rounded-md hover:bg-amber-900/40 cursor-pointer"
                              >
                                ← قيد الانتظار
                              </button>
                              <button 
                                onClick={() => transitionTask(t.id, 'بانتظار الاعتماد')}
                                className="text-[10px] bg-violet-950/40 text-violet-400 border border-violet-900/30 px-3 py-1 rounded-md hover:bg-violet-900/40 cursor-pointer"
                              >
                                → بانتظار الاعتماد
                              </button>
                            </>
                          )}

                          {status === 'بانتظار الاعتماد' && (
                            <>
                              <button 
                                onClick={() => transitionTask(t.id, 'مكتمل')}
                                className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-3 py-1 rounded-md hover:bg-emerald-900/40 cursor-pointer font-bold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>اعتماد وإغلاق المهمة</span>
                              </button>
                              <button 
                                onClick={() => transitionTask(t.id, 'قيد التنفيذ')}
                                className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-900/30 px-3 py-1 rounded-md hover:bg-blue-900/40 cursor-pointer"
                              >
                                ← إعادة للتنفيذ
                              </button>
                            </>
                          )}

                          {status === 'مكتمل' && (
                            <span className="text-[9px] text-emerald-500 font-bold bg-emerald-950/10 px-2 py-0.5 rounded border border-emerald-900/20">
                              ✓ مهمة مغلقة ومؤرشفة
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* New Task Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>إسناد تكليف تنفيذي عاجل</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">عنوان التكليف</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="مثال: مراجعة العقود التجارية لفرع الإسكندرية وإيداع الضمان البنكي" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">القطاع المستهدف</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: أراك التنمية، الاستثمار، لوجستيك" 
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">درجة الأولوية</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="حرج">حرج</option>
                    <option value="هام">هام</option>
                    <option value="عادي">عادي</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">الشخص المكلف</label>
                  <select 
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="نائب الرئيس - التنمية">نائب الرئيس - التنمية</option>
                    <option value="نائب الرئيس - الاستثمار">نائب الرئيس - الاستثمار</option>
                    <option value="مدير أراك التنمية - مصر">مدير أراك التنمية - مصر</option>
                    <option value="المستشار القانوني العام">المستشار القانوني العام</option>
                  </select>
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
                  إصدار التكليف
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
