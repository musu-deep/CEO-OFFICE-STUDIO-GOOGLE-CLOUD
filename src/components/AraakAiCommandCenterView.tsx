import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  FilePlus2,
  GraduationCap,
  History,
  Loader2,
  Megaphone,
  Newspaper,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  XCircle,
} from 'lucide-react';
import type { PlatformTheme } from '../types';
import {
  araakAiClient,
  type AraakAcademyProgram,
  type AraakAgentRunResult,
  type AraakAgentStatus,
  type AraakAgentSummary,
  type AraakApprovalItem,
  type AraakApprovalStatus,
  type AraakAuditEntry,
  type AraakCommandCenterDashboard,
  type AraakContentItem,
} from '../services/araakAiClient';

type CommandCenterTab = 'overview' | 'content' | 'academy' | 'approvals' | 'audit';

interface AraakAiCommandCenterViewProps {
  theme: PlatformTheme;
}

const fallbackAgents: AraakAgentSummary[] = [
  { id: 'supervisor', name: 'المشرف التنفيذي الذكي', role: 'توزيع المهام والمراجعة والتصعيد', status: 'active', queueSize: 6, accuracyScore: 96 },
  { id: 'strategy', name: 'وكيل الاستراتيجية والتحرير', role: 'الخطة التحريرية والحملات', status: 'active', queueSize: 8, accuracyScore: 94 },
  { id: 'radar', name: 'وكيل الرصد والفرص', role: 'الأخبار والمنح وفرص الشراكات', status: 'active', queueSize: 14, accuracyScore: 91 },
  { id: 'writer', name: 'وكيل صناعة المحتوى', role: 'الكتابة وإعادة التوظيف متعدد القنوات', status: 'active', queueSize: 11, accuracyScore: 95 },
  { id: 'governance', name: 'وكيل التدقيق والحوكمة', role: 'اللغة والحقائق والهوية والمخاطر', status: 'review', queueSize: 5, accuracyScore: 98 },
  { id: 'publisher', name: 'وكيل النشر والتوزيع', role: 'الجدولة والنشر بعد الاعتماد', status: 'paused', queueSize: 9, accuracyScore: 99 },
  { id: 'academy', name: 'وكيل أكاديمية أراك', role: 'البرامج والمدربون والمتدربون والجودة', status: 'active', queueSize: 7, accuracyScore: 93 },
  { id: 'analytics', name: 'وكيل التحليل والتحسين', role: 'قياس الأداء والتوصيات', status: 'active', queueSize: 4, accuracyScore: 96 },
];

const fallbackDashboard: AraakCommandCenterDashboard = {
  activeAgents: 6,
  queuedJobs: 64,
  reviewAccuracy: 95,
  publishedContentThisMonth: 38,
  activeAcademyPrograms: 4,
  pendingApprovals: 2,
  mode: 'supervised',
  autoPublish: false,
  agents: fallbackAgents,
};

const agentIcons: Record<string, typeof Bot> = {
  supervisor: Brain,
  strategy: Workflow,
  radar: Newspaper,
  writer: Megaphone,
  governance: ShieldCheck,
  publisher: Send,
  academy: GraduationCap,
  analytics: BarChart3,
};

const tabs: Array<{ id: CommandCenterTab; label: string; icon: typeof Bot }> = [
  { id: 'overview', label: 'نظرة عامة', icon: Sparkles },
  { id: 'content', label: 'مصنع المحتوى', icon: Megaphone },
  { id: 'academy', label: 'أكاديمية أراك', icon: GraduationCap },
  { id: 'approvals', label: 'الاعتمادات', icon: ShieldCheck },
  { id: 'audit', label: 'سجل التدقيق', icon: History },
];

const formatDate = (value?: string) => {
  if (!value) return 'لم يُسجل بعد';
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
};

export default function AraakAiCommandCenterView({ theme }: AraakAiCommandCenterViewProps) {
  const [activeTab, setActiveTab] = useState<CommandCenterTab>('overview');
  const [dashboard, setDashboard] = useState<AraakCommandCenterDashboard>(fallbackDashboard);
  const [agents, setAgents] = useState<AraakAgentSummary[]>(fallbackAgents);
  const [contentItems, setContentItems] = useState<AraakContentItem[]>([]);
  const [programs, setPrograms] = useState<AraakAcademyProgram[]>([]);
  const [approvals, setApprovals] = useState<AraakApprovalItem[]>([]);
  const [auditLog, setAuditLog] = useState<AraakAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [selectedAgentId, setSelectedAgentId] = useState('supervisor');
  const [instruction, setInstruction] = useState('حلّل خطة محتوى أراك للأسبوع القادم، وحدد الأولويات والمواد التي تحتاج اعتماداً إدارياً أو تنفيذياً.');
  const [runningAgent, setRunningAgent] = useState(false);
  const [lastRun, setLastRun] = useState<AraakAgentRunResult | null>(null);

  const [briefTitle, setBriefTitle] = useState('');
  const [briefObjective, setBriefObjective] = useState('');
  const [briefAudience, setBriefAudience] = useState('');
  const [briefChannels, setBriefChannels] = useState('LinkedIn, X, WhatsApp, الموقع');
  const [creatingBrief, setCreatingBrief] = useState(false);

  const [programName, setProgramName] = useState('');
  const [programTarget, setProgramTarget] = useState('40');
  const [creatingProgram, setCreatingProgram] = useState(false);

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

  const loadAll = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [nextDashboard, nextContent, nextPrograms, nextApprovals, nextAudit] = await Promise.all([
        araakAiClient.getDashboard(),
        araakAiClient.getContent(),
        araakAiClient.getAcademyPrograms(),
        araakAiClient.getApprovals(),
        araakAiClient.getAuditLog(60),
      ]);

      setDashboard(nextDashboard);
      setAgents(nextDashboard.agents);
      setContentItems(nextContent);
      setPrograms(nextPrograms);
      setApprovals(nextApprovals);
      setAuditLog(nextAudit);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر الاتصال بخدمات منظومة نماء.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const contentPipeline = useMemo(() => {
    const count = (status: AraakContentItem['status']) => contentItems.filter(item => item.status === status).length;
    return [
      { label: 'ملخصات جديدة', value: count('brief'), icon: Newspaper },
      { label: 'قيد الإنتاج', value: count('production'), icon: Sparkles },
      { label: 'قيد المراجعة', value: count('review'), icon: Eye },
      { label: 'بانتظار الاعتماد', value: count('approval'), icon: Clock3 },
      { label: 'مجدول', value: count('scheduled'), icon: Calendar },
      { label: 'منشور', value: dashboard.publishedContentThisMonth, icon: Send },
    ];
  }, [contentItems, dashboard.publishedContentThisMonth]);

  const updateAgentStatus = async (agent: AraakAgentSummary) => {
    const nextStatus: AraakAgentStatus = agent.status === 'paused' || agent.status === 'error' ? 'active' : 'paused';
    setError('');

    try {
      const updated = await araakAiClient.updateAgentStatus(agent.id, nextStatus);
      setAgents(previous => previous.map(item => (item.id === updated.id ? updated : item)));
      await loadAll(true);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'تعذر تحديث حالة الوكيل.');
    }
  };

  const runSelectedAgent = async () => {
    if (!instruction.trim()) {
      setError('اكتب توجيهاً واضحاً قبل تشغيل الوكيل.');
      return;
    }

    setRunningAgent(true);
    setLastRun(null);
    setError('');

    try {
      const result = await araakAiClient.runAgent(selectedAgentId, instruction.trim());
      setLastRun(result);
      await loadAll(true);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'تعذر تشغيل الوكيل.');
    } finally {
      setRunningAgent(false);
    }
  };

  const createBrief = async () => {
    if (!briefTitle.trim() || !briefObjective.trim() || !briefAudience.trim()) {
      setError('أكمل عنوان المحتوى وهدفه والجمهور المستهدف.');
      return;
    }

    setCreatingBrief(true);
    setError('');

    try {
      await araakAiClient.createContentBrief({
        title: briefTitle.trim(),
        objective: briefObjective.trim(),
        audience: briefAudience.trim(),
        channels: briefChannels.split(',').map(item => item.trim()).filter(Boolean),
        formats: ['منشور', 'مقال', 'نص فيديو', 'رسالة ترويجية'],
      });
      setBriefTitle('');
      setBriefObjective('');
      setBriefAudience('');
      await loadAll(true);
    } catch (briefError) {
      setError(briefError instanceof Error ? briefError.message : 'تعذر إنشاء ملخص المحتوى.');
    } finally {
      setCreatingBrief(false);
    }
  };

  const createProgram = async () => {
    const target = Number(programTarget);
    if (!programName.trim() || !Number.isFinite(target) || target <= 0) {
      setError('أدخل اسم البرنامج ومستهدف تسجيل صحيحاً.');
      return;
    }

    setCreatingProgram(true);
    setError('');

    try {
      await araakAiClient.createAcademyProgram(programName.trim(), target);
      setProgramName('');
      setProgramTarget('40');
      await loadAll(true);
    } catch (programError) {
      setError(programError instanceof Error ? programError.message : 'تعذر إنشاء البرنامج.');
    } finally {
      setCreatingProgram(false);
    }
  };

  const decideApproval = async (approvalId: string, status: Exclude<AraakApprovalStatus, 'pending'>) => {
    setError('');
    try {
      await araakAiClient.decideApproval({ approvalId, status });
      await loadAll(true);
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : 'تعذر حفظ قرار الاعتماد.');
    }
  };

  const statusBadge = (status: AraakAgentStatus) => {
    if (status === 'active') return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-400"><Play className="h-3 w-3" /> يعمل</span>;
    if (status === 'review') return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-black text-amber-400"><Eye className="h-3 w-3" /> مراجعة</span>;
    if (status === 'error') return <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-black text-rose-400"><AlertTriangle className="h-3 w-3" /> خطأ</span>;
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-[11px] font-black text-slate-400"><Pause className="h-3 w-3" /> متوقف آمن</span>;
  };

  const approvalBadge = (level: AraakApprovalItem['level']) => {
    if (level === 'green') return <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-black text-emerald-400">أخضر · اعتماد آلي</span>;
    if (level === 'yellow') return <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-black text-amber-400">أصفر · اعتماد إداري</span>;
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
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-bold text-slate-400">الوضع: {dashboard.mode === 'supervised' ? 'إشراف آمن' : dashboard.mode}</span>
              <span className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${dashboard.autoPublish ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}>
                النشر الخارجي: {dashboard.autoPublish ? 'مفعّل' : 'متوقف'}
              </span>
            </div>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">مركز القيادة الذكية للمحتوى والأكاديمية</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-400 md:text-base">غرفة عمليات موحدة تخطط وتنتج وتدقق وتجدول وتقيس محتوى مجموعة أراك، وتدير دورة برامج أكاديمية أراك من الفكرة حتى قياس الأثر.</p>
          </div>

          <button
            type="button"
            onClick={() => void loadAll(true)}
            disabled={refreshing}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l ${themeClasses.gradient} px-5 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60`}
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            تحديث غرفة العمليات
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-bold leading-6 text-rose-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${selected ? `${themeClasses.soft} ${themeClasses.text} border border-white/10` : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.035]">
          <div className="text-center">
            <Loader2 className={`mx-auto h-10 w-10 animate-spin ${themeClasses.text}`} />
            <p className="mt-4 text-sm font-black text-slate-400">جاري تشغيل غرفة العمليات...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                {[
                  ['وكلاء نشطون', dashboard.activeAgents, Bot],
                  ['مهام في الطابور', dashboard.queuedJobs, Activity],
                  ['دقة المراجعة', `${dashboard.reviewAccuracy}%`, ShieldCheck],
                  ['منشور هذا الشهر', dashboard.publishedContentThisMonth, Send],
                  ['برامج نشطة', dashboard.activeAcademyPrograms, GraduationCap],
                  ['اعتمادات معلقة', dashboard.pendingApprovals, Clock3],
                ].map(([label, value, Icon]) => {
                  const CardIcon = Icon as typeof Bot;
                  return (
                    <div key={String(label)} className={`rounded-3xl border border-white/10 ${themeClasses.border} bg-white/[0.045] p-5 shadow-xl shadow-black/15`}>
                      <CardIcon className={`h-5 w-5 ${themeClasses.text}`} />
                      <p className="mt-4 text-3xl font-black text-white">{String(value)}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{String(label)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section className="xl:col-span-7 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-black ${themeClasses.text}`}>فريق الوكلاء</p>
                      <h3 className="mt-1 text-2xl font-black text-white">حالة التشغيل والاستعداد</h3>
                    </div>
                    <Database className={`h-6 w-6 ${themeClasses.text}`} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {agents.map(agent => {
                      const Icon = agentIcons[agent.id] || Bot;
                      return (
                        <article key={agent.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]">
                          <div className="flex items-start justify-between gap-3">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${themeClasses.soft}`}>
                              <Icon className={`h-5 w-5 ${themeClasses.text}`} />
                            </div>
                            <div className="min-w-0 flex-1 text-right">
                              <p className="font-black text-white">{agent.name}</p>
                              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{agent.role}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-2">
                            <button type="button" onClick={() => void updateAgentStatus(agent)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-black text-slate-300 hover:bg-white/10">
                              {agent.status === 'paused' || agent.status === 'error' ? 'تشغيل' : 'إيقاف آمن'}
                            </button>
                            {statusBadge(agent.status)}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>الدقة {agent.accuracyScore}%</span>
                            <span>{agent.queueSize} مهام</span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <section className="xl:col-span-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-5">
                    <p className={`text-xs font-black ${themeClasses.text}`}>أمر تنفيذي مباشر</p>
                    <h3 className="mt-1 text-2xl font-black text-white">شغّل أحد الوكلاء</h3>
                  </div>

                  <label className="text-xs font-black text-slate-400">الوكيل</label>
                  <select value={selectedAgentId} onChange={event => setSelectedAgentId(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm font-bold text-white outline-none">
                    {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                  </select>

                  <label className="mt-4 block text-xs font-black text-slate-400">التوجيه</label>
                  <textarea value={instruction} onChange={event => setInstruction(event.target.value)} rows={6} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium leading-7 text-white outline-none focus:border-emerald-500/40" />

                  <button type="button" onClick={() => void runSelectedAgent()} disabled={runningAgent} className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l ${themeClasses.gradient} px-5 py-3 text-sm font-black text-white disabled:opacity-60`}>
                    {runningAgent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    {runningAgent ? 'الوكيل يعمل الآن...' : 'تشغيل التوجيه تحت الإشراف'}
                  </button>

                  {lastRun && (
                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <div className="flex items-center justify-between gap-3 text-[11px] font-black text-emerald-300">
                        <span>{lastRun.provider}{lastRun.simulated ? ' · محاكاة آمنة' : ' · تشغيل فعلي'}</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-200">{lastRun.output}</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {contentPipeline.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                      <Icon className={`h-5 w-5 ${themeClasses.text}`} />
                      <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section className="xl:col-span-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center gap-3">
                    <FilePlus2 className={`h-6 w-6 ${themeClasses.text}`} />
                    <div>
                      <p className={`text-xs font-black ${themeClasses.text}`}>توجيه جديد</p>
                      <h3 className="text-2xl font-black text-white">إنشاء ملخص محتوى</h3>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <input value={briefTitle} onChange={event => setBriefTitle(event.target.value)} placeholder="عنوان المحتوى أو الحملة" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none" />
                    <textarea value={briefObjective} onChange={event => setBriefObjective(event.target.value)} placeholder="الهدف التنفيذي" rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none" />
                    <input value={briefAudience} onChange={event => setBriefAudience(event.target.value)} placeholder="الجمهور المستهدف" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none" />
                    <input value={briefChannels} onChange={event => setBriefChannels(event.target.value)} placeholder="القنوات مفصولة بفواصل" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none" />
                    <button type="button" onClick={() => void createBrief()} disabled={creatingBrief} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l ${themeClasses.gradient} px-5 py-3 text-sm font-black text-white disabled:opacity-60`}>
                      {creatingBrief ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      إرسال الملخص إلى المشرف التنفيذي
                    </button>
                  </div>
                </section>

                <section className="xl:col-span-7 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-5">
                    <p className={`text-xs font-black ${themeClasses.text}`}>خط الإنتاج</p>
                    <h3 className="mt-1 text-2xl font-black text-white">المواد الحالية</h3>
                  </div>
                  <div className="space-y-3">
                    {contentItems.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm font-bold text-slate-500">لا توجد مواد محفوظة بعد.</p>
                    ) : contentItems.map(item => (
                      <article key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div>
                            <p className="font-black text-white">{item.title}</p>
                            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{item.objective}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.channels.map(channel => <span key={channel} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black text-slate-400">{channel}</span>)}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            {approvalBadge(item.approvalLevel)}
                            <span className="text-[11px] font-black text-slate-500">{item.status}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'academy' && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <section className="xl:col-span-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className={`h-6 w-6 ${themeClasses.text}`} />
                  <div>
                    <p className={`text-xs font-black ${themeClasses.text}`}>تطوير أكاديمي</p>
                    <h3 className="text-2xl font-black text-white">إضافة برنامج</h3>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <input value={programName} onChange={event => setProgramName(event.target.value)} placeholder="اسم البرنامج" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none" />
                  <input value={programTarget} onChange={event => setProgramTarget(event.target.value)} type="number" min="1" placeholder="مستهدف التسجيل" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none" />
                  <button type="button" onClick={() => void createProgram()} disabled={creatingProgram} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l ${themeClasses.gradient} px-5 py-3 text-sm font-black text-white disabled:opacity-60`}>
                    {creatingProgram ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                    إنشاء البرنامج ومسار الإطلاق
                  </button>
                </div>
                <div className="mt-5 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs font-bold leading-6 text-amber-200">
                  ينشئ الوكيل بطاقة البرنامج ومخرجات التعلم وخطة التسويق والجودة، ويبقي الأسعار والاعتمادات والشهادات تحت المراجعة البشرية.
                </div>
              </section>

              <section className="xl:col-span-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-black ${themeClasses.text}`}>محفظة الأكاديمية</p>
                    <h3 className="mt-1 text-2xl font-black text-white">البرامج والتسجيل والجودة</h3>
                  </div>
                  <Users className={`h-6 w-6 ${themeClasses.text}`} />
                </div>
                <div className="space-y-4">
                  {programs.map(program => {
                    const progress = Math.min(100, Math.round((program.registrations / Math.max(program.target, 1)) * 100));
                    return (
                      <article key={program.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div>
                            <p className="text-lg font-black text-white">{program.name}</p>
                            <p className="mt-1 text-xs font-bold text-slate-500">{program.status}</p>
                          </div>
                          <span className={`rounded-full border border-white/10 ${themeClasses.soft} px-3 py-1 text-xs font-black ${themeClasses.text}`}>جودة {program.qualityScore}%</span>
                        </div>
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">
                            <span>{progress}% من المستهدف</span>
                            <span>{program.registrations} / {program.target} مسجلاً</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                            <div className={`h-full rounded-full bg-gradient-to-l ${themeClasses.gradient}`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-xs font-bold leading-6 text-slate-400">المحطة التالية: {program.nextMilestone}</p>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'approvals' && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className={`text-xs font-black ${themeClasses.text}`}>حوكمة القرار</p>
                  <h3 className="mt-1 text-2xl font-black text-white">مركز الاعتمادات</h3>
                </div>
                <ShieldCheck className={`h-7 w-7 ${themeClasses.text}`} />
              </div>
              <div className="space-y-3">
                {approvals.map(approval => (
                  <article key={approval.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          {approvalBadge(approval.level)}
                          <span className="text-[11px] font-black text-slate-500">{approval.entity}</span>
                        </div>
                        <p className="mt-3 text-lg font-black text-white">{approval.title}</p>
                        <p className="mt-1 text-xs font-bold leading-6 text-slate-500">{approval.reason}</p>
                        <p className="mt-2 text-[11px] font-bold text-slate-600">الاستحقاق: {formatDate(approval.dueAt)}</p>
                      </div>

                      {approval.status === 'pending' ? (
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => void decideApproval(approval.id, 'approved')} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-300"><CheckCircle2 className="h-4 w-4" /> اعتماد</button>
                          <button type="button" onClick={() => void decideApproval(approval.id, 'returned')} className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-black text-amber-300"><RotateCcw className="h-4 w-4" /> إعادة للمراجعة</button>
                          <button type="button" onClick={() => void decideApproval(approval.id, 'rejected')} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-black text-rose-300"><XCircle className="h-4 w-4" /> رفض</button>
                        </div>
                      ) : (
                        <span className={`rounded-full border px-4 py-2 text-xs font-black ${approval.status === 'approved' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : approval.status === 'returned' ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-rose-500/20 bg-rose-500/10 text-rose-300'}`}>
                          {approval.status === 'approved' ? 'تم الاعتماد' : approval.status === 'returned' ? 'أعيد للمراجعة' : 'مرفوض'}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'audit' && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className={`text-xs font-black ${themeClasses.text}`}>المساءلة والشفافية</p>
                  <h3 className="mt-1 text-2xl font-black text-white">سجل أعمال الوكلاء والقرارات</h3>
                </div>
                <History className={`h-7 w-7 ${themeClasses.text}`} />
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[850px] text-right text-sm">
                  <thead className="bg-black/35 text-xs font-black text-slate-400">
                    <tr>
                      <th className="px-4 py-3">الوقت</th>
                      <th className="px-4 py-3">الفاعل</th>
                      <th className="px-4 py-3">الإجراء</th>
                      <th className="px-4 py-3">الهدف</th>
                      <th className="px-4 py-3">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {auditLog.map(entry => (
                      <tr key={entry.id} className="bg-white/[0.02] text-slate-300 hover:bg-white/[0.05]">
                        <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-500">{formatDate(entry.timestamp)}</td>
                        <td className="px-4 py-3 font-black text-white">{entry.actor}</td>
                        <td className="px-4 py-3 text-xs font-bold">{entry.action}</td>
                        <td className="px-4 py-3 text-xs font-bold">{entry.target}</td>
                        <td className="max-w-md px-4 py-3 text-xs font-medium leading-6 text-slate-500">{entry.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
