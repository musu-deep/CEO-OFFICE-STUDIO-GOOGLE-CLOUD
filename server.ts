import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createUnitWorkspaceRouter } from './src/server/unitWorkspaceRoutes';
import { createExecutiveRouter } from './src/server/executiveRoutes';
import { ManagerAccounts, createRegistrationRouter, createAccountAdministrationRouter } from './src/server/managerAccounts';
import { createScopedWorkspaceRouter } from './src/server/scopedWorkspace';
import { createPerformanceReportRouter } from './src/server/performanceReports';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.disable('x-powered-by');
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

  const sessionSecret = process.env.SESSION_SECRET || '';
  const authUsers = (() => {
    try {
      const parsed = JSON.parse(process.env.ARAAK_AUTH_USERS || '{}') as Record<string, { password: string; role: string; name?: string; title?: string }>;
      return Object.fromEntries(
        Object.entries(parsed).map(([email, account]) => [email.trim().toLowerCase(), account])
      );
    } catch {
      console.error('ARAAK_AUTH_USERS must be valid JSON.');
      return {};
    }
  })();

  if (!sessionSecret) console.warn('SESSION_SECRET is not configured.');
  if (!Object.keys(authUsers).length) console.warn('ARAAK_AUTH_USERS has no valid accounts.');

  const managers = new ManagerAccounts();
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
    const storage = process.env.NODE_ENV !== 'production' || !!process.env.EXECUTIVE_DATA_DIR;
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
      storageConfigured: !!process.env.EXECUTIVE_DATA_DIR,
      ...authAvailability(),
    });
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
    const key = req.ip || 'unknown';
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

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CEO Digital Office Server running on http://localhost:${PORT}`);
  });
}

startServer();
