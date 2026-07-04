import React, { useState } from 'react';
import { 
  FolderClosed, 
  Plus, 
  Phone, 
  FileText, 
  Bookmark, 
  Check, 
  Clock, 
  Trash2, 
  UserPlus, 
  X,
  MessageSquare
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface SecretariatViewProps {
  theme: PlatformTheme;
}

interface SecretariatItem {
  id: string;
  type: 'agenda' | 'call' | 'memo';
  title: string;
  date: string;
  time: string;
  targetPerson: string;
  details: string;
  status: 'معلق' | 'مكتمل' | 'مؤجل';
}

export default function SecretariatView({ theme }: SecretariatViewProps) {
  const [items, setItems] = useState<SecretariatItem[]>([
    {
      id: 's-1',
      type: 'agenda',
      title: 'مراجعة البنود التحضيرية لاجتماع مجلس الإدارة السنوي',
      date: '2026-06-16',
      time: '10:00',
      targetPerson: 'أعضاء المجلس التنفيذي',
      details: 'التأكد من اكتمال تقارير ميزانية الربع الثاني وصافي الأرباح لقطاع الحديد واللوجستيات.',
      status: 'معلق'
    },
    {
      id: 's-2',
      type: 'call',
      title: 'مكالمة واردة من مكتب سعادة وزير التنمية والمستثمرين',
      date: '2026-06-16',
      time: '14:30',
      targetPerson: 'مكتب معالي الوزير',
      details: 'مناقشة سبل تسهيل إجراءات التراخيص لقطاع أراك لوجستيك لتحديث خطوط الملاحة.',
      status: 'معلق'
    },
    {
      id: 's-3',
      type: 'memo',
      title: 'مذكرة مرسلة من مدير فرع مصر بشأن عقود الإسكندرية والمنازعات المعلقة',
      date: '2026-06-15',
      time: '11:00',
      targetPerson: 'مستشار قانوني مصر',
      details: 'تفاصيل التسوية القانونية المقترحة مع مقاولي البنية التحتية.',
      status: 'معلق'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'الكل' | 'agenda' | 'call' | 'memo'>('الكل');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [newType, setNewType] = useState<'agenda' | 'call' | 'memo'>('agenda');
  const [newTitle, setNewTitle] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newTime, setNewTime] = useState('12:00');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: SecretariatItem = {
      id: `s-${Date.now()}`,
      type: newType,
      title: newTitle,
      date: new Date().toISOString().split('T')[0],
      time: newTime,
      targetPerson: newPerson || 'نائب رئيس مجلس الإدارة',
      details: newDetails,
      status: 'معلق'
    };

    setItems([newItem, ...items]);
    setShowModal(false);
    setNewTitle('');
    setNewDetails('');
    setNewPerson('');
  };

  const handleStatusChange = (id: string, nextStatus: SecretariatItem['status']) => {
    setItems(items.map(it => it.id === id ? { ...it, status: nextStatus } : it));
  };

  const filtered = items.filter(it => {
    if (activeTab === 'الكل') return true;
    return it.type === activeTab;
  });

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
      
      {/* Header exactly like Page 6 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            مكتب الإدارة العليا
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            السكرتارية التنفيذية ومتابعة المكتب
          </h2>
          <span className="text-xs text-slate-400">
            جدول أعمال سعادة الرئيس د. علي، المكالمات الهاتفية التنفيذية، المذكرات والملاحظات السريعة
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>مذكرة / مكالمة جديدة</span>
        </button>
      </div>

      {/* Grid counters exactly like Page 6 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">إجمالي التكليفات</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">{items.length}</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">جدول الأعمال النشط</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {items.filter(i => i.type === 'agenda').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">اللقاءات والاتصالات</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {items.filter(i => i.type === 'call').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">المذكرات الواردة</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {items.filter(i => i.type === 'memo').length}
          </span>
        </div>
      </div>

      {/* Filters section */}
      <div className="flex justify-end gap-2 bg-[#121422] p-2 rounded-xl border border-slate-800/80 w-fit mr-auto">
        <button
          onClick={() => setActiveTab('الكل')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'الكل' ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'agenda' ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          جدول الأعمال
        </button>
        <button
          onClick={() => setActiveTab('call')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'call' ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          الاتصالات
        </button>
        <button
          onClick={() => setActiveTab('memo')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'memo' ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          المذكرات
        </button>
      </div>

      {/* List items with elegant cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isAgenda = item.type === 'agenda';
          const isCall = item.type === 'call';
          const isMemo = item.type === 'memo';
          
          return (
            <div 
              key={item.id}
              className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700/80 transition-all duration-300 shadow-lg text-right overflow-hidden"
            >
              {/* Vertical side color bar */}
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                isAgenda ? 'bg-amber-500' : isCall ? 'bg-blue-500' : 'bg-violet-500'
              }`}></div>

              {/* Actions panel on the left */}
              <div className="flex gap-2 w-full md:w-auto justify-end order-2 md:order-1">
                {item.status === 'معلق' ? (
                  <>
                    <button 
                      onClick={() => handleStatusChange(item.id, 'مكتمل')}
                      className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-3 py-1.5 rounded-lg hover:bg-emerald-900/30 cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <Check className="w-3 h-3" />
                      <span>اكتمال</span>
                    </button>
                    <button 
                      onClick={() => handleStatusChange(item.id, 'مؤجل')}
                      className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/30 px-3 py-1.5 rounded-lg hover:bg-amber-900/30 cursor-pointer"
                    >
                      <span>تأجيل</span>
                    </button>
                  </>
                ) : (
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    item.status === 'مكتمل' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                )}
              </div>

              {/* Middle contents */}
              <div className="space-y-2 flex-1 pr-4 order-1 md:order-2">
                <div className="flex items-center gap-3 justify-start">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    isAgenda ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 
                    isCall ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' : 
                    'bg-violet-950/40 text-violet-400 border border-violet-900/30'
                  }`}>
                    {isAgenda ? 'جدول أعمال' : isCall ? 'مكالمة هاتفية' : 'مذكرة واردة'}
                  </span>

                  <span className="text-[11px] text-slate-500 font-sans">
                    {item.date} ، {item.time}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{item.details}</p>

                <div className="text-[11px] text-slate-500">
                  <span>المعني / الموجه إليه: </span>
                  <strong className="text-slate-300 font-semibold">{item.targetPerson}</strong>
                </div>
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
                <FolderClosed className="w-4 h-4 text-amber-500" />
                <span>برمجة مذكرات ومكالمات السكرتارية</span>
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
                <label className="text-xs font-bold text-slate-300 block">نوع البند</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="agenda">جدول الأعمال التنفيذي</option>
                  <option value="call">مكالمة هاتفية واردة/صادرة</option>
                  <option value="memo">مذكرة إدارية عامة</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">العنوان أو الموضوع الرئيسي</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مراجعة تراخيص المقر الرئيسي" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">الشخص المعني</label>
                  <input 
                    type="text" 
                    placeholder="مثال: نائب الرئيس - الاستثمار" 
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">التوقيت</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">التفاصيل والملخص الموضوعي</label>
                <textarea 
                  rows={3}
                  placeholder="اكتب تفاصيل إضافية لمساعدة الرئيس التنفيذي على المتابعة الفورية السريعة..." 
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
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
                  حفظ في نظام السكرتارية
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
