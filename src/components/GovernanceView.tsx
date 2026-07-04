import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Clock, 
  FileText, 
  Info 
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface GovernanceViewProps {
  theme: PlatformTheme;
}

interface GovernanceReport {
  id: string;
  title: string;
  category: 'مالية' | 'إدارية' | 'قانونية' | 'فنية';
  date: string;
  complianceLevel: 'عالي' | 'متوسط' | 'منخفض';
  description: string;
  status: 'نشط' | 'معلق' | 'قيد المراجعة' | 'مكتمل';
  inspector: string;
}

export default function GovernanceView({ theme }: GovernanceViewProps) {
  const [reports, setReports] = useState<GovernanceReport[]>([
    {
      id: 'gov-1',
      title: 'تقرير مطابقة مصنع الحديد والصلب لمعايير الأمن والسلامة',
      category: 'فنية',
      date: '2026-06-14',
      complianceLevel: 'عالي',
      description: 'تمت مراجعة خط الإنتاج وصهاريج الصهر ومطابقتها للمقاييس المعتمدة من الهيئة الاتحادية بنسبة امتثال 94%.',
      status: 'مكتمل',
      inspector: 'المهندس أحمد شكري'
    },
    {
      id: 'gov-2',
      title: 'مراجعة عقود الشحن والملاحة - فرع أراك لوجستيك بجدة',
      category: 'قانونية',
      date: '2026-06-15',
      complianceLevel: 'متوسط',
      description: 'هناك تأخير طفيف في توقيع الملاحق الإضافية للشحنات البحرية الصادرة لليونان ويحتاج لمتابعة.',
      status: 'قيد المراجعة',
      inspector: 'المستشار القانوني العام'
    },
    {
      id: 'gov-3',
      title: 'تدقيق المصروفات والتدفقات النقدية لمشروعات التنمية بمصر',
      category: 'مالية',
      date: '2026-06-16',
      complianceLevel: 'منخفض',
      description: 'ملاحظة تباين بقيمة 120,000 جنيه في فواتير مقاولي الباطن بمشروع الإسكندرية قيد التحقق والاستقصاء.',
      status: 'نشط',
      inspector: 'المدقق المالي الرئيسي'
    }
  ]);

  const [filter, setFilter] = useState<'الكل' | 'مالية' | 'إدارية' | 'قانونية' | 'فنية'>('الكل');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'مالية' | 'إدارية' | 'قانونية' | 'فنية'>('مالية');
  const [newLevel, setNewLevel] = useState<'عالي' | 'متوسط' | 'منخفض'>('عالي');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newReport: GovernanceReport = {
      id: `gov-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      complianceLevel: newLevel,
      description: newDesc,
      status: 'نشط',
      inspector: 'د. علي العتيبي (الرئيس التنفيذي)'
    };

    setReports([newReport, ...reports]);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const updateStatus = (id: string, nextStatus: GovernanceReport['status']) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: nextStatus } : r));
  };

  const filtered = reports.filter(r => {
    if (filter === 'الكل') return true;
    return r.category === filter;
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

  const getComplianceColor = (lvl: GovernanceReport['complianceLevel']) => {
    switch (lvl) {
      case 'عالي': return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
      case 'متوسط': return 'text-amber-400 bg-amber-950/20 border-amber-900/40';
      case 'منخفض': return 'text-rose-400 bg-rose-950/20 border-rose-900/40';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            الامتثال والحوكمة
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            الرقابة والتفتيش والامتثال
          </h2>
          <span className="text-xs text-slate-400">
            متابعة دقيقة لمؤشرات المطابقة والامتثال القانوني والمالي والفني لمختلف أفرع المجموعة
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>بلاغ تدقيق جديد</span>
        </button>
      </div>

      {/* Grid counters exactly like Page 5 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">إجمالي تقارير التدقيق</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">{reports.length}</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">بلاغات نشطة عاجلة</span>
          <span className="text-3xl font-extrabold text-rose-500 font-sans">
            {reports.filter(r => r.status === 'نشط').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">قيد المراجعة والمطابقة</span>
          <span className="text-3xl font-extrabold text-amber-500 font-sans">
            {reports.filter(r => r.status === 'قيد المراجعة').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">تقارير معتمدة ومطابقة</span>
          <span className="text-3xl font-extrabold text-emerald-500 font-sans">
            {reports.filter(r => r.status === 'مكتمل').length}
          </span>
        </div>
      </div>

      {/* Filters section */}
      <div className="flex justify-end gap-2 bg-[#121422] p-2 rounded-xl border border-slate-800/80 w-fit mr-auto">
        {(['الكل', 'مالية', 'إدارية', 'قانونية', 'فنية'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filter === tab ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {tab === 'الكل' ? 'الكل' : `${tab}`}
          </button>
        ))}
      </div>

      {/* Audit list cards */}
      <div className="space-y-4">
        {filtered.map((r) => {
          const isDanger = r.complianceLevel === 'منخفض';
          return (
            <div 
              key={r.id}
              className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700/80 transition-all duration-300 shadow-lg text-right overflow-hidden"
            >
              {/* Left alert banner for critical compliance warnings */}
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                isDanger ? 'bg-rose-500 animate-pulse' : r.complianceLevel === 'متوسط' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></div>

              {/* Action buttons on left */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end order-2 md:order-1">
                {r.status !== 'مكتمل' ? (
                  <>
                    <button 
                      onClick={() => {
                        updateStatus(r.id, 'مكتمل');
                        alert('✓ تم تسجيل الامتثال التام وإغلاق ملف التدقيق بنجاح!');
                      }}
                      className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-3 py-1.5 rounded-lg hover:bg-emerald-900/30 cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <span>تأكيد الامتثال</span>
                    </button>
                    <button 
                      onClick={() => alert('تم إرسال إنذار رسمي عاجل ومسجل عبر البريد للفرع المعني.')}
                      className="text-[10px] bg-rose-950/40 text-rose-400 border border-rose-900/30 px-3 py-1.5 rounded-lg hover:bg-rose-900/30 cursor-pointer"
                    >
                      <span>إرسال إنذار</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-3 py-1.5 rounded-lg font-bold">
                    ✓ تم الاعتماد والتسوية
                  </span>
                )}
              </div>

              {/* Detailed text in middle */}
              <div className="space-y-2 flex-1 pr-4 order-1 md:order-2">
                <div className="flex items-center gap-3 justify-start">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-bold">
                    تصنيف البلاغ: {r.category}
                  </span>
                  
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getComplianceColor(r.complianceLevel)}`}>
                    مستوى الامتثال: {r.complianceLevel}
                  </span>

                  <span className="text-[11px] text-slate-500 font-sans">
                    {r.date}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  {isDanger && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                  <span>{r.title}</span>
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{r.description}</p>

                <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                  <span>بإشراف: {r.inspector}</span>
                  <span className="mx-1">•</span>
                  <span className="text-amber-500 font-bold">حالة البلاغ: {r.status}</span>
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
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>إصدار بلاغ تفتيش / مطابقة امتثال</span>
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
                <label className="text-xs font-bold text-slate-300 block">عنوان التدقيق / التفتيش</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مراجعة الدفاتر المحاسبية في الإسكندرية" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">التصنيف</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="مالية">مالية</option>
                    <option value="إدارية">إدارية</option>
                    <option value="قانونية">قانونية</option>
                    <option value="فنية">فنية</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">تقدير مستوى الامتثال الحالي</label>
                  <select 
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="عالي">عالي (مطابقة شبه تامة)</option>
                    <option value="متوسط">متوسط (توجد ملاحظات طفيفة)</option>
                    <option value="منخفض">منخفض (تتطلب تصحيحاً فورياً)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">ملخص التقرير والمخالفات المرصودة</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="اكتب خلاصة تقرير المفتش والملاحظات الدقيقة لتسجيلها بالامتثال العام للمجموعة..." 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  حفظ بلاغ التفتيش
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
