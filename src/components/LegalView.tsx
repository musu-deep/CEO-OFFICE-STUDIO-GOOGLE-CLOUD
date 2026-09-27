import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  ShieldCheck, 
  Download, 
  Clock, 
  AlertTriangle, 
  Scale, 
  Brain, 
  X,
  FileDigit,
  Eye,
  Inbox,
  BellRing,
  Handshake,
  ClipboardCheck,
  History,
  UserCheck
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface LegalViewProps {
  theme: PlatformTheme;
}

interface LegalItem {
  id: string;
  type: 'عقد' | 'قضية' | 'ترخيص';
  title: string;
  party: string;
  date: string;
  value?: string;
  status: 'نشط' | 'معلق' | 'قيد المرافعة' | 'مكتمل';
  details: string;
  aiNotes?: string;
}

export default function LegalView({ theme }: LegalViewProps) {
  const [items, setItems] = useState<LegalItem[]>([
    {
      id: 'leg-1',
      type: 'عقد',
      title: 'اتفاقية التوريد والإنتاج المشترك لمصنع الحديد والصناعة',
      party: 'شركة سابك للصناعات الأساسية',
      date: '2026-06-10',
      value: '15,000,000 درهم',
      status: 'نشط',
      details: 'عقد توريد خام الحديد الخام المجدول على مدى عامين لضمان انتظام الإنتاج بأسعار ثابتة ومتفق عليها.',
      aiNotes: '✓ تم تدقيق البنود آلياً للتأكد من شرط القوة القاهرة وصياغة التحكيم المحلي الآمن.'
    },
    {
      id: 'leg-2',
      type: 'قضية',
      title: 'دعوى فض نزاع ملكية أرض فرع اراك التنمية جيزان ()',
      party: 'هيئة المجتمعات العمرانية ومقاولو الباطن',
      date: '2026-06-12',
      status: 'قيد المرافعة',
      details: 'جلسة تسوية واستماع لفض النزاع وتحديد التعويض المادي العادل لضمان عدم توقف عمليات التشييد.',
      aiNotes: '⚠️ يوصى بصياغة مذكرة تسوية ودية وتفادي التقاضي الطويل لتسريع إطلاق مشروع الـ 2030.'
    },
    {
      id: 'leg-3',
      type: 'ترخيص',
      title: 'تجديد الترخيص النقل التجاري العام لفرع أراك لوجستيك',
      party: 'الهيئة العامة للموانئ والجمارك',
      date: '2026-06-16',
      status: 'نشط',
      details: 'الحصول على المطبوعات والتراخيص المحلية المحدثة لتسيير الشحنات بمرونة وسرعة.',
      aiNotes: '✓ الترخيص مكتمل وساري المفعول لمدة 5 سنوات قادمة مع إعفاءات جمركية مفعلة.'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'الكل' | 'عقد' | 'قضية' | 'ترخيص'>('الكل');
  const [showModal, setShowModal] = useState(false);
  const [showAiAnalysis, setShowAiAnalysis] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'عقد' | 'قضية' | 'ترخيص'>('عقد');
  const [newParty, setNewParty] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: LegalItem = {
      id: `leg-${Date.now()}`,
      type: newType,
      title: newTitle,
      party: newParty || 'شريك استراتيجي للمجموعة',
      date: new Date().toISOString().split('T')[0],
      value: newValue || undefined,
      status: 'نشط',
      details: newDesc,
      aiNotes: '✓ جاري تدقيق العقد آلياً لاستخراج البنود الاستثنائية والالتزامات المالية.'
    };

    setItems([newItem, ...items]);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewParty('');
    setNewValue('');
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

  const legalWorkflow = [
    { icon: Inbox, title: 'استقبال وتصنيف', desc: 'الجهة الطالبة، الأولوية، المسؤول والموعد المستهدف' },
    { icon: ShieldCheck, title: 'مراجعة وقائية', desc: 'السياسات والإجراءات وسجل المخاطر قبل نشوء النزاع' },
    { icon: FileText, title: 'تقييم قانوني', desc: 'الوقائع والمستندات والالتزامات والخيارات والتوصية' },
    { icon: Handshake, title: 'العقود والأطراف', desc: 'ربط الأطراف والالتزامات والمراسلات والنسخ المعتمدة' },
    { icon: BellRing, title: 'المواعيد والتنبيهات', desc: 'الاستحقاقات والجلسات والتجديدات والتصعيد' },
    { icon: Scale, title: 'التحصيل والتنفيذ', desc: 'التفاهم والمطالبة والإجراء القانوني ومتابعة التنفيذ' },
    { icon: ClipboardCheck, title: 'الإغلاق والتعلّم', desc: 'النتيجة والأثر المالي والدرس والإجراء الوقائي' },
  ];

  const filtered = items.filter(it => {
    if (activeTab === 'الكل') return true;
    return it.type === activeTab;
  });

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 7 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            الإدارة القانونية والمحاضر
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            الشؤون القانونية والمحاضر (Legal Desk)
          </h2>
          <span className="text-xs text-slate-400">
            إدارة دورة العمل القانونية من الوقاية ومراجعة العقود والسياسات إلى القضايا والتحصيل والتنفيذ والإغلاق والتعلّم المؤسسي
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مستند قانوني</span>
        </button>
      </div>

      {/* Stats counter grid exactly like Page 7 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">إجمالي المستندات</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">{items.length}</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">العقود والاتفاقيات</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {items.filter(i => i.type === 'عقد').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">نزاعات وقضايا جارية</span>
          <span className="text-3xl font-extrabold text-rose-500 font-sans">
            {items.filter(i => i.type === 'قضية').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">التراخيص والوثائق</span>
          <span className="text-3xl font-extrabold text-emerald-500 font-sans">
            {items.filter(i => i.type === 'ترخيص').length}
          </span>
        </div>
      </div>

      {/* Executive legal workflow — adapted from Mohami Araak */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className={`text-xs font-bold ${getThemeTextClass()}`}>دورة الملف القانوني</span>
            <h3 className="mt-1 text-xl font-extrabold text-white">من ورود الطلب حتى الإغلاق والتعلّم المؤسسي</h3>
          </div>
          <span className="hidden md:block text-xs text-slate-500">لا ملف بلا مسؤول • موعد • حالة • أثر قابل للتتبع</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
          {legalWorkflow.map((stage, index) => (
            <div key={stage.title} className="bg-[#121422] border border-slate-800/80 rounded-2xl p-4 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <stage.icon className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-black text-slate-600">{index + 1}/7</span>
              </div>
              <div className="mt-3 text-xs font-black text-slate-100">{stage.title}</div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Governance and review pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>مسار المراجعة والاعتماد</span>
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {['إعداد', 'تدقيق', 'مراجعة', 'اعتماد', 'حفظ ومتابعة'].map((step, i) => (
              <span key={step} className="px-3 py-2 rounded-xl border border-slate-800 bg-[#16182c] text-[11px] font-bold text-slate-300">
                {i + 1}. {step}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">لا يتحول المستند إلى نسخة نهائية ولا يبدأ إجراء خارجي قبل اكتمال المراجعة والاعتماد بحسب الصلاحيات.</p>
        </div>
        <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>الحوكمة والسرية القانونية</span>
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
            {['الحاجة إلى المعرفة', 'أقل قدر لازم من الصلاحيات', 'فصل الإعداد والمراجعة والاعتماد', 'سجل قرارات وإصدارات قابل للتتبع'].map(point => (
              <div key={point} className="rounded-xl bg-[#16182c] border border-slate-800 p-3 text-slate-300">{point}</div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">مخرجات الذكاء الاصطناعي مساعدة ولا تُعد رأياً قانونياً نهائياً؛ الاعتماد والمسؤولية المهنية لدى المختص وصاحب الصلاحية.</p>
        </div>
      </div>

      {/* AI Contract Assistant Card */}
      <div className={`p-6 rounded-2xl border ${getThemeBgClass()} shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-500" />
            <span>مدقق العقود والاتفاقيات الذكي (AI Lawyer)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            تقوم الخوارزميات بفحص مسودات العقود واستخلاص المسؤوليات المالية، واكتشاف الشروط المجحفة، وتنبيه سعادة الرئيس لأي فجوات قانونية قد تمس مصالح المجموعة.
          </p>
        </div>
        <button 
          onClick={() => alert('جاري تشغيل المدقق القانوني لكافة العقود المؤرشفة...')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl text-xs font-bold cursor-pointer transition-colors flex-shrink-0"
        >
          فحص كافة العقود
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-end gap-2 bg-[#121422] p-2 rounded-xl border border-slate-800/80 w-fit mr-auto">
        {(['الكل', 'عقد', 'قضية', 'ترخيص'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === tab ? 'bg-amber-600 text-slate-950' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {tab === 'الكل' ? 'الكل' : tab === 'عقد' ? 'العقود' : tab === 'قضية' ? 'القضايا' : 'تراخيص ووثائق'}
          </button>
        ))}
      </div>

      {/* List content cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isCase = item.type === 'قضية';
          const isLicense = item.type === 'ترخيص';
          
          return (
            <div 
              key={item.id}
              className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700/80 transition-all duration-300 shadow-lg text-right overflow-hidden"
            >
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                isCase ? 'bg-rose-500' : isLicense ? 'bg-emerald-500' : 'bg-blue-500'
              }`}></div>

              {/* Action Panel on left */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end order-2 md:order-1 flex-shrink-0">
                <button 
                  onClick={() => setShowAiAnalysis(showAiAnalysis === item.id ? null : item.id)}
                  className="text-[11px] bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1 font-bold"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>{showAiAnalysis === item.id ? 'إخفاء الفحص' : 'فحص الذكاء الاصطناعي'}</span>
                </button>

                <button 
                  onClick={() => alert(`تنزيل مستند: ${item.title}`)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl transition-all cursor-pointer"
                  title="تنزيل PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Details in middle */}
              <div className="space-y-2 flex-1 pr-4 order-1 md:order-2">
                <div className="flex items-center gap-3 justify-start">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isCase ? 'bg-rose-950/40 text-rose-400' : isLicense ? 'bg-emerald-950/40 text-emerald-400' : 'bg-blue-950/40 text-blue-400'
                  }`}>
                    {item.type}
                  </span>

                  <span className="text-[11px] text-slate-500 font-sans">
                    تاريخ الأرشفة: {item.date}
                  </span>

                  {item.value && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded font-sans font-bold">
                      القيمة: {item.value}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  {isCase && <Scale className="w-4 h-4 text-rose-500" />}
                  <span>{item.title}</span>
                </h3>

                <div className="text-xs text-slate-400">
                  <span>الطرف الآخر: </span>
                  <strong className="text-slate-300 font-bold">{item.party}</strong>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{item.details}</p>

                {/* Simulated AI notes expanded box */}
                {showAiAnalysis === item.id && item.aiNotes && (
                  <div className="bg-[#16182c] border border-slate-800/80 rounded-xl p-4 mt-3 space-y-1.5 text-right animate-[fadeIn_0.3s_ease_out]">
                    <span className="text-[10px] text-amber-500 font-black flex items-center gap-1 justify-end">
                      <Brain className="w-3.5 h-3.5" />
                      <span>تدقيق وتحليل أراك الذكي للامتثال والاتفاقيات</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.aiNotes}</p>
                  </div>
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
                <Scale className="w-4 h-4 text-amber-500" />
                <span>أرشفة بند قانوني جديد</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">تصنيف المستند</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="عقد">عقد أو اتفاقية شراكة</option>
                    <option value="قضية">ملف نزاع أو قضية جارية</option>
                    <option value="ترخيص">ترخيص أو وثيقة نظامية</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">القيمة التقديرية (اختياري)</label>
                  <input 
                    type="text" 
                    placeholder="مثال: 5000000 درهم" 
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">عنوان الاتفاقية / النزاع</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: عقد الشراكة لإنشاء خط الصهر الثاني" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">الطرف الآخر</label>
                <input 
                  type="text" 
                  placeholder="مثال: شركة أو جهة متعاقدة" 
                  value={newParty}
                  onChange={(e) => setNewParty(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">الوصف وخلاصة البنود</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="اكتب خلاصة المستند والمسؤوليات القانونية والحقوق المتبادلة..." 
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
                  حفظ وأرشفة ذكية
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
