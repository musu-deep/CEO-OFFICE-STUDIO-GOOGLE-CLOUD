import crypto from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { GoogleGenAI } from '@google/genai';

type AgentStatus = 'active' | 'review' | 'paused' | 'error';
type ApprovalLevel = 'green' | 'yellow' | 'red';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'returned';

type NamaAgent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  queueSize: number;
  accuracyScore: number;
  lastRunAt?: string;
};

type ContentItem = {
  id: string;
  title: string;
  objective: string;
  audience: string;
  channels: string[];
  formats: string[];
  status: 'brief' | 'production' | 'review' | 'approval' | 'scheduled' | 'published';
  approvalLevel: ApprovalLevel;
  createdAt: string;
};

type ApprovalItem = {
  id: string;
  title: string;
  entity: string;
  reason: string;
  level: ApprovalLevel;
  status: ApprovalStatus;
  dueAt: string;
  decidedAt?: string;
  note?: string;
};

type AcademyProgram = {
  id: string;
  name: string;
  registrations: number;
  target: number;
  status: string;
  qualityScore: number;
  nextMilestone: string;
};

type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
};

const agents: NamaAgent[] = [
  { id: 'supervisor', name: 'المشرف التنفيذي الذكي', role: 'توزيع المهام والمراجعة والتصعيد', status: 'active', queueSize: 6, accuracyScore: 96 },
  { id: 'strategy', name: 'وكيل الاستراتيجية والتحرير', role: 'الخطة التحريرية والحملات', status: 'active', queueSize: 8, accuracyScore: 94 },
  { id: 'radar', name: 'وكيل الرصد والفرص', role: 'الأخبار والمنح وفرص الشراكات', status: 'active', queueSize: 14, accuracyScore: 91 },
  { id: 'writer', name: 'وكيل صناعة المحتوى', role: 'الكتابة وإعادة التوظيف متعدد القنوات', status: 'active', queueSize: 11, accuracyScore: 95 },
  { id: 'governance', name: 'وكيل التدقيق والحوكمة', role: 'اللغة والحقائق والهوية والمخاطر', status: 'review', queueSize: 5, accuracyScore: 98 },
  { id: 'publisher', name: 'وكيل النشر والتوزيع', role: 'الجدولة والنشر بعد الاعتماد', status: 'paused', queueSize: 9, accuracyScore: 99 },
  { id: 'academy', name: 'وكيل أكاديمية أراك', role: 'البرامج والمدربون والمتدربون والجودة', status: 'active', queueSize: 7, accuracyScore: 93 },
  { id: 'analytics', name: 'وكيل التحليل والتحسين', role: 'قياس الأداء والتوصيات', status: 'active', queueSize: 4, accuracyScore: 96 },
];

const contentItems: ContentItem[] = [
  {
    id: 'content_1',
    title: 'حملة برنامج الذكاء الاصطناعي للقيادات التنموية',
    objective: 'رفع التسجيلات وإبراز القيمة التطبيقية للبرنامج',
    audience: 'القيادات التنفيذية في القطاع التنموي وغير الربحي',
    channels: ['LinkedIn', 'X', 'WhatsApp', 'الموقع'],
    formats: ['مقال', 'منشور', 'نص فيديو', 'رسالة تسجيل'],
    status: 'approval',
    approvalLevel: 'yellow',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'content_2',
    title: 'قصاصات السيرة النبوية: حسن الخلق',
    objective: 'تقديم محتوى قيمي يومي متسق مع رسالة أراك',
    audience: 'الجمهور العام والمهتمون بالتنمية القيمية',
    channels: ['X', 'Instagram', 'LinkedIn'],
    formats: ['بطاقة معرفية', 'منشور مختصر'],
    status: 'scheduled',
    approvalLevel: 'green',
    createdAt: new Date().toISOString(),
  },
];

const approvals: ApprovalItem[] = [
  {
    id: 'approval_1',
    title: 'إطلاق حملة برنامج الذكاء الاصطناعي للقيادات',
    entity: 'أكاديمية أراك',
    reason: 'يتضمن سعر البرنامج وجدول التنفيذ',
    level: 'yellow',
    status: 'pending',
    dueAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'approval_2',
    title: 'منشور رأي مؤسسي حول استدامة المشاريع التنموية',
    entity: 'مجموعة أراك للتنمية',
    reason: 'يمثل موقفاً مؤسسياً باسم المجموعة',
    level: 'red',
    status: 'pending',
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'approval_3',
    title: 'إعادة نشر قصاصة معرفية من محتوى سابق',
    entity: 'إدارة المحتوى',
    reason: 'مادة معتمدة بلا بيانات حساسة',
    level: 'green',
    status: 'approved',
    dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
];

const academyPrograms: AcademyProgram[] = [
  { id: 'program_1', name: 'إعداد المشاريع التنموية', registrations: 68, target: 80, status: 'التسجيل مفتوح', qualityScore: 92, nextMilestone: 'إغلاق التسجيل وبناء مجموعات المتدربين' },
  { id: 'program_2', name: 'الذكاء الاصطناعي للقيادات التنموية', registrations: 54, target: 60, status: 'قارب على الاكتمال', qualityScore: 95, nextMilestone: 'اعتماد جدول اللقاءات وإرسال دليل المتدرب' },
  { id: 'program_3', name: 'تدريب المدربين RTOT', registrations: 31, target: 45, status: 'الحملة نشطة', qualityScore: 90, nextMilestone: 'رفع معدل التحويل من الاستفسار إلى التسجيل' },
  { id: 'program_4', name: 'البناء القيادي – نماذج تطبيقية', registrations: 22, target: 40, status: 'قيد الإطلاق', qualityScore: 88, nextMilestone: 'اعتماد صفحة البرنامج والحملة الإعلانية' },
];

const auditLog: AuditEntry[] = [
  {
    id: 'audit_bootstrap',
    actor: 'system',
    action: 'command_center_initialized',
    target: 'ARAAK NAMA AI',
    timestamp: new Date().toISOString(),
    details: 'بدأت المنظومة في وضع الإشراف الآمن، والنشر الخارجي متوقف افتراضياً.',
  },
];

const makeId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
const now = () => new Date().toISOString();

const addAudit = (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
  auditLog.unshift({ id: makeId('audit'), timestamp: now(), ...entry });
  if (auditLog.length > 250) auditLog.length = 250;
};

const extractOpenAIText = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') return '';
  const data = payload as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };

  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();

  return (data.output || [])
    .flatMap(item => item.content || [])
    .map(item => item.text || '')
    .filter(Boolean)
    .join('\n')
    .trim();
};

async function executeWithAvailableModel(agent: NamaAgent, instruction: string) {
  const systemInstruction = `أنت ${agent.name} ضمن منظومة ARAAK NAMA AI التابعة لمجموعة أراك للتنمية.\nمهمتك: ${agent.role}.\nاعمل باللغة العربية المهنية، وقدّم مخرجاً تنفيذياً منظماً ومختصراً.\nلا تنشر خارجياً ولا تعتمد سعراً أو شريكاً أو موقفاً مؤسسياً. صنّف أي قرار حساس بوضوح على أنه يحتاج اعتماداً بشرياً.`;

  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  if (openAIKey) {
    const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/responses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions: systemInstruction,
        input: instruction,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${errorText.slice(0, 300)}`);
    }

    const payload = await response.json();
    const output = extractOpenAIText(payload);
    if (output) return { output, provider: 'openai', simulated: false };
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey && geminiKey !== 'MY_GEMINI_API_KEY') {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: instruction }] }],
      config: { systemInstruction, temperature: 0.45 },
    });
    if (response.text?.trim()) return { output: response.text.trim(), provider: 'gemini', simulated: false };
  }

  return {
    provider: 'local-safe-fallback',
    simulated: true,
    output: `تم استلام التوجيه بواسطة ${agent.name}.\n\nالخطة التنفيذية المقترحة:\n1. تحليل الهدف والجمهور والمخرجات المطلوبة.\n2. تجهيز مسودة أولية وربطها بهوية أراك وقاعدة المعرفة.\n3. تمرير المخرج لوكيل التدقيق والحوكمة.\n4. تصنيف الاعتماد قبل الجدولة أو النشر.\n\nالتوجيه: ${instruction}\n\nالحالة: جاهز للتنفيذ تحت الإشراف البشري.`,
  };
}

export function createNamaRouter() {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'ARAAK NAMA AI',
      mode: process.env.ARAAK_AI_MODE || 'supervised',
      autoPublish: process.env.ARAAK_AUTO_PUBLISH === 'true',
      timestamp: now(),
    });
  });

  router.get('/dashboard', (_req: Request, res: Response) => {
    const pendingApprovals = approvals.filter(item => item.status === 'pending').length;
    const publishedContentThisMonth = 38 + contentItems.filter(item => item.status === 'published').length;

    res.json({
      activeAgents: agents.filter(agent => agent.status === 'active').length,
      queuedJobs: agents.reduce((sum, agent) => sum + agent.queueSize, 0),
      reviewAccuracy: Math.round(agents.reduce((sum, agent) => sum + agent.accuracyScore, 0) / agents.length),
      publishedContentThisMonth,
      activeAcademyPrograms: academyPrograms.length,
      pendingApprovals,
      mode: process.env.ARAAK_AI_MODE || 'supervised',
      autoPublish: process.env.ARAAK_AUTO_PUBLISH === 'true',
      agents,
    });
  });

  router.get('/agents', (_req: Request, res: Response) => res.json(agents));

  router.patch('/agents/:agentId/status', (req: Request, res: Response) => {
    const agent = agents.find(item => item.id === req.params.agentId);
    const status = req.body?.status as AgentStatus | undefined;
    const allowedStatuses: AgentStatus[] = ['active', 'review', 'paused', 'error'];

    if (!agent) return res.status(404).json({ message: 'الوكيل المطلوب غير موجود.' });
    if (!status || !allowedStatuses.includes(status)) return res.status(400).json({ message: 'حالة الوكيل غير صالحة.' });

    agent.status = status;
    addAudit({ actor: 'dashboard-user', action: 'agent_status_changed', target: agent.id, details: status });
    return res.json(agent);
  });

  router.post('/agents/:agentId/run', async (req: Request, res: Response) => {
    const agent = agents.find(item => item.id === req.params.agentId);
    const instruction = String(req.body?.instruction || '').trim();

    if (!agent) return res.status(404).json({ message: 'الوكيل المطلوب غير موجود.' });
    if (!instruction) return res.status(400).json({ message: 'اكتب توجيهاً واضحاً للوكيل.' });
    if (agent.status === 'paused') return res.status(409).json({ message: 'الوكيل متوقف حالياً. فعّله قبل التشغيل.' });

    const runId = makeId('run');
    agent.queueSize += 1;
    agent.lastRunAt = now();
    addAudit({ actor: 'dashboard-user', action: 'agent_run_started', target: agent.id, details: instruction.slice(0, 220) });

    try {
      const result = await executeWithAvailableModel(agent, instruction);
      agent.queueSize = Math.max(0, agent.queueSize - 1);
      addAudit({ actor: agent.id, action: 'agent_run_completed', target: runId, details: result.provider });
      return res.json({ runId, status: 'completed', ...result, completedAt: now() });
    } catch (error) {
      agent.queueSize = Math.max(0, agent.queueSize - 1);
      agent.status = 'error';
      const message = error instanceof Error ? error.message : 'حدث خطأ غير معروف أثناء تشغيل الوكيل.';
      addAudit({ actor: agent.id, action: 'agent_run_failed', target: runId, details: message.slice(0, 220) });
      return res.status(502).json({ message: 'تعذر تشغيل مزود الذكاء الاصطناعي.', details: message });
    }
  });

  router.get('/content', (_req: Request, res: Response) => res.json(contentItems));

  router.post('/content/brief', (req: Request, res: Response) => {
    const title = String(req.body?.title || '').trim();
    const objective = String(req.body?.objective || '').trim();
    const audience = String(req.body?.audience || '').trim();
    const channels = Array.isArray(req.body?.channels) ? req.body.channels.map(String) : [];
    const formats = Array.isArray(req.body?.formats) ? req.body.formats.map(String) : [];

    if (!title || !objective || !audience) {
      return res.status(400).json({ message: 'العنوان والهدف والجمهور حقول مطلوبة.' });
    }

    const item: ContentItem = {
      id: makeId('content'),
      title,
      objective,
      audience,
      channels,
      formats,
      status: 'brief',
      approvalLevel: 'yellow',
      createdAt: now(),
    };

    contentItems.unshift(item);
    const supervisor = agents.find(agent => agent.id === 'supervisor');
    if (supervisor) supervisor.queueSize += 1;
    addAudit({ actor: 'dashboard-user', action: 'content_brief_created', target: item.id, details: title });
    return res.status(201).json({ contentId: item.id, status: item.status, item });
  });

  router.get('/approvals', (_req: Request, res: Response) => res.json(approvals));

  router.post('/approvals/:approvalId/decision', (req: Request, res: Response) => {
    const approval = approvals.find(item => item.id === req.params.approvalId);
    const status = req.body?.status as ApprovalStatus | undefined;
    const allowed: ApprovalStatus[] = ['approved', 'rejected', 'returned'];

    if (!approval) return res.status(404).json({ message: 'طلب الاعتماد غير موجود.' });
    if (!status || !allowed.includes(status)) return res.status(400).json({ message: 'قرار الاعتماد غير صالح.' });

    approval.status = status;
    approval.note = String(req.body?.note || '').trim() || undefined;
    approval.decidedAt = now();
    addAudit({ actor: 'dashboard-user', action: 'approval_decided', target: approval.id, details: `${status}: ${approval.note || ''}` });
    return res.json({ success: true, approval });
  });

  router.get('/academy/programs', (_req: Request, res: Response) => res.json(academyPrograms));

  router.post('/academy/programs', (req: Request, res: Response) => {
    const name = String(req.body?.name || '').trim();
    const target = Number(req.body?.target || 0);

    if (!name || !Number.isFinite(target) || target <= 0) {
      return res.status(400).json({ message: 'اسم البرنامج والمستهدف الرقمي الصحيح مطلوبان.' });
    }

    const program: AcademyProgram = {
      id: makeId('program'),
      name,
      registrations: 0,
      target,
      status: 'قيد التصميم',
      qualityScore: 0,
      nextMilestone: 'إعداد بطاقة البرنامج ومخرجات التعلم وخطة الإطلاق',
    };

    academyPrograms.unshift(program);
    addAudit({ actor: 'dashboard-user', action: 'academy_program_created', target: program.id, details: name });
    return res.status(201).json(program);
  });

  router.get('/audit', (req: Request, res: Response) => {
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 250);
    res.json(auditLog.slice(0, limit));
  });

  return router;
}
