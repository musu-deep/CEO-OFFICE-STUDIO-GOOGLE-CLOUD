import React, { useState } from 'react';
import { Mail, Plus, Inbox, Send, EyeOff, Clipboard, Play, RefreshCw, X, MessageSquare, ArrowLeftRight } from 'lucide-react';
import { Commission, PlatformTheme } from '../types';
import { initialCommissions } from '../data/mockData';

interface MessagesViewProps {
  theme: PlatformTheme;
  onAddTask: (taskTitle: string, sector: string, priority: 'حرج' | 'هام' | 'عادي') => void;
}

export default function MessagesView({ theme, onAddTask }: MessagesViewProps) {
  const [commissions, setCommissions] = useState<Commission[]>(initialCommissions);
  const [filter, setFilter] = useState<'الكل' | 'الوارد' | 'الصادر' | 'غير مقروء'>('الكل');
  const [showModal, setShowModal] = useState(false);
  
  // New directive form
  const [newTitle, setNewTitle] = useState('');
  const [newReceiver, setNewReceiver] = useState('نائب الرئيس - التنمية');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'مهم' | 'حرج' | 'عادي'>('عادي');

  const filtered = commissions.filter((c) => {
    if (filter === 'الكل') return true;
    if (filter === 'الوارد') return c.status === 'وارد' || c.status === 'غير مقروء';
    if (filter === 'الصادر') return c.status === 'صادر';
    if (filter === 'غير مقروء') return c.status === 'غير مقروء';
    return true;
  });

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newDirective: Commission = {
      id: `c-${Date.now()}`,
      title: newTitle,
      sender: 'د. علي العتيبي',
      receiver: newReceiver,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      priority: newPriority,
      content: newContent,
      status: 'صادر'
    };

    setCommissions([newDirective, ...commissions]);
    setShowModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const convertToTask = (comm: Commission) => {
    onAddTask(
      `تكليف مستخلص: ${comm.title}. التفاصيل: ${comm.content}`,
      comm.receiver.includes('التنمية') ? 'أراك التنمية' : 'الاستثمار',
      comm.priority === 'حرج' ? 'حرج' : comm.priority === 'مهم' ? 'هام' : 'عادي'
    );
    alert('✓ تم استخلاص البيانات بنجاح وتحويل التوجيه إلى مهمة رسمية قيد المتابعة!');
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
      
      {/* Header exactly like Page 4 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-sans">
            EXECUTIVE WORKFLOW CENTER
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            مركز التكليفات والمتابعة
          </h2>
          <span className="text-xs text-slate-400">
            إدارة الطلبات، التكليفات الإدارية، الاعتمادات، والمراسلات التنفيذية والمتابعات الحية
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>تكليف جديد</span>
        </button>
      </div>

      {/* Grid count exactly like Page 4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Items */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold">إجمالي العناصر</span>
            <MessageSquare className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-3xl font-extrabold text-slate-100 font-sans block">6</span>
          <span className="text-[10px] text-slate-500 block mt-1">تكليفات وتوجيهات نشطة</span>
        </div>

        {/* Incoming */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold">الوارد التنفيذي</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-100 font-sans block">2</span>
          <span className="text-[10px] text-slate-500 block mt-1">توجيهات مستلمة للمكتب</span>
        </div>

        {/* Unread */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold">غير مقروء</span>
            <EyeOff className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-extrabold text-rose-500 font-sans block">1</span>
          <span className="text-[10px] text-rose-500 block mt-1">توجيه عاجل يتطلب اطلاعكم</span>
        </div>

        {/* Outgoing */}
        <div className="bg-[#121422] p-6 rounded-2xl border border-slate-800/80 text-right relative group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold">الصادر</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-500 font-sans block">4</span>
          <span className="text-[10px] text-slate-500 block mt-1">أوامر معتمدة وموجهة</span>
        </div>

      </div>

      {/* Filter Tabs matching screenshots */}
      <div className="flex justify-end gap-2 bg-[#121422] p-2 rounded-xl border border-slate-800/80 w-fit mr-auto">
        {(['الكل', 'الوارد', 'الصادر', 'غير مقروء'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filter === tab ? 'bg-amber-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Directive / Message Cards matching Page 4 exactly */}
      <div className="space-y-4">
        {filtered.map((comm) => {
          const isOutgoing = comm.status === 'صادر';
          const isUrgent = comm.priority === 'حرج';
          
          return (
            <div 
              key={comm.id}
              className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl relative flex flex-col justify-between gap-4 text-right shadow-lg group hover:border-slate-700/80 transition-colors"
            >
              {/* Corner badge indicating incoming/outgoing */}
              <span className={`absolute top-4 left-4 text-[9px] font-sans font-bold px-2 py-0.5 rounded ${
                isOutgoing ? 'bg-emerald-950/40 text-emerald-400' : 'bg-blue-950/40 text-blue-400'
              }`}>
                {isOutgoing ? 'صادر' : 'وارد'}
              </span>

              {/* Title & info exactly like Page 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 justify-start flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isUrgent ? 'bg-rose-950/40 text-rose-400' : 'bg-amber-950/40 text-amber-400'
                  }`}>
                    الأولوية: {comm.priority}
                  </span>
                  
                  <span className="text-[11px] text-slate-500 font-sans">
                    {comm.date} ، {comm.time} م
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100">{comm.title}</h3>
                
                <div className="text-xs text-slate-400 font-sans">
                  <span>إلى: <strong className="text-slate-300">{comm.receiver}</strong></span>
                  <span className="mx-2">•</span>
                  <span>من: <strong className="text-slate-300">{comm.sender}</strong></span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-900 mt-2 max-w-4xl">
                  {comm.content}
                </p>
              </div>

              {/* Action buttons exactly matching screenshots Page 4 */}
              <div className="flex justify-end gap-2 border-t border-slate-800/40 pt-4 mt-2">
                <button 
                  onClick={() => convertToTask(comm)}
                  className="text-[11px] bg-amber-600/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-xl hover:bg-amber-600/25 transition-colors cursor-pointer flex items-center gap-1 font-bold"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>تحويل إلى مهمة</span>
                </button>

                <button 
                  onClick={() => alert('تم إصدار تذكير ومتابعة عاجلة للمسؤول.')}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <span>طلب متابعة</span>
                </button>

                <button 
                  onClick={() => alert('تم إلحاق التكليف في مذكرات جدول أعمال الاجتماع القادم.')}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <span>إضافة لاجتماع</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* New Directive Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>إصدار أمر / توجيه تنفيذي رسمي</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">عنوان التوجيه</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: عاجل: مراجعة تراخيص بنك أراك مع البنك المركزي" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">المسؤول المستهدف</label>
                  <select 
                    value={newReceiver}
                    onChange={(e) => setNewReceiver(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="نائب الرئيس - الاستثمار">نائب الرئيس - الاستثمار</option>
                    <option value="نائب الرئيس - التنمية">نائب الرئيس - التنمية</option>
                    <option value="مدير أراك التنمية - مصر">مدير أراك التنمية - مصر</option>
                    <option value="المستشار القانوني العام">المستشار القانوني العام</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">الأولوية</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="حرج">حرج</option>
                    <option value="مهم">مهم</option>
                    <option value="عادي">عادي</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">محتوى ونص التوجيه الرسمي</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="اكتب التوجيه والأوامر التنفيذية بدقة..." 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none"
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
                  إرسال وإصدار التكليف
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
