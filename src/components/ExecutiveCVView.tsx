import { ArrowRight, ExternalLink, FileText, Printer } from 'lucide-react';

interface ExecutiveCVViewProps {
  onBack: () => void;
}

export default function ExecutiveCVView({ onBack }: ExecutiveCVViewProps) {
  const cvUrl = '/executive-cv-ali-alotaibi.html';

  const openCV = () => window.open(cvUrl, '_blank', 'noopener,noreferrer');

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-black/20 p-5">
        <div className="text-right">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black mb-1">
            <FileText className="w-4 h-4" /> السيرة التنفيذية المعتمدة
          </div>
          <h1 className="text-2xl font-black text-white">د. علي عبدالله سليمان العتيبي</h1>
          <p className="text-sm text-slate-400 mt-1">Digital Master 2026 • نسخة A4 المعتمدة</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onBack} className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للبطاقة
          </button>
          <button onClick={openCV} className="px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> فتح السيرة المعتمدة
          </button>
          <button onClick={openCV} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 flex items-center gap-2">
            <Printer className="w-4 h-4" /> طباعة / PDF
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-black/20 p-6 md:p-10 shadow-2xl">
        <div className="mx-auto max-w-4xl text-center py-16">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <FileText className="w-9 h-9 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white">الأصل الرقمي للسيرة التنفيذية</h2>
          <p className="mt-3 text-slate-400 leading-8 max-w-2xl mx-auto">
            النسخة المعتمدة محفوظة داخل المنصة كوثيقة A4 مستقلة للحفاظ على تنسيقها الكامل عند العرض والطباعة والحفظ بصيغة PDF.
          </p>

          <button
            onClick={openCV}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-7 py-4 text-white font-black shadow-xl shadow-emerald-950/30 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            عرض السيرة الذاتية الكاملة
          </button>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 text-right">
            {[
              ['نسخة معتمدة', 'Digital Master 2026'],
              ['مقاس الإخراج', 'A4 • صفحتان'],
              ['الاستخدام', 'عرض • طباعة • PDF'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                <p className="text-[11px] text-slate-500 font-bold">{label}</p>
                <p className="text-sm text-slate-100 font-black mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
