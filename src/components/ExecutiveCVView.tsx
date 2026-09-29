import { ArrowRight, ExternalLink, FileText, Printer } from 'lucide-react';

interface ExecutiveCVViewProps {
  onBack: () => void;
}

export default function ExecutiveCVView({ onBack }: ExecutiveCVViewProps) {
  const cvUrl = '/executive-cv-ali-alotaibi.html';
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
          <button onClick={() => window.open(cvUrl, '_blank', 'noopener,noreferrer')} className="px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> فتح مستقلة
          </button>
          <button onClick={() => window.open(cvUrl, '_blank', 'noopener,noreferrer')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 flex items-center gap-2">
            <Printer className="w-4 h-4" /> طباعة / PDF
          </button>
        </div>
      </div>
      <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-white shadow-2xl min-h-[82vh]">
        <iframe
          src={cvUrl}
          title="السيرة الذاتية التنفيذية للدكتور علي العتيبي"
          className="w-full h-[82vh] bg-white"
        />
      </div>
    </div>
  );
}
