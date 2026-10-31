import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { createUnitWorkspaceRouter } from './unitWorkspaceRoutes';
import { createExecutiveRouter } from './executiveRoutes';
import { ManagerAccounts, createRegistrationRouter, createAccountAdministrationRouter } from './managerAccounts';
import { createScopedWorkspaceRouter } from './scopedWorkspace';
import { createPerformanceReportRouter } from './performanceReports';


import { executiveStore } from './storeContext';
export function createApplication(options:{sessionSecret:string;authUsers:Record<string,any>;managers:ManagerAccounts;clientIp?:(req:Request)=>string}) {
  const app = express();

  app.disable('x-powered-by');
  if(options.clientIp)app.use((req,res,next)=>{Object.defineProperty(req,'ip',{value:options.clientIp!(req)});next();});
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com");
    next();
  });
  app.use('/api/unit-workspace', (req, res, next) => { requireAuth(req, res, next); }, createUnitWorkspaceRouter());
  // Report uploads use a larger, authenticated parser before the general API parser.
  app.use('/api/performance-reports', (req, res, next) => requireAuth(req, res, next), createPerformanceReportRouter());
  app.use(express.json({ limit: '512kb' }));

  const {sessionSecret,authUsers,managers}=options;
  if (!sessionSecret) console.warn('SESSION_SECRET is not configured.');
  if (!Object.keys(authUsers).length) console.warn('ARAAK_AUTH_USERS has no valid accounts.');

  const accountOf = (email: string) => {
    const manager = managers.active(email);
    return authUsers[email] || (manager ? { ...manager, role: 'head', password: '' } : undefined);
  };
  const profileOf = (email: string) => {
    const account = accountOf(email);
    if (!account) return undefined;
    const manager = managers.active(email);
    return { id: email, email, role: account.role, name: manager?.name || ('name' in account && account.name) || (account.role === 'ceo' ? 'الرئيس التنفيذي' : 'مستخدم المنصة'), title: manager?.title || ('title' in account && account.title) || (account.role === 'ceo' ? 'الرئيس التنفيذي' : 'مستخدم المنصة'), avatar: manager?.name.charAt(0) || 'أ', status: 'نشط', managerAccount: !!manager, allowedViews: ['workspace','tasks','performance-reports'], color: 'bg-slate-700' };
  };

  const loginAttempts = new Map<string, { count: number; resetAt: number }>();
  const safeEqual = (left: string, right: string) => {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  };
  const signSession = (payload: string) =>
    crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  const readSession = (req: Request) => {
    if (!sessionSecret) return null;
    const raw = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('araak_session='));
    if (!raw) return null;
    try {
      const [payload, signature] = decodeURIComponent(raw.slice('araak_session='.length)).split('.');
      if (!payload || !signature || !safeEqual(signSession(payload), signature)) return null;
      const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      return session.exp > Date.now() ? session : null;
    } catch {
      return null;
    }
  };
  const requireAuth = (req: Request, res: Response, next: () => void) => {
    const session = readSession(req);
    if (!session || !accountOf(session.email)) return res.status(401).json({ error: 'Authentication required' });
    (req as Request & { auth?: unknown }).auth = { ...session, role: accountOf(session.email)!.role };
    next();
  };

  // Self-registered managers use scoped workspaces and reports, not unrelated group-wide operations.
  const requireGeneralAccess = (req: Request, res: Response, next: () => void) => {
    const email = (req as Request & { auth?: { email: string } }).auth?.email;
    return email && ['ceo','admin'].includes(accountOf(email)?.role||'') ? next() : res.status(403).json({ error: 'هذه الخدمة خارج نطاق صلاحيات حساب المدير.' });
  };

  const authAvailability = () => {
    const hasOffice = Object.values(authUsers).some(a=>a && ['ceo','admin'].includes(a.role));
    const storage = executiveStore.persistent;
    const reason = !sessionSecret ? 'authentication' as const : !hasOffice ? 'administration' as const : !storage ? 'storage' as const : null;
    return {loginAvailable:!!sessionSecret && (Object.keys(authUsers).length>0 || managers.list().some(a=>a.status==='active')),registrationAvailable:reason===null,registrationUnavailableReason:reason};
  };
  app.use('/api/auth', createRegistrationRouter(managers, authUsers, authAvailability));
  app.use('/api/manager-accounts', requireAuth, createAccountAdministrationRouter(managers));
  app.use('/api/executive', requireAuth, createExecutiveRouter());
  app.use('/api/workspace', requireAuth, createScopedWorkspaceRouter(() => [...Object.keys(authUsers).map(email=>({email,name:String(profileOf(email)?.name||email)})), ...managers.list().filter(a=>a.status==='active').map(a=>({email:a.email,name:a.name}))]));

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'araak-ceo-office' }));
  app.get('/ready', (_req, res) => {
    const ready = Boolean(sessionSecret && Object.keys(authUsers).length);
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'configuration_required',
      sessionConfigured: Boolean(sessionSecret),
      configuredUsers: Object.keys(authUsers).length,
      storageConfigured: executiveStore.persistent,
      ...authAvailability(),
    });
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
    const key = req.ip || 'unknown';
    for(const [ip,item] of loginAttempts)if(item.resetAt<Date.now())loginAttempts.delete(ip);
    if(!loginAttempts.has(key)&&loginAttempts.size>=10000)return res.status(429).json({error:'Too many login attempts'});
    const now = Date.now();
    const current = loginAttempts.get(key);
    const attempt = !current || current.resetAt < now ? { count: 0, resetAt: now + 15 * 60_000 } : current;
    if (attempt.count >= 10) return res.status(429).json({ error: 'Too many login attempts' });

    if (!sessionSecret) {
      return res.status(503).json({
        error: 'AUTH_NOT_CONFIGURED',
        sessionConfigured: Boolean(sessionSecret),
        configuredUsers: Object.keys(authUsers).length,
      });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (password.length > 128) return res.status(400).json({ error: 'INVALID_CREDENTIALS' });
    attempt.count += 1; loginAttempts.set(key, attempt);
    const manager = authUsers[email] ? undefined : await managers.verify(email, password);
    const account = authUsers[email] || (manager ? { role: 'head' } : undefined);
    if (!account || !password || (authUsers[email] && !safeEqual(password, String(authUsers[email].password || '')))) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    loginAttempts.delete(key);
    const payload = Buffer.from(JSON.stringify({
      email,
      role: account.role,
      exp: Date.now() + 8 * 60 * 60_000,
    })).toString('base64url');
    const token = encodeURIComponent(`${payload}.${signSession(payload)}`);
    res.setHeader('Set-Cookie', `araak_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
    return res.json({ ok: true, email, role: account.role, user: profileOf(email) });
    } catch {
      console.error('Authentication request failed; the service remains running.');
      return res.status(503).json({error:'AUTH_TEMPORARILY_UNAVAILABLE'});
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const session = readSession(req);
    const user = session && profileOf(session.email);
    res.setHeader('Cache-Control', 'no-store');
    return user ? res.json({ authenticated: true, user }) : res.status(401).json({ authenticated: false });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.setHeader('Set-Cookie', 'araak_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    res.status(204).end();
  });

  // Retire temporary simulation APIs; production surfaces use scoped, stored records only.
  app.all(['/api/executive-feed','/api/nama','/api/nama/*','/api/advisor','/api/gemini/chat','/api/voice-transcribe'], requireAuth, requireGeneralAccess, (_req,res) => res.status(410).json({ error: 'أُوقفت واجهات التجربة. استخدم مساحة الجهة ووكيلها المرتبط بالسجلات الفعلية.' }));

  return app;
}
