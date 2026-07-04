import React, { useState } from 'react';
import { 
  FolderClosed, 
  Plus, 
  Search, 
  FileText, 
  History, 
  BookOpen, 
  Brain, 
  ShieldCheck, 
  X, 
  UploadCloud, 
  Download,
  Tag
} from 'lucide-react';
import { DocumentItem, PlatformTheme } from '../types';
import { initialDocuments } from '../data/mockData';

interface DocumentCenterViewProps {
  theme: PlatformTheme;
}

export default function DocumentCenterView({ theme }: DocumentCenterViewProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [showUpload, setShowUpload] = useState(false);
  
  // Drag and drop simulator state
  const [dragActive, setDragActive] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCat, setNewDocCat] = useState<'العقود والسياسات' | 'التقارير' | 'محاضر الاجتماعات' | 'مستندات عامة'>('العقود والسياسات');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'الكل' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newDocTitle,
      category: newDocCat,
      date: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      author: 'د. علي العتيبي',
      tags: ['مضاف حديثاً', 'رئاسة']
    };

    setDocuments([newDoc, ...documents]);
    setShowUpload(false);
    setNewDocTitle('');
  };

  const categories = ['الكل', 'العقود والسياسات', 'التقارير', 'محاضر الاجتماعات', 'مستندات عامة'];

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
      
      {/* Header matching Page 18 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            إدارة المعرفة والمستندات
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            مركز الوثائق والمعرفة
          </h2>
          <span className="text-xs text-slate-400">
            أرشفة ذكية، تصنيف، وبحث دلالي يدعم اتخاذ القرارات وحفظ الذاكرة المؤسسية
          </span>
        </div>

        <button 
          onClick={() => setShowUpload(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>إضافة وثيقة</span>
        </button>
      </div>

      {/* 4 Stat Counters exactly like Page 18 layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <span className="text-xs text-slate-400 block mb-1">إجمالي الوثائق</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">{documents.length}</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <span className="text-xs text-slate-400 block mb-1">العقود والسياسات</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {documents.filter(d => d.category === 'العقود والسياسات').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <span className="text-xs text-slate-400 block mb-1">التقارير الإستراتيجية</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {documents.filter(d => d.category === 'التقارير').length}
          </span>
        </div>
        <div className="bg-[#121422] p-5 rounded-xl border border-slate-800/80 text-right">
          <span className="text-xs text-slate-400 block mb-1">محاضر الاجتماعات</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">
            {documents.filter(d => d.category === 'محاضر الاجتماعات').length}
          </span>
        </div>
      </div>

      {/* Semantic Search Assistant Card exactly like Page 18 */}
      <div className={`p-6 rounded-2xl border ${getThemeBgClass()} shadow-lg space-y-4`}>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-black text-slate-100">مساعد السكرتارية الذكي</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
          يقوم الذكاء الاصطناعي بتحويل الوثائق غير المنظمة (مثل عقود الـ PDF الممسوحة ومسودات المحاضر) إلى معرفة حية مترابطة سهلة البحث واتخاذ القرارات السريعة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right pt-2">
          <div className="bg-[#121422]/60 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-xs font-bold text-slate-200 mb-1">استخراج تلقائي</h4>
            <p className="text-[11px] text-slate-400">تحليل تلقائي للنصوص لاستخراج المسؤوليات والتواريخ الحساسة ومذكرات الامتثال.</p>
          </div>
          <div className="bg-[#121422]/60 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-xs font-bold text-slate-200 mb-1">ذاكرة مؤسسية</h4>
            <p className="text-[11px] text-slate-400">ربط مستمر بين العقود والمشاريع ومحاضر اجتماعات مجلس الإدارة لحماية تسلسل القرارات.</p>
          </div>
          <div className="bg-[#121422]/60 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-xs font-bold text-slate-200 mb-1">بحث دلالي</h4>
            <p className="text-[11px] text-slate-400">ابحث بذكاء عما تريده (مثلاً: "نزاعات الأرض بمصر") ليصلك للمقاطع المعنية فوراً.</p>
          </div>
        </div>
      </div>

      {/* Interactive Document Explorer Section */}
      <div className="bg-[#121422] rounded-2xl border border-slate-800/80 p-6 shadow-lg space-y-5">
        
        {/* Search controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="ابحث في مركز المعرفة..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 pr-10 pl-4 text-xs text-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-amber-600 text-slate-950' : 'bg-[#16182c] text-slate-400 hover:text-slate-100'
                }`}
              >
                {cat === 'الكل' ? 'الكل' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Document List */}
        <div className="divide-y divide-slate-800/60">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#16182c]/30 rounded-xl px-2 transition-colors"
            >
              <div className="flex gap-3 items-start sm:items-center">
                <div className="p-2.5 bg-slate-800 text-amber-500 rounded-xl border border-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                
                <div className="space-y-1 text-right">
                  <h4 className="text-sm font-extrabold text-slate-200">{doc.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans">
                    <span>التصنيف: {doc.category}</span>
                    <span>•</span>
                    <span>الحجم: {doc.size}</span>
                    <span>•</span>
                    <span>المؤلف: {doc.author}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                {/* tags */}
                <div className="flex gap-1.5 overflow-hidden">
                  {doc.tags.map((t) => (
                    <span key={t} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-sans flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-amber-500/60" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => alert(`تم تنزيل مستند: ${doc.title} بخصوصية تامة.`)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all cursor-pointer border border-slate-700/60"
                  title="تنزيل الملف"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Upload Modal Simulator with drag-and-drop */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>تحميل وثيقة للمعرفة المؤسسية</span>
              </h3>
              <button 
                onClick={() => setShowUpload(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              
              {/* Drag & Drop simulated box */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  dragActive ? 'border-amber-500 bg-amber-950/10' : 'border-slate-800 bg-[#16182c]'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
              >
                <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-300">قم بسحب الملف وإفلاته هنا</p>
                <p className="text-[10px] text-slate-500 mt-1">أو انقر لاختيار ملف PDF, DOCX, XLSX من جهازك</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">عنوان أو مسمى الوثيقة</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: ملحق مراجعة خطة موازنة الحديد والصلب" 
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">التصنيف الموضوعي</label>
                <select 
                  value={newDocCat}
                  onChange={(e) => setNewDocCat(e.target.value as any)}
                  className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="العقود والسياسات">العقود والسياسات</option>
                  <option value="التقارير">التقارير</option>
                  <option value="محاضر الاجتماعات">محاضر الاجتماعات</option>
                  <option value="مستندات عامة">مستندات عامة</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors text-slate-300"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${getThemeBtnClass()}`}
                >
                  أرشفة المستند AI
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
