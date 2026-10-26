import type { ExecutiveFeed } from '../lib/executiveFeed';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bot, Mic, Paperclip, Send, X, TrendingUp, FileText } from 'lucide-react';
import { achievement, type Metric, type UnitSnapshot } from '../lib/unitWorkspace';
import type { OrgNode } from '../data/organization';
type Message = { role: 'user' | 'assistant'; text: string };
const labels = (id: string) => /factory|industrial|food/.test(id) ? ['الإنتاج','استغلال الطاقة','الهدر','التسليم'] : /procurement|contracts/.test(id) ? ['الطلبات','العقود','وفورات الشراء','التوريد'] : /stores|home|trading|digital/.test(id) ? ['المبيعات','هامش الربح','المخزون','التحصيل'] : /hr/.test(id) ? ['القوى العاملة','الإنتاجية','الاستقرار الوظيفي','الالتزام'] : ['الأداء التشغيلي','إنجاز الخطة','الميزانية','الملاحظات الرقابية'];
export default function UnitWorkspace({ unit, userKey, children, canUseAgent = true }: { key?: string; unit: OrgNode; userKey: string; children?: ReactNode; canUseAgent?: boolean }) {
  const key = `araak-unit-workspace-v1:${userKey}:${unit.id}`;
  const [extractedSnapshot, setSnapshot] = useState<UnitSnapshot | null>(() => { try { const s = JSON.parse(localStorage.getItem(key) || 'null'); return s && Array.isArray(s.metrics) ? s : null; } catch { return null; } });
  const [demo, setDemo] = useState<UnitSnapshot | null>(null);
  const [feedError, setFeedError] = useState('');
  useEffect(() => {
    let disposed = false; const controller = new AbortController(); let active = false;
    const load = async () => { if (active) return; active = true; try {
      const response = await fetch('/api/executive-feed', { signal: controller.signal });
      if (!response.ok) throw new Error();
      const feed: ExecutiveFeed = await response.json();
      if (!disposed) { setDemo(feed.units.find(u => u.id === unit.id)?.snapshot || null); setFeedError(''); }
    } catch (e) { if (!disposed && (e as Error).name !== 'AbortError') setFeedError('تعذر تحديث المحاكاة؛ قد تكون البيانات المعروضة قديمة.'); } finally { active = false; } };
    load(); const timer = setInterval(() => { if (!document.hidden) load(); }, 30000);
    return () => { disposed = true; controller.abort(); clearInterval(timer); };
  }, [unit.id]);
  const snapshot = extractedSnapshot || demo;
  const isDemo = !extractedSnapshot && !!demo;
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const recognition = useRef<any>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => { recognition.current?.abort(); abort.current?.abort(); }, []);
  const save = (s: UnitSnapshot | null) => { setSnapshot(s); try { s ? localStorage.setItem(key, JSON.stringify(s)) : localStorage.removeItem(key); } catch { setError('تعذر حفظ البيانات في هذا المتصفح.'); } };
  const voice = () => {
    if (listening) { recognition.current?.stop(); return; }
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) { setError('الإدخال الصوتي غير متاح في هذا المتصفح. يمكنك الكتابة.'); return; }
    const r = new Speech(); recognition.current = r; r.lang = 'ar-SA'; r.interimResults = false;
    r.onresult = (e: any) => setQuestion(q => `${q} ${e.results[0][0].transcript}`.trim());
    r.onerror = () => { setError('تعذر استقبال الصوت. تحقق من إذن الميكروفون.'); setListening(false); };
    r.onend = () => setListening(false); r.start(); setListening(true);
  };
  const send = async (prompt = question) => {
    if (busy || (!prompt.trim() && !file)) return;
    setBusy(true); setError(''); const text = prompt.trim() || 'اقرأ المستند واعرض الوضع الحالي والمؤشرات والمخاطر والقرارات المطلوبة.';
    try {
      let document;
      if (file) {
        const mimeType = file.type || (/\.csv$/i.test(file.name) ? 'text/csv' : /\.json$/i.test(file.name) ? 'application/json' : 'text/plain');
        if (file.size > 4 * 1024 * 1024 || !['application/pdf','image/png','image/jpeg','text/plain','text/csv','application/json'].includes(mimeType)) throw new Error('اختر PDF أو صورة أو ملف TXT أو CSV أو JSON بحجم لا يتجاوز 4 ميغابايت.');
        const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); });
        document = { name: file.name, mimeType, data };
      }
      const controller = new AbortController(); abort.current = controller;
      const response = await fetch('/api/unit-workspace/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ unitId: unit.id, message: text, document, snapshot, history: messages.slice(-8) }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'تعذر تنفيذ الطلب.');
      setMessages(m => [...m, { role: 'user', text: `${text}${file ? `\nالمرفق: ${file.name}` : ''}` }, { role: 'assistant', text: result.reply }]);
      if (result.snapshot) save(result.snapshot);
      setQuestion(''); setFile(null);
    } catch (e: any) { if (e.name !== 'AbortError') setError(e.message || 'تعذر الاتصال بالخدمة.'); } finally { setBusy(false); }
  };
  const metrics = snapshot?.metrics || [];
  const rates = metrics.map(achievement).filter((v): v is number => v !== undefined);
  return <div dir="rtl" className="space-y-6 text-right">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-xs text-[var(--theme-accent)]">مجموعة أراك للتنمية</p><h2 className="text-3xl font-black">{unit.name}</h2><p className="mt-2 text-sm text-slate-400">{unit.status || 'الوضع الحالي والأداء'}</p></div><span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-400">{isDemo ? 'محاكاة تجريبية · أودوو غير متصل' : snapshot ? 'بيانات مستخرجة · بانتظار المراجعة' : 'مصدر البيانات غير مرتبط'}</span></header>
    <p className="text-xs leading-6 text-slate-400">{snapshot ? `المصدر: ${snapshot.source} · آخر استخراج: ${new Date(snapshot.updatedAt).toLocaleString('ar-SA')}` : 'أرفق تقرير الجهة لعرض مؤشراته. لا تتوفر حالياً بيانات تشغيلية معتمدة لهذه الصفحة.'} · {isDemo ? 'أرقام افتراضية مشتركة تتغير ضمن المحاكاة، ولا تمثل نتائج فعلية.' : 'تحفظ البيانات المستخرجة في هذا المتصفح لهذا الحساب.'}</p>{feedError && <p role="alert" className="text-sm text-red-400">{feedError}</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.length ? metrics.map((m,i) => <MetricCard key={i} metric={m}/>) : labels(unit.id).map(label => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="text-sm text-slate-400">{label}</p><p className="my-5 text-4xl font-black text-slate-500">—</p><p className="text-xs text-slate-500">بانتظار البيانات</p></div>)}</div>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.7fr)]">
      <div className="min-w-0 space-y-5"><section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="mb-4 font-bold">الأداء والمتابعة</h3><p className="text-sm leading-7 text-slate-400">{snapshot?.summary || 'تظهر هنا قراءة الوضع التشغيلي والإنتاجي والرقابي عند توفر تقرير الجهة.'}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-slate-400">مؤشرات دون المستهدف</p><p className="mt-2 text-3xl font-black">{rates.length ? rates.filter(r => r < 100).length : '—'}</p></div><div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-slate-400">مؤشرات لها مستهدف</p><p className="mt-2 text-3xl font-black">{rates.length || '—'}</p></div></div></section>
      <section className="rounded-2xl border border-white/10 p-5"><h3 className="mb-4 flex items-center gap-2 font-bold"><TrendingUp size={18}/>اتجاه المؤشرات</h3>{metrics.some(m=>m.series.length>1) ? metrics.filter(m=>m.series.length>1).map((m,i)=><Trend key={i} metric={m}/>) : <p className="py-8 text-center text-sm text-slate-500">لا تتوفر سلسلة زمنية موثقة لعرض الرسم البياني.</p>}</section>
      <div className="grid gap-4 sm:grid-cols-2">{[['المخاطر والتعثر',snapshot?.risks],['القرارات المقترحة',snapshot?.decisions]].map(([title,items])=><section key={title as string} className="rounded-2xl border border-white/10 p-5"><h3 className="mb-3 font-bold">{title as string}</h3>{(items as string[] | undefined)?.length ? <ul className="space-y-3 text-sm leading-6 text-slate-400">{(items as string[]).map((t,i)=><li key={i}>{t}</li>)}</ul> : <p className="text-sm text-slate-500">لم تتوفر بيانات للتقييم.</p>}</section>)}</div>
      {extractedSnapshot && <button onClick={()=>save(null)} className="text-xs text-slate-400 underline">مسح البيانات المستخرجة من هذا المتصفح</button>}
      </div>
      <aside className="min-w-0 rounded-2xl border border-[var(--theme-accent)]/30 bg-white/[0.035] p-5"><h3 className="flex items-center gap-2 text-lg font-black"><Bot size={22}/>وكيل {unit.name}</h3><p className="mt-2 text-xs leading-6 text-slate-400">اسأل عن الأداء أو أرفق تقريراً لاستخراج مؤشراته في هذه الصفحة.</p>{canUseAgent ? <><div className="my-4 flex flex-wrap gap-2">{['لخّص الوضع الحالي','ما الذي يحتاج قراراً؟'].map(t=><button disabled={busy} key={t} onClick={()=>send(t)} className="rounded-lg border border-white/10 p-2 text-xs disabled:opacity-50">{t}</button>)}</div><div aria-live="polite" className="max-h-96 space-y-3 overflow-auto">{messages.map((m,i)=><div key={i} className={`whitespace-pre-wrap rounded-xl p-3 text-sm leading-7 ${m.role==='user'?'bg-[var(--theme-accent-soft)]':'bg-black/10'}`}><p className="mb-1 text-[10px] text-slate-500">{m.role==='user'?'أنت':'الوكيل'}</p>{m.text}</div>)}{busy && <p role="status" className="py-3 text-sm text-[var(--theme-accent)]">جارٍ تحليل الطلب…</p>}</div><form onSubmit={e=>{e.preventDefault();send();}} className="mt-4 space-y-3"><textarea aria-label="رسالتك إلى وكيل الجهة" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={6000} placeholder="اكتب طلبك…" className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-black/10 p-3 text-sm outline-none focus:border-[var(--theme-accent)]"/>{file && <div className="flex items-center gap-2 text-xs"><FileText size={14}/><span className="truncate">{file.name}</span><button type="button" aria-label="إزالة المرفق" onClick={()=>setFile(null)}><X size={14}/></button></div>}<div className="flex items-center gap-2"><label className="cursor-pointer rounded-lg border border-white/10 p-3" title="إرفاق تقرير"><Paperclip size={18}/><input aria-label="إرفاق مستند" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.json" disabled={busy} onChange={e=>{setFile(e.target.files?.[0]||null);e.target.value='';}} className="sr-only"/></label><button type="button" aria-label={listening?'إيقاف التسجيل':'إملاء صوتي'} aria-pressed={listening} onClick={voice} className={`rounded-lg border border-white/10 p-3 ${listening?'text-red-400':''}`}><Mic size={18}/></button><button disabled={busy || (!question.trim()&&!file)} type="submit" className="mr-auto flex items-center gap-2 rounded-lg bg-[var(--theme-accent-soft)] px-4 py-3 text-sm font-bold text-[var(--theme-accent)] disabled:opacity-40"><Send size={16}/>إرسال</button></div><p className="text-[10px] leading-5 text-slate-500">PDF، صور، نصوص وجداول CSV · حتى 4 ميغابايت. يُرسل المرفق إلى خدمة الذكاء الاصطناعي للتحليل. الصوت يتحول إلى نص قبل الإرسال.</p></form></> : <p className="mt-4 text-sm text-slate-400">استخدام الوكيل غير متاح ضمن صلاحيات هذا الحساب.</p>}{error && <p role="alert" className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}</aside>
    </div>
    {children && <details className="rounded-2xl border border-white/10 p-5"><summary className="cursor-pointer font-bold">الخطط والخدمات</summary><div className="mt-5">{children}</div></details>}
  </div>;
}
function MetricCard({metric:m}:{key?: number;metric:Metric}) { const rate=achievement(m);return <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><h3 className="text-sm text-slate-400">{m.label}</h3><p className="my-4 break-words text-4xl font-black tabular-nums">{m.value.toLocaleString('ar-SA')} <span className="text-sm font-normal text-slate-400">{m.unit}</span></p><p className="text-xs text-slate-400">{m.period || 'الفترة غير محددة'}{m.target!==undefined?` · المستهدف ${m.target.toLocaleString('ar-SA')}`:''}</p>{rate!==undefined && <><div className="my-3 h-2 overflow-hidden rounded-full bg-white/10"><div style={{width:`${Math.min(100,Math.max(0,rate))}%`}} className={`h-full ${rate>=100?'bg-emerald-400':rate>=80?'bg-amber-400':'bg-red-400'}`}/></div><p className="text-xs">تحقيق المستهدف {Math.round(rate)}٪</p></>}<p className="mt-3 text-[10px] leading-5 text-slate-500">المصدر: {m.source}</p></article>; }
function Trend({metric:m}:{key?: number;metric:Metric}) { const values=m.series.map(p=>p.value),min=Math.min(...values),max=Math.max(...values),span=max-min||1; const points=m.series.map((p,i)=>`${15+i/(m.series.length-1)*370},${115-(p.value-min)/span*90}`).join(' ');return <figure className="mb-5"><figcaption className="text-sm">{m.label} <span className="text-xs text-slate-500">({m.unit})</span></figcaption><svg viewBox="0 0 400 140" role="img" aria-label={`اتجاه ${m.label}`} className="mt-3 w-full text-[var(--theme-accent)]"><title>{m.series.map(p=>`${p.label}: ${p.value}`).join('، ')}</title><path d="M15 125H385" stroke="currentColor" opacity=".2"/><polyline points={points} fill="none" stroke="currentColor" strokeWidth="3"/></svg><div className="flex flex-wrap gap-3 text-[10px] text-slate-500">{m.series.map((p,i)=><span key={i}>{p.label}: {p.value.toLocaleString('ar-SA')}</span>)}</div></figure>; }
