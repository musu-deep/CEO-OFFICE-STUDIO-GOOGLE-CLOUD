import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Key,
  Layers,
  Lock,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { AppUser, PlatformTheme } from '../types';

interface LoginViewProps {
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  theme: PlatformTheme;
}

type ThemeTokens = {
  text: string;
  softText: string;
  border: string;
  ring: string;
  glow: string;
  button: string;
  buttonText: string;
  activeTab: string;
  accentRgb: string;
  secondaryRgb: string;
};

const themeTokens: Record<PlatformTheme, ThemeTokens> = {
  vision_2030: {
    text: 'text-emerald-300',
    softText: 'text-emerald-200',
    border: 'border-emerald-400/45',
    ring: 'ring-emerald-400/35',
    glow: 'shadow-emerald-500/30',
    button: 'bg-gradient-to-l from-blue-700 via-cyan-700 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-400',
    buttonText: 'text-white',
    activeTab: 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_35px_rgba(16,185,129,.20)]',
    accentRgb: '16, 185, 129',
    secondaryRgb: '37, 99, 235',
  },
  golden_luxury: {
    text: 'text-amber-300',
    softText: 'text-amber-200',
    border: 'border-amber-400/45',
    ring: 'ring-amber-400/35',
    glow: 'shadow-amber-500/30',
    button: 'bg-gradient-to-l from-blue-700 via-sky-700 to-amber-500 hover:from-blue-600 hover:via-sky-600 hover:to-amber-400',
    buttonText: 'text-white',
    activeTab: 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_35px_rgba(245,158,11,.20)]',
    accentRgb: '245, 158, 11',
    secondaryRgb: '14, 165, 233',
  },
  midnight_navy: {
    text: 'text-blue-300',
    softText: 'text-blue-200',
    border: 'border-blue-400/45',
    ring: 'ring-blue-400/35',
    glow: 'shadow-blue-500/30',
    button: 'bg-gradient-to-l from-indigo-700 via-blue-700 to-cyan-500 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-400',
    buttonText: 'text-white',
    activeTab: 'bg-blue-500/15 border-blue-400 text-white shadow-[0_0_35px_rgba(59,130,246,.20)]',
    accentRgb: '59, 130, 246',
    secondaryRgb: '34, 211, 238',
  },
  spring: {
    text: 'text-lime-300',
    softText: 'text-lime-200',
    border: 'border-lime-400/45',
    ring: 'ring-lime-400/35',
    glow: 'shadow-lime-500/30',
    button: 'bg-gradient-to-l from-blue-700 via-teal-700 to-lime-500 hover:from-blue-600 hover:via-teal-600 hover:to-lime-400',
    buttonText: 'text-white',
    activeTab: 'bg-lime-500/15 border-lime-400 text-white shadow-[0_0_35px_rgba(132,204,22,.20)]',
    accentRgb: '132, 204, 22',
    secondaryRgb: '20, 184, 166',
  },
};

export default function LoginView({ users, onLoginSuccess, theme }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedLevelTab, setSelectedLevelTab] = useState<1 | 2 | 3>(2);

  const t = themeTokens[theme] || themeTokens.vision_2030;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('يرجى كتابة البريد الإلكتروني الرسمي');
      return;
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      setError('البريد الإلكتروني غير مسجل في مكتب الرئيس التنفيذي');
      return;
    }

    if (matchedUser.status === 'محجوب') {
      setError('عذراً، هذا الحساب محجوب مؤقتاً بأمر سيادي من الإدارة العليا للجودة والامتثال.');
      return;
    }

    if (!password) {
      setError('يرجى إدخال كلمة المرور الخاصة بهذا الحساب');
      return;
    }

    const expectedPassword = matchedUser.password || '123456';
    if (password !== expectedPassword) {
      setError('عذراً، كلمة المرور المدخلة غير صحيحة. يرجى مراجعة الإدارة أو استخدام التصفح التجريبي السريع.');
      return;
    }

    onLoginSuccess(matchedUser);
  };

  const handleQuickLogin = (user: AppUser) => {
    if (user.status === 'محجوب') {
      alert('عذراً، هذا الحساب تم حجبه/تعليقه من قبل المشرف العام أو الرئيس التنفيذي ولا يمكن الولوج منه حالياً.');
      return;
    }
    onLoginSuccess(user);
  };

  const getPredefinedUsersForTab = () => {
    if (selectedLevelTab === 1) return users.filter((u) => u.role === 'admin');
    if (selectedLevelTab === 2) return users.filter((u) => u.role === 'ceo');
    return users.filter((u) => u.role === 'vp' || u.role === 'head' || u.role === 'board_member');
  };

  const quickUsers = getPredefinedUsersForTab();

  const glassPanel =
    'relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/30 backdrop-blur-[28px] shadow-[0_32px_120px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.16)]';

  const innerGlass =
    'border border-white/15 bg-white/[0.035] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.08)]';

  return (
    <div
      id="login-screen-view"
      dir="rtl"
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-6 font-sans text-slate-100 antialiased select-none"
      style={{
        background:
          `radial-gradient(circle at 50% 0%, rgba(${t.accentRgb}, .18), transparent 34%),` +
          `radial-gradient(circle at 14% 80%, rgba(${t.secondaryRgb}, .20), transparent 34%),` +
          'linear-gradient(135deg, #020617 0%, #071326 38%, #050916 100%)',
      }}
    >
      {/* High-resolution cinematic background layers */}
      <div className="absolute inset-0 opacity-95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_48%,rgba(0,0,0,.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,.18)_0%,rgba(2,6,23,.06)_45%,rgba(0,0,0,.42)_100%)]" />
      </div>

      {/* Dubai-style skyline silhouette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52vh] opacity-70">
        <div className="absolute bottom-0 left-0 h-full w-[33%] bg-gradient-to-t from-blue-950/80 via-blue-950/15 to-transparent blur-[1px]" />
        <div className="absolute bottom-[6%] left-[2%] h-[42%] w-[1.4%] rounded-t-full bg-gradient-to-t from-slate-950 via-blue-200/50 to-white/80 shadow-[0_0_28px_rgba(125,211,252,.55)]" />
        <div className="absolute bottom-[6%] left-[4.2%] h-[28%] w-[5.5%] rounded-t-[46%] bg-gradient-to-t from-slate-950 via-slate-900 to-sky-200/55 shadow-[0_0_36px_rgba(56,189,248,.28)]" />
        <div className="absolute bottom-[6%] left-[10%] h-[24%] w-[2.6%] bg-gradient-to-t from-slate-950 via-blue-900/80 to-blue-100/50" />
        <div className="absolute bottom-[6%] left-[13.2%] h-[34%] w-[2.1%] rounded-t-full bg-gradient-to-t from-slate-950 via-blue-900/80 to-cyan-100/60" />
        <div className="absolute bottom-[6%] left-[16.4%] h-[20%] w-[8%] bg-gradient-to-t from-slate-950 via-blue-950/80 to-slate-700/40" />
        <div className="absolute bottom-0 left-0 h-[10%] w-[36%] bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Digital grid wave */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36vh] opacity-65">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(56,189,248,.28)_1px,transparent_1px),linear-gradient(20deg,rgba(56,189,248,.20)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:linear-gradient(to_top,black,transparent_85%)]" />
        <div className="absolute bottom-0 right-0 h-full w-[38%] bg-[radial-gradient(circle_at_70%_100%,rgba(37,99,235,.42),transparent_58%)]" />
      </div>

      {/* Soft blur particles */}
      <div className="pointer-events-none absolute top-[10%] right-[26%] h-28 w-28 rounded-full bg-white/10 blur-[90px]" />
      <div className="pointer-events-none absolute top-[34%] right-[52%] h-20 w-20 rounded-full bg-rose-400/10 blur-[70px]" />
      <div className="pointer-events-none absolute bottom-[14%] left-[38%] h-32 w-32 rounded-full bg-cyan-400/10 blur-[95px]" />

      <div className="relative z-10 w-full max-w-[1360px] grid grid-cols-1 lg:grid-cols-2 gap-7 items-stretch">
        {/* Login panel */}
        <section className={`${glassPanel} min-h-[760px] p-7 sm:p-9 flex flex-col justify-between text-right`}>
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.12),transparent_30%),radial-gradient(circle_at_12%_16%,rgba(56,189,248,.10),transparent_28%)]" />

          <div className="relative space-y-7">
            <div className="text-center space-y-4">
              <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full border ${t.border} bg-white/[0.04] shadow-[0_0_32px_rgba(16,185,129,.35)] ring-4 ${t.ring}`}>
                <ShieldCheck className={`h-8 w-8 ${t.text}`} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">تسجيل الدخول الآمن للمكتب</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300/90">
                  يرجى تسجيل الدخول أو اختيار شخصية تدريبية لاستعراض حدود الصلاحيات المتاحة
                  <br className="hidden sm:block" />
                  والتعرّف على قدرات المكتب التنفيذي الذكي.
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-rose-200 text-xs flex items-center gap-2 shadow-[0_0_28px_rgba(244,63,94,.10)]">
                <AlertCircle className="h-4 w-4 text-rose-300 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <span className="block text-center text-xs font-semibold text-slate-300/85">اختر الشخصية لغرض التجربة</span>
              <div className={`grid grid-cols-3 gap-2 rounded-2xl ${innerGlass} p-1.5`}>
                <button
                  type="button"
                  onClick={() => setSelectedLevelTab(1)}
                  className={`rounded-xl border px-2 py-4 text-center text-xs font-extrabold transition-all ${
                    selectedLevelTab === 1 ? t.activeTab : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  آدمن النظام <span className="block pt-1 text-[11px] font-bold opacity-80">(مستوى ١)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLevelTab(2)}
                  className={`rounded-xl border px-2 py-4 text-center text-xs font-extrabold transition-all ${
                    selectedLevelTab === 2 ? t.activeTab : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  الرئيس التنفيذي <span className="block pt-1 text-[11px] font-bold opacity-80">(مستوى ٢)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLevelTab(3)}
                  className={`rounded-xl border px-2 py-4 text-center text-xs font-extrabold transition-all ${
                    selectedLevelTab === 3 ? t.activeTab : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  نواب ومدراء <span className="block pt-1 text-[11px] font-bold opacity-80">(مستوى ٣)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-36 overflow-y-auto pl-1 pr-0 [scrollbar-width:thin]">
                {quickUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickLogin(user)}
                    className={`group rounded-2xl ${innerGlass} hover:bg-white/[0.065] hover:border-white/25 p-3 text-right transition-all flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 place-items-center rounded-xl text-slate-950 font-black text-xs shadow-lg ${user.color || 'bg-amber-500'}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white group-hover:text-emerald-200 transition-colors">{user.name}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{user.title}</p>
                      </div>
                    </div>
                    <span className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-slate-300 group-hover:text-white flex items-center gap-1 transition-all">
                      دخول سريع <ArrowLeft className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/18 to-white/5" />
              <span className="text-xs text-slate-400">أو</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/18 to-white/5" />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-200">البريد الإلكتروني الرسمي للشركة</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="مثال: ceo@arak.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl ${innerGlass} px-4 py-3.5 pl-12 text-right text-sm text-white placeholder:text-slate-400/70 outline-none transition-all focus:border-white/30 focus:bg-white/[0.07] focus:ring-2 ${t.ring}`}
                  />
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-300/80">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => alert('يمكنك استخدام الدخول السريع للتجربة، أو مراجعة مشرف النظام لإعادة تعيين كلمة المرور.')}
                    className={`${t.text} hover:underline text-xs`}
                  >
                    نسيت كلمة المرور؟
                  </button>
                  <label className="text-slate-200">كلمة المرور</label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl ${innerGlass} px-4 py-3.5 pl-12 text-right text-sm text-white placeholder:text-slate-400/70 outline-none transition-all focus:border-white/30 focus:bg-white/[0.07] focus:ring-2 ${t.ring}`}
                  />
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-300/80">
                    <Key className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`group relative w-full overflow-hidden rounded-xl ${t.button} ${t.buttonText} py-4 text-base font-black shadow-2xl ${t.glow} transition-all active:scale-[.99]`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-3">
                  تسجيل الدخول إلى المكتب التنفيذي
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </span>
              </button>
            </form>
          </div>

          <div className="relative mt-7 space-y-5">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300/90">
              <CheckCircle2 className={`h-4 w-4 ${t.text}`} />
              <span>اتصال آمن ومشفّر وفق أعلى معايير حماية البيانات (AES-256)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center text-xs text-slate-300/80">
              <span className="flex items-center justify-center gap-1.5"><Lock className="h-4 w-4" /> شروط الاستخدام</span>
              <span className="flex items-center justify-center gap-1.5"><ShieldCheck className="h-4 w-4" /> سياسة الخصوصية</span>
              <span className="flex items-center justify-center gap-1.5"><Users className="h-4 w-4" /> دعم على مدار الساعة</span>
            </div>
          </div>
        </section>

        {/* Brand panel */}
        <section className={`${glassPanel} min-h-[760px] p-8 sm:p-10 flex flex-col justify-between text-center`}>
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,.13),transparent_30%),radial-gradient(circle_at_72%_12%,rgba(34,197,94,.12),transparent_24%)]" />

          <div className="relative flex flex-1 flex-col items-center justify-center">
            <div className="relative mb-8">
              <div className={`absolute inset-0 rounded-full blur-3xl bg-[rgba(${t.accentRgb},.20)]`} />
              <img
                src="/arak-group-logo.png"
                alt="مجموعة أراك للتنمية"
                className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64 object-contain drop-shadow-[0_34px_40px_rgba(0,0,0,.45)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = 'grid';
                }}
              />
              <div className="relative mx-auto hidden h-56 w-56 sm:h-64 sm:w-64 place-items-center rounded-[38%] bg-gradient-to-br from-lime-400 via-yellow-400 to-rose-500 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
                <Layers className="h-24 w-24 text-slate-950" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-lime-400 drop-shadow-[0_6px_18px_rgba(132,204,22,.25)]">
              مجموعة أراك للتنمية
            </h1>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              مكتب الرئيس التنفيذي
            </h2>

            <div className="mt-10 h-px w-[82%] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className={`mt-[-2px] h-1.5 w-20 rounded-full bg-[rgba(${t.accentRgb},.95)] blur-sm shadow-[0_0_24px_rgba(16,185,129,.75)]`} />
          </div>

          <div className="relative space-y-2 pb-2 text-xs text-slate-300/85">
            <p>الإصدار الحالي: 2.0 • عام 2025</p>
            <p>جميع الحقوق محفوظة © مجموعة أراك للتنمية</p>
          </div>
        </section>
      </div>
    </div>
  );
}
