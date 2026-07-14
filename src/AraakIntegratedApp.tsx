import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bot, ChevronLeft, ShieldCheck, Sparkles, X } from 'lucide-react';
import App from './App';
import AraakAiCommandCenterView from './components/AraakAiCommandCenterView';
import type { AppUser, PlatformTheme } from './types';

const NAMA_VIEW_ID = 'nama-ai';

function readCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem('arak_current_user');
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function canAccessNama(user: AppUser | null) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'ceo') return true;
  if (user.allowedViews?.includes(NAMA_VIEW_ID)) return true;

  const normalized = `${user.email} ${user.title}`.toLowerCase();
  return normalized.includes('development@arak.com') || normalized.includes('التنمية') || normalized.includes('الأكاديمية');
}

export default function AraakIntegratedApp() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => readCurrentUser());
  const [theme, setTheme] = useState<PlatformTheme>('vision_2030');
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const hasAccess = useMemo(() => canAccessNama(currentUser), [currentUser]);

  useEffect(() => {
    const syncState = () => {
      const nextUser = readCurrentUser();
      setCurrentUser(previous => {
        if (JSON.stringify(previous) === JSON.stringify(nextUser)) return previous;
        return nextUser;
      });

      const themedElement = document.querySelector<HTMLElement>('[data-theme]');
      const currentTheme = themedElement?.dataset.theme as PlatformTheme | undefined;
      if (currentTheme) setTheme(currentTheme);

      const nav = document.querySelector<HTMLElement>('aside nav');
      setMenuTarget(previous => (previous === nav ? previous : nav));
    };

    syncState();
    const interval = window.setInterval(syncState, 600);
    const observer = new MutationObserver(syncState);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasAccess) setOpen(false);
  }, [hasAccess]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'n' && hasAccess) {
        event.preventDefault();
        setOpen(value => !value);
      }
      if (event.key === 'Escape' && open) setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasAccess, open]);

  return (
    <>
      <App />

      {hasAccess && menuTarget && createPortal(
        <div className="space-y-1.5 border-t border-white/10 pt-5">
          <span className="block px-3 text-right text-[12px] font-black uppercase tracking-wider text-slate-500">
            منظومة نماء والذكاء التشغيلي
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`group flex w-full flex-row-reverse items-center justify-between rounded-xl px-3.5 py-3 text-[15px] transition-all ${
              open
                ? 'border border-emerald-300/25 bg-gradient-to-l from-emerald-500/95 to-teal-500/85 font-black text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:bg-white/10 hover:text-slate-100'
            }`}
          >
            <div className="flex flex-1 flex-row-reverse items-center justify-start gap-2.5">
              <Sparkles className={`h-5 w-5 ${open ? 'text-white' : 'text-slate-500 group-hover:text-emerald-300'}`} />
              <span className="flex-1 text-right">مركز القيادة الذكية</span>
            </div>
            <ChevronLeft className={`h-4 w-4 transition-all ${open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </button>
        </div>,
        menuTarget,
      )}

      {hasAccess && open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#06080f]/95 text-slate-100 backdrop-blur-xl" dir="rtl">
          <header className="flex min-h-[76px] items-center justify-between border-b border-white/10 bg-black/25 px-5 shadow-2xl md:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white">ARAAK NAMA AI</p>
                <p className="text-xs font-bold text-slate-500">المشرف التنفيذي الذكي · وضع الإشراف الآمن</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs font-bold text-emerald-300 md:flex">
                <ShieldCheck className="h-4 w-4" />
                صلاحية المستخدم: {currentUser?.title}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                aria-label="إغلاق مركز القيادة الذكية"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-[1700px]">
              <AraakAiCommandCenterView theme={theme} />
            </div>
          </main>
        </div>
      )}
    </>
  );
}
