import { ArrowRight, ExternalLink, FileText, Printer } from 'lucide-react';

interface ExecutiveCVViewProps {
  onBack: () => void;
}

export default function ExecutiveCVView({ onBack }: ExecutiveCVViewProps) {
  const cvUrl = '/executive-cv-ali-alotaibi.html';
  const openCV = () => window.open(cvUrl, '_blank', 'noopener,noreferrer');

  const today = new Intl.DateTimeFormat('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    calendar: 'gregory',
  }).format(new Date());

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-black/20 p-5">
        <div className="text-right">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black mb-1">
            <FileText className="w-4 h-4" /> السيرة الذاتية التنفيذية
          </div>
          <h1 className="text-2xl font-black text-white">المستشار الدكتور علي عبدالله سليمان العتيبي</h1>
          <p className="text-sm text-slate-400 mt-1">وفق آخر تحديث في: {today}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onBack} className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للبطاقة
          </button>
          <button onClick={openCV} className="px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> فتح السيرة
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

          <h2 className="text-3xl md:text-4xl font-black text-white leading-relaxed">
            السيرة الذاتية التنفيذية
            <span className="block mt-1">للمستشار الدكتور علي العتيبي</span>
          </h2>

          <p className="mt-4 text-slate-400 font-bold">
            وفق آخر تحديث في: <span className="text-slate-200">{today}</span>
          </p>

          <button
            onClick={openCV}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-7 py-4 text-white font-black shadow-xl shadow-emerald-950/30 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            عرض السيرة الذاتية
          </button>
        </div>
      </div>
    </div>
  );
}
