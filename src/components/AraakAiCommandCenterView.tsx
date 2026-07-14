import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  GraduationCap,
  Megaphone,
  Newspaper,
  Pause,
  Play,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import { PlatformTheme } from '../types';

type CommandCenterTab = 'overview' | 'content' | 'academy' | 'approvals';
type AgentStatus = 'active' | 'review' | 'paused';
type ApprovalLevel = 'auto' | 'manager' | 'executive';

interface AraakAiCommandCenterViewProps {
  theme: PlatformTheme;
}

interface AgentCard {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  queue: number;
  accuracy: number;
  icon: typeof Bot;
}

const agents: AgentCard[] = [
  { id: 'supervisor', name: 'المشرف التنفيذي الذكي', role: 'توزيع المهام، المراجعة والتصعيد', status: 'active', queue: 6, accuracy: 96, icon: Brain },
  { id: 'strategy', name: 'وكيل الاستراتيجية والتحرير', role: 'الخطة التحريرية والحملات', status: 'active', queue: 8, accuracy: 94, icon: Workflow },
  { id: 'radar', name: 'وكيل الرصد والفرص', role: 'الأخبار والمنح وفرص الشراكات', status: 'active', queue: 14, accuracy: 91, icon: Newspaper },
  { id: 'writer', name: 'وكيل صناعة المحتوى', role: 'الكتابة وإعادة التوظيف متعدد القنوات', status: 'active', queue: 11, accuracy: 95, icon: Megaphone },
  { id: 'governance', name: 'وكيل التدقيق والحوكمة', role: 'اللغة والحقائق والهوية والمخاطر', status: 'review', queue: 5, accuracy: 98, icon: ShieldCheck },
  { id: 'publisher', name: 'وكيل النشر والتوزيع', role: 'الجدولة والنشر بعد الاعتماد', status: 'paused', queue: 9, accuracy: 99, icon: Send },
  { id: 'academy', name: 'وكيل أكاديمية أراك', role: 'البرامج والمدربون والمتدربون والجودة', status: 'active', queue: 7, accuracy: 93, icon: GraduationCap },
  { id: 'analytics', name: 'وكيل التحليل والتحسين', role: 'قياس الأداء والتوصيات', status: 'active', queue: 4, accuracy: 96, icon: BarChart3 },
];

const contentPipeline = [
  { stage: 'الرصد والأفكار', value: 26, note: 'أخبار وفرص قيد الفرز', icon: Newspaper },
  { stage: 'قيد الإنتاج', value: 14, note: 'منشورات ومقالات ونشرات', icon: Sparkles },
  { stage: 'قيد التدقيق', value: 7, note: 'لغة وحقائق وهوية', icon: ShieldCheck },
  { stage: 'بانتظار الاعتماد', value: 5, note: 'قرارات بشرية مطلوبة', icon: Clock3 },
  { stage: 'مجدول للنشر', value: 12, note: 'للأيام السبعة المقبلة', icon: Calendar },
  { stage: 'نُشر هذا الشهر', value: 38, note: 'عبر قنوات أراك', icon: Send },
];

const academyPrograms = [
  { name: 'إعداد المشاريع التنموية', registrations: 68, target: 80, status: 'التسجيل مفتوح', quality: 92 },
  { name: 'الذكاء الاصطناعي للقيادات التنموية', registrations: 54, target: 60, status: 'قارب على الاكتمال', quality: 95 },
  { name: 'تدريب المدربين RTOT', registrations: 31, target: 45, status: 'الحملة نشطة', quality: 90 },
  { name: 'البناء القيادي – نماذج تطبيقية', registrations: 22, target: 40, status: 'قيد الإطلاق', quality: 88 },
];

const approvals: Array<{
  title: string;
  entity: string;
  due: string;
  level: ApprovalLevel;
  reason: string;
}> = [
  { title: 'إطلاق حملة برنامج الذكاء الاصطناعي للقيادات', entity: 'أكاديمية أراك', due: 'اليوم 05:30 م', level: 'manager', reason: 'يتضمن سعر البرنامج وجدول التنفيذ' },
  { title: 'منشور رأي مؤسسي حول استدامة المشاريع التنموية', entity: 'مجموعة أراك للتنمية', due: 'غداً 10:00 ص', level: 'executive', reason: 'يمثل موقفاً مؤسسياً باسم المجموعة' },
  { title: 'إعادة نشر قصاصة معرفية من محتوى سابق', entity: 'إدارة المحتوى', due: 'اليوم 07:00 م', level: 'auto', reason: 'مادة معتمدة بلا بيانات حساسة' },
  { title: 'نشرة يوليو لشركاء المجموعة', entity: 'الشراكات والتنمية', due: 'الخميس 01:00 م', level: 'manager', reason: 'تتضمن أسماء شركاء وفرصاً جديدة' },
];

const weeklyCalendar = [
  { day: 'الأحد', posts: 3, academy: 1 },
  { day: 'الاثنين', posts: 4, academy: 2 },
  { day: 'الثلاثاء', posts: 3, academy: 1 },
  { day: 'الأربعاء', posts: 5, academy: 2 },
  { day: 'الخميس', posts: 4, academy: 1 },
  { day: 'الجمعة', posts: 2, academy: 0 },
  { day: 'السبت', posts: 2, academy: 1 },
];

export default function AraakAiCommandCenterView({ theme }: AraakAiCommandCenterViewProps) {
  const [activeTab, setActiveTab] = useState<CommandCenterTab>('overview');
  const [automationEnabled, setAutomationEnabled] = useState(false);

  const themeClasses = useMemo(() => {
    switch (theme) {
      case 'golden_luxury':
        return { text: 'text-amber-400', bg: 'bg-amber-500', soft: 'bg-amber-500/10', border: 'border-amber-500/25', gradient: 'from-amber-500 to-orange-500' };
      case 'midnight_navy':
        return { text: 'text-blue-400', bg: 'bg-blue-500', soft: 'bg-blue-500/10', border: 'border-blue-500/25', gradient: 'from-blue-500 to-cyan-500' };
      case 'spring':
        return { text: 'text-lime-400', bg: 'bg-lime-500', soft: 'bg-lime-500/10', border: 'border-lime-500/25', gradient: 'from-lime-500 to-emerald-500' };
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-500', soft: 'bg-emerald-500/10', border: 'border-emerald-500/25', gradient: 'from-emerald-500 to-teal-500' };
    }
  }, [theme]);

  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalQueue = agents.reduce((sum, agent) => sum + agent.queue, 0);
  const averageAccuracy = Math.round(agents.reduce((sum, agent) => sum + agent.accuracy, 0) / agents.length);

  const statusBadge = (status: AgentStatus) => {
    if (status === 'active') return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-400"><Play className="h-3 w-3" /> يعمل</span>;
    if (status === 'review') return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-black text-amber-400"><Eye className="h-3 w-3" /> مراجعة</span>;
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-[11px] font-black text-slate-400"><Pause className="h-3 w-3" /> متوقف آمن</span>;
  };

  const approvalBadge = (level: ApprovalLevel) => {
    if (level === 'auto') return <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-black text-emerald-400">أخضر · اعتماد آلي</span>;
    if (level === 'manager') return <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-black text-amber-400">أصفر · اعتماد إداري</span>;
    return <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[11px] font-black text-rose-400">أحمر · اعتماد تنفيذي</span>;
  };

  return (
    <div className="space-y-7 animate-[fadeIn_0.45s_ease-out]">
      <section className={`relative overflow-hidden rounded-[2rem] border border-white/10 ${themeClasses.border} bg-white/[0.045] p-7 shadow-2xl shadow-black/25`}>
        <div className={`absolute -left-24 -top-24 h-72 w-72 rounded-full ${themeClasses.soft} blur-3xl`} />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 ${themeClasses.soft} px-4 py-2 text-xs font-black ${themeClasses.text}`}>
                <Sparkles className="h-4 w-4" /> ARAAK NAMA AI
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-bold text-slate-400">نسخة التأسيس · وضع الإشراف الآمن</span>
            </div>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">مركز القيادة الذكية للمحتوى والأكاديمية</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-400 md:text-base">غرفة عمليات موحدة تخطط وتنتج وتدقق وتجدول وتقيس محتوى مجموعة أراك، وتدير دورة برامج أكاديمية أراك من الفكرة حتى قياس الأثر.</p>
          </div>

          <div className="min-w-[300px] rounded-3xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">استقلالية النشر الخارجي</p>
                <p className="mt-1 text-base font-black text-white">{automationEnabled ? 'مفعلة ضمن الحوكمة' : 'متوقفة حتى اكتمال الربط'}</p>
              </div>
              <button
                onClick={() => setAutomationEnabled(value => !value)}
                className={`relative h-9 w-16 rounded-full border transition-all ${automationEnabled ? `${themeClasses.bg} border-white/20` : 'border-white/10 bg-slate-800'}`}
                aria-pressed={automationEnabled}
                title="تبديل وضع الأتمتة التجريبي"
              >
                <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-lg transition-all ${automationEnabled ? 'left-1' : 'left-8'}`} />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-3 text-xs leading-6 text-amber-200/80">
              <ShieldCheck className="h-5 w-5 shrink-0 text-amber-400" />
              لا يتم نشر أي مادة حساسة قبل اعتماد صاحب الصلاحية.
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          ['وكلاء نشطون', activeAgents, Bot],
          ['مهام في الطابور', totalQueue, Workflow],
          ['دقة المراجعة', `${averageAccuracy}%`, ShieldCheck],
          ['مواد هذا الشهر', 38, Megaphone],
          ['برامج أكاديمية نشطة', 4, GraduationCap],
        ].map(([label, value, Icon]) => {
          const CardIcon = Icon as typeof Bot;
          return (
            <div key={String(label)} className={`rounded-3xl border border-white/10 ${themeClasses.border} bg-white/[0.04] p-5 shadow-xl shadow-black/15`}>
              <div className="flex items-start justify-between gap-3">
                <div className="text-right">
                  <p className="text-3xl font-black text-white">{String(value)}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{String(label)}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 ${themeClasses.soft}`}>
                  <CardIcon className={`h-5 w-5 ${themeClasses.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
        {[
          ['overview', 'نظرة عامة', Brain],
          ['content', 'عمليات المحتوى', Megaphone],
          ['academy', 'تشغيل الأكاديمية', GraduationCap],
          ['approvals', 'مركز الاعتمادات', ShieldCheck],
        ].map(([id, label, Icon]) => {
          const TabIcon = Icon as typeof Brain;
          const selected = activeTab === id;
          return (
            <button
              key={String(id)}
              onClick={() => setActiveTab(id as CommandCenterTab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-all ${selected ? `bg-gradient-to-l ${themeClasses.gradient} text-white shadow-lg` : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <TabIcon className="h-4 w-4" /> {String(label)}
            </button>
          );
        })}
      </section>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="xl:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className={`text-xs font-black ${themeClasses.text}`}>DIGITAL WORKFORCE</p>
                <h3 className="mt-1 text-2xl font-black text-white">فريق الوكلاء تحت الإشراف</h3>
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 hover:bg-white/10"><Settings className="h-4 w-4" /> إعداد الوكلاء</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {agents.map(agent => {
                const AgentIcon = agent.icon;
                return (
                  <article key={agent.id} className={`group rounded-3xl border border-white/10 ${themeClasses.border} bg-white/[0.04] p-5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${themeClasses.soft}`}>
                        <AgentIcon className={`h-5 w-5 ${themeClasses.text}`} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {statusBadge(agent.status)}
                          <h4 className="font-black text-white">{agent.name}</h4>
                        </div>
                        <p className="mt-2 text-xs font-medium leading-6 text-slate-500">{agent.role}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-right"><p className="text-[10px] font-bold text-slate-600">قائمة الانتظار</p><p className="mt-1 text-xl font-black text-slate-200">{agent.queue}</p></div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-right"><p className="text-[10px] font-bold text-slate-600">مؤشر الدقة</p><p className={`mt-1 text-xl font-black ${themeClasses.text}`}>{agent.accuracy}%</p></div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-5 xl:col-span-4">
            <div className={`rounded-[2rem] border border-white/10 ${themeClasses.border} bg-white/[0.04] p-6`}>
              <div className="flex items-center justify-between gap-3"><Database className={`h-6 w-6 ${themeClasses.text}`} /><div className="text-right"><p className="text-xs font-bold text-slate-500">العقل المؤسسي</p><h3 className="text-xl font-black text-white">قاعدة معرفة أراك</h3></div></div>
              <div className="mt-5 space-y-3">
                {[
                  ['الهوية والأدلة المؤسسية', 72],
                  ['البرامج والحقائب التدريبية', 46],
                  ['المشاريع والتقارير السابقة', 39],
                  ['سياسات الجودة والاعتماد', 28],
                ].map(([label, count]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3"><span className={`text-sm font-black ${themeClasses.text}`}>{count}</span><span className="text-xs font-bold text-slate-400">{label}</span></div>
                ))}
              </div>
              <button className={`mt-5 w-full rounded-2xl bg-gradient-to-l ${themeClasses.gradient} px-4 py-3 text-sm font-black text-white shadow-lg`}>إضافة ملفات إلى ذاكرة أراك</button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between"><AlertTriangle className="h-6 w-6 text-amber-400" /><div className="text-right"><p className="text-xs font-bold text-slate-500">تحتاج تدخلاً</p><h3 className="text-xl font-black text-white">قرارات اليوم</h3></div></div>
              <div className="mt-4 space-y-3">
                {approvals.filter(item => item.level !== 'auto').slice(0, 3).map(item => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-right"><p className="text-sm font-black leading-6 text-slate-200">{item.title}</p><p className="mt-2 text-[11px] font-bold text-slate-600">{item.due}</p></div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {contentPipeline.map(item => {
              const ItemIcon = item.icon;
              return (
                <article key={item.stage} className={`rounded-3xl border border-white/10 ${themeClasses.border} bg-white/[0.04] p-5`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${themeClasses.soft}`}><ItemIcon className={`h-5 w-5 ${themeClasses.text}`} /></div>
                    <div className="text-right"><p className="text-3xl font-black text-white">{item.value}</p><h4 className="text-sm font-black text-slate-200">{item.stage}</h4></div>
                  </div>
                  <p className="mt-4 border-t border-white/10 pt-3 text-xs font-medium text-slate-500">{item.note}</p>
                </article>
              );
            })}
          </div>

          <div className={`rounded-[2rem] border border-white/10 ${themeClasses.border} bg-white/[0.04] p-6`}>
            <div className="mb-5 flex items-center justify-between"><Calendar className={`h-6 w-6 ${themeClasses.text}`} /><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>WEEKLY PUBLISHING PULSE</p><h3 className="text-2xl font-black text-white">نبض النشر الأسبوعي</h3></div></div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              {weeklyCalendar.map(day => (
                <div key={day.day} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center"><p className="text-sm font-black text-slate-300">{day.day}</p><p className={`mt-3 text-3xl font-black ${themeClasses.text}`}>{day.posts}</p><p className="text-[10px] font-bold text-slate-600">مواد محتوى</p><div className="mt-3 rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-500">{day.academy} للأكاديمية</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academy' && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {academyPrograms.map(program => {
            const progress = Math.min(100, Math.round((program.registrations / program.target) * 100));
            return (
              <article key={program.name} className={`rounded-[2rem] border border-white/10 ${themeClasses.border} bg-white/[0.04] p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 ${themeClasses.soft}`}><BookOpen className={`h-6 w-6 ${themeClasses.text}`} /></div>
                  <div className="flex-1 text-right"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black text-slate-400">{program.status}</span><h3 className="text-lg font-black text-white">{program.name}</h3></div><p className="mt-2 text-xs font-medium text-slate-500">إدارة التسجيل والحملة والجودة وملف البرنامج</p></div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center"><p className="text-2xl font-black text-white">{program.registrations}</p><p className="text-[10px] font-bold text-slate-600">مسجل</p></div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center"><p className="text-2xl font-black text-white">{program.target}</p><p className="text-[10px] font-bold text-slate-600">المستهدف</p></div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center"><p className={`text-2xl font-black ${themeClasses.text}`}>{program.quality}%</p><p className="text-[10px] font-bold text-slate-600">الجودة</p></div>
                </div>
                <div className="mt-5"><div className="mb-2 flex items-center justify-between text-xs font-bold"><span className={themeClasses.text}>{progress}%</span><span className="text-slate-500">تحقيق مستهدف التسجيل</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full bg-gradient-to-l ${themeClasses.gradient}`} style={{ width: `${progress}%` }} /></div></div>
              </article>
            );
          })}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {approvals.map(item => (
            <article key={item.title} className={`rounded-3xl border border-white/10 ${themeClasses.border} bg-white/[0.04] p-5`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                  <button className={`rounded-xl bg-gradient-to-l ${themeClasses.gradient} px-4 py-2.5 text-xs font-black text-white`}>فتح القرار</button>
                  {item.level !== 'auto' && <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-black text-slate-400">إعادة للوكيل</button>}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">{approvalBadge(item.level)}<span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-bold text-slate-500">{item.entity}</span></div>
                  <h3 className="mt-3 text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-1 text-xs font-medium leading-6 text-slate-500">{item.reason}</p>
                  <div className="mt-3 flex items-center justify-end gap-2 text-[11px] font-bold text-slate-600"><Clock3 className="h-3.5 w-3.5" /> {item.due}</div>
                </div>
              </div>
            </article>
          ))}
          <div className="rounded-3xl border border-emerald-500/15 bg-emerald-500/5 p-5 text-right"><div className="flex items-center justify-end gap-3"><div><h4 className="font-black text-emerald-300">الحوكمة تعمل قبل السرعة</h4><p className="mt-1 text-xs leading-6 text-emerald-200/60">المحتوى الأخضر فقط يمكن أن ينتقل إلى النشر الآلي. الأصفر والأحمر يبقيان في مركز الاعتمادات حتى صدور القرار.</p></div><CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-400" /></div></div>
        </div>
      )}

      <footer className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs font-bold text-slate-600 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-2"><Users className="h-4 w-4" /> الإشراف البشري محفوظ في القرارات الحساسة</span>
        <span className="flex items-center gap-2"><Bot className="h-4 w-4" /> المشرف التنفيذي الذكي · جاهز للربط بخدمات OpenAI</span>
      </footer>
    </div>
  );
}
