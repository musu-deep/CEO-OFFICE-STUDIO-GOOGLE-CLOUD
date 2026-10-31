import { validateServiceCompany } from '../lib/executiveModel';
import { assignedTask } from './scopedWorkspace';
import express, { Router } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { executiveStore, actorOf } from './executiveRoutes';
import { attachmentTypes, maxAttachmentBytes, type PerformanceReport } from '../lib/performanceReports';

export function createPerformanceReportRouter() {
  const router = Router();
  router.use(express.json({ limit: '29mb' }));
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  const isOffice = (req: any) => ['ceo','admin'].includes(actorOf(req).role);
  const visible = (req: any, report: PerformanceReport) => isOffice(req) || (report.author === actorOf(req).email && (executiveStore.can(actorOf(req), report.unitId, 'read') || (!!report.taskId && !!assignedTask(actorOf(req).email,report.taskId,report.unitId))));
  router.get('/', (req, res) => res.json({ reports: (executiveStore.read().reports || []).filter(r => visible(req, r)) }));
  router.post('/', (req, res) => {
    if (process.env.NODE_ENV === 'production' && !process.env.EXECUTIVE_DATA_DIR) return res.status(503).json({ error: 'يجب تفعيل التخزين الدائم لدى مشرف المنصة قبل استقبال التقارير والمرفقات.' });
    const actor = actorOf(req), body = req.body || {};
    if (typeof body.unitId !== 'string' || (!executiveStore.can(actor, body.unitId, 'upload') && !(typeof body.taskId==='string' && assignedTask(actor.email,body.taskId,body.unitId)))) return res.status(403).json({ error: 'لا تملك صلاحية إرسال تقرير لهذه الجهة.' });
    if (body.taskId !== undefined && (typeof body.taskId !== 'string' || (!isOffice(req) && !assignedTask(actor.email,body.taskId,body.unitId)))) return res.status(403).json({error:'التكليف خارج نطاق حسابك.'});
    const text = (v: unknown, max: number) => typeof v === 'string' && !!v.trim() && v.length <= max;
    if (!text(body.title, 200) || !text(body.period, 100) || !text(body.summary, 10000) || !Array.isArray(body.attachments) || body.attachments.length > 5) return res.status(400).json({ error: 'أكمل عنوان التقرير وفترته وملخصه. الحد الأقصى خمسة مرفقات.' });
    const saved: string[] = [];
    try {
      const companyId=validateServiceCompany(body.unitId,body.companyId);
      const validated = body.attachments.map((a: any) => {
        const ext = typeof a?.name === 'string' ? a.name.split('.').pop()?.toLowerCase() : '';
        const mimeType = attachmentTypes[ext || ''];
        if (!mimeType || !text(a.name, 200) || /[\x00-\x1f/\\]/.test(a.name) || typeof a.data !== 'string' || a.data.length > 5592408 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a.data)) throw Error('مرفق غير صالح. استخدم PDF أو Word أو Excel أو صورة أو TXT أو CSV بحد أقصى 4 ميغابايت لكل ملف.');
        const bytes = Buffer.from(a.data, 'base64');
        if (!bytes.length || bytes.length > maxAttachmentBytes) throw Error('حجم المرفق غير صالح.');
        return { name: a.name, mimeType, data: a.data, size: bytes.length };
      });
      const attachments = validated.map((a: any) => { const doc = executiveStore.document(a); saved.push(doc.id); return { ...doc, size: a.size }; });
      const report: PerformanceReport = { id: crypto.randomUUID(), unitId: body.unitId, ...(companyId?{companyId}:{}), ...(body.taskId ? {taskId:body.taskId} : {}), title: body.title.trim(), period: body.period.trim(), summary: body.summary.trim(), author: actor.email, createdAt: new Date().toISOString(), status: 'submitted', attachments };
      executiveStore.update(s => { (s.reports ||= []).unshift(report); executiveStore.audit(s, actor.email, `إرسال تقرير أداء ${report.id}`, report.unitId); });
      res.status(201).json({ report });
    } catch (e: any) {
      for (const id of saved) fs.rmSync(path.join(executiveStore.dir, 'documents', id), { force: true });
      res.status(400).json({ error: e.message || 'تعذر حفظ التقرير.' });
    }
  });
  router.get('/:id/attachments/:docId', (req, res) => {
    const report = (executiveStore.read().reports || []).find(r => r.id === req.params.id);
    if (!report || !visible(req, report)) return res.status(404).json({ error: 'التقرير غير متاح.' });
    const doc = report.attachments.find(d => d.id === req.params.docId);
    if (!doc) return res.status(404).json({ error: 'المرفق غير موجود.' });
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(doc.name)}`);
    res.send(executiveStore.bytes(doc.id));
  });
  router.post('/:id/review', (req, res) => {
    if (!isOffice(req)) return res.status(403).json({ error: 'المراجعة متاحة لمكتب الرئيس التنفيذي فقط.' });
    if (!['reviewed','returned'].includes(req.body.status) || typeof req.body.note !== 'string' || req.body.note.length > 2000 || (req.body.status === 'returned' && !req.body.note.trim())) return res.status(400).json({ error: 'حدد نتيجة المراجعة وأضف ملاحظة عند إعادة التقرير.' });
    let found = false;
    executiveStore.update(s => {
      const report = s.reports?.find(r => r.id === req.params.id);
      if (!report) return;
      found = true; report.status = req.body.status; report.note = req.body.note.trim(); report.reviewedBy = actorOf(req).email; report.reviewedAt = new Date().toISOString();
      executiveStore.audit(s, actorOf(req).email, `مراجعة تقرير أداء ${report.id}`, report.unitId);
    });
    res.status(found ? 200 : 404).json(found ? { ok: true } : { error: 'التقرير غير موجود.' });
  });
  return router;
}
