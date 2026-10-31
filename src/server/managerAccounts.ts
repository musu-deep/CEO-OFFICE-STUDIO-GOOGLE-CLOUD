import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { Router } from 'express';
import { entities, resolveEntity, registrationEntities } from '../lib/executiveModel';
import { executiveStore, actorOf } from './executiveRoutes';

const scrypt = promisify(crypto.scrypt);
type Account = { email: string; name: string; title: string; unitId: string; salt: string; hash: string; status: 'pending'|'active'|'rejected'|'suspended'; createdAt: string; decidedAt?: string; decidedBy?: string };
export type AuthAvailability = { loginAvailable:boolean; registrationAvailable:boolean; registrationUnavailableReason:'storage'|'authentication'|'administration'|null };
type BootstrapAccount = { password: string; role: string };
const publicAccount = ({ salt, hash, ...account }: Account) => account;
const fail = (message: string, status = 400) => Object.assign(Error(message), { status });

export class ManagerAccounts {
  private accounts: Record<string, Account>;
  private file: string;
  constructor() {
    this.file = path.join(executiveStore.dir, 'manager-accounts.json');
    this.accounts = fs.existsSync(this.file) ? JSON.parse(fs.readFileSync(this.file, 'utf8')) : {};
  }
  private save(accounts: Record<string, Account>) {
    const temp = `${this.file}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(accounts), { mode: 0o600 });
    fs.renameSync(temp, this.file);
    this.accounts = accounts;
  }
  active(email: string) { const a = this.accounts[email]; return a?.status === 'active' ? publicAccount(a) : undefined; }
  async verify(email: string, password: string) {
    const a = this.accounts[email];
    // Equal-cost derivation for unknown and pending accounts; never disclose registration status at login.
    const hash = await scrypt(password, a?.salt || 'unknown-account-salt', 64) as Buffer;
    return a?.status === 'active' && crypto.timingSafeEqual(hash, Buffer.from(a.hash, 'hex')) ? this.active(email) : undefined;
  }
  async register(input: any, bootstrap: Record<string, BootstrapAccount>) {
    const email = String(input.email || '').trim().toLowerCase();
    const name = String(input.name || '').trim(), title = String(input.title || '').trim();
    const password = String(input.password || ''), unitId = String(input.unitId || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !name || name.length > 120 || !title || title.length > 160 || !registrationEntities().some(e=>e.id===unitId)) throw fail('أكمل الاسم والمسمى الوظيفي والبريد والجهة بصورة صحيحة.');
    if (password.length < 12 || password.length > 128) throw fail('يجب أن تكون كلمة المرور بين 12 و128 حرفًا.');
    const salt = crypto.randomBytes(24).toString('hex');
    const hash = (await scrypt(password, salt, 64) as Buffer).toString('hex');
    // Do not overwrite a pending or approved account, including concurrent submissions.
    if (bootstrap[email] || this.accounts[email]) return;
    this.save({ ...this.accounts, [email]: { email, name, title, unitId, salt, hash, status: 'pending', createdAt: new Date().toISOString() } });
  }
  list() { return Object.values(this.accounts).map(publicAccount); }
  decide(email: string, action: string, unitIds: unknown, actor: string, tasksOnly = false) {
    const a = this.accounts[email];
    if (!a) throw fail('الحساب غير موجود.', 404);
    if (!['approve','reject','suspend'].includes(action)) throw fail('إجراء غير صالح.');
    if (action === 'approve') {
      if (!Array.isArray(unitIds) || (!tasksOnly && !unitIds.length) || unitIds.some(id => typeof id !== 'string' || !resolveEntity(id))) throw fail('اختر جهة واحدة على الأقل للصلاحيات.');
      executiveStore.update(s => {
        s.grants[email] = { units: tasksOnly ? [] : [...new Set(unitIds)] as string[], actions: ['read','upload','edit'] };
        executiveStore.audit(s, actor, `اعتماد حساب مدير ${email}`);
      });
    } else {
      executiveStore.update(s => { delete s.grants[email]; executiveStore.audit(s, actor, `${action === 'reject' ? 'رفض' : 'تعليق'} حساب ${email}`); });
    }
    this.save({ ...this.accounts, [email]: { ...a, status: action === 'approve' ? 'active' : action === 'reject' ? 'rejected' : 'suspended', decidedAt: new Date().toISOString(), decidedBy: actor } });
  }
}

export function createRegistrationRouter(accounts: ManagerAccounts, bootstrap: Record<string, BootstrapAccount>, availability:()=>AuthAvailability) {
  const router = Router();
  const attempts = new Map<string, { count: number; until: number }>();
  router.use((_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
  router.get('/status',(_req,res)=>res.json(availability()));
  router.get('/registration-options', (_req, res) => res.json({ entities: registrationEntities(), ...availability() }));
  router.post('/register', async (req, res) => {
    const status=availability();
    if (!status.registrationAvailable) return res.status(503).json({ code:'REGISTRATION_UNAVAILABLE',reason:status.registrationUnavailableReason,error:status.registrationUnavailableReason==='storage'?'يجب تفعيل التخزين الدائم للحسابات لدى مشرف المنصة قبل استقبال طلبات التسجيل.':'إعداد خدمة التسجيل غير مكتمل لدى مشرف المنصة.' });
    const key = req.ip || 'unknown', now = Date.now();
    // Bound the rate-limit table without evicting live limits.
    for (const [ip, a] of attempts) if (a.until < now) attempts.delete(ip);
    if (!attempts.has(key) && attempts.size >= 10000) return res.status(429).json({ error: 'حاول لاحقًا.' });
    const attempt = attempts.get(key) || { count: 0, until: now + 60 * 60_000 };
    if (++attempt.count > 60) return res.status(429).json({ error: 'تجاوزت عدد طلبات التسجيل. حاول لاحقًا.' });
    attempts.set(key, attempt);
    try {
      await accounts.register(req.body || {}, bootstrap);
      res.status(202).json({ message: 'تم استلام الطلب. بعد اعتماد مكتب الرئيس التنفيذي يمكنك الدخول بالبريد وكلمة المرور المسجلين. إذا كان البريد مسجلًا مسبقًا فراجع المكتب.' });
    } catch (e: any) { res.status(e.status || 500).json({ error: e.status ? e.message : 'تعذر حفظ الطلب.' }); }
  });
  return router;
}

export function createAccountAdministrationRouter(accounts: ManagerAccounts) {
  const router = Router();
  router.use((req, res, next) => ['ceo','admin'].includes(actorOf(req).role) ? next() : res.status(403).json({ error: 'إدارة التسجيل متاحة لمكتب الرئيس التنفيذي فقط.' }));
  router.get('/', (_req, res) => res.json({ accounts: accounts.list(), grants: executiveStore.read().grants }));
  router.post('/:email/decision', (req, res) => {
    try { accounts.decide(req.params.email.toLowerCase(), req.body.action, req.body.units, actorOf(req).email, req.body.tasksOnly === true); res.json({ ok: true }); }
    catch (e: any) { res.status(e.status || 400).json({ error: e.message }); }
  });
  return router;
}
