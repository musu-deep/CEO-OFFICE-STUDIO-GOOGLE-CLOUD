import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  User, 
  Key, 
  ArrowLeft, 
  Users, 
  Briefcase,
  Lock,
  Globe,
  Ship,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppUser, PlatformTheme } from '../types';

interface LoginViewProps {
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  theme: PlatformTheme;
}

export default function LoginView({ users, onLoginSuccess, theme }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedLevelTab, setSelectedLevelTab] = useState<1 | 2 | 3>(2);

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
    }
  };

  const getThemeBgClass = () => {
    switch (theme) {
      case 'vision_2030': return 'bg-emerald-600 hover:bg-emerald-500';
      case 'golden_luxury': return 'bg-amber-600 hover:bg-amber-500';
      case 'midnight_navy': return 'bg-blue-600 hover:bg-blue-500';
      case 'spring': return 'bg-lime-600 hover:bg-lime-500';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('يرجى كتابة البريد الإلكتروني الرسمي');
      return;
    }

    // Match email in the users list
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matchedUser) {
      setError('البريد الإلكتروني غير مسجل في مكتب الرئيس التنفيذي');
      return;
    }

    if (matchedUser.status === 'محجوب') {
      setError('عذراً، هذا الحساب محجوب مؤقتاً بأمر سيادي من الإدارة العليا للجودة والامتثال.');
      return;
    }

    // Individual password enforcement
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

  // Filter users based on levels for helper selector tabs
  const getPredefinedUsersForTab = () => {
    if (selectedLevelTab === 1) {
      return users.filter(u => u.role === 'admin');
    } else if (selectedLevelTab === 2) {
      return users.filter(u => u.role === 'ceo');
    } else {
      return users.filter(u => u.role === 'vp' || u.role === 'head' || u.role === 'board_member');
    }
  };

  return (
    <div className="min-h-screen bg-[#070810] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none" id="login-screen-view">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -z-10"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Right Info Column (Majestic Brand Introduction) */}
        <div className="lg:col-span-5 bg-[#0e101f] border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden text-right">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl -z-10"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-end">
              <div>
                <h1 className="text-xl font-black text-white tracking-tight leading-none">ARAK DEVELOPMENT</h1>
                <span className="text-[10px] font-bold text-amber-500">مجموعة أراك للتنمية والاستثمار</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Layers className="w-6 h-6 text-slate-950 font-black" />
              </div>
            </div>

            <div className="h-px bg-slate-800/80"></div>

            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-black text-white">بوابة التحقق والاستعلام ثلاثية المستويات</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                مرحباً بك في المنصة الرقمية الموحدة لمكتب الرئيس التنفيذي د. علي العتيبي. تم دمج مستويات الوصول لتنظيم وتوثيق حركة البيانات وضمان سرية وسلاسة تتبع تقارير الأداء.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3 justify-end flex-row-reverse">
                <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">المستوى الأول: آدمن النظام</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">كامل الصلاحيات الفنية لمنح وحجب حسابات المستخدمين النشطين.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end flex-row-reverse">
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">المستوى الثاني: الرئيس التنفيذي</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">الرصد الشامل لكافة قطاعات المجموعه مع إمكانية التحول للآدمن الفني.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end flex-row-reverse">
                <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">المستوى الثالث: النواب والمدراء</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">الوصول الحصري والمقيد للقطاع المعني فقط، دون الاطلاع على الأقسام الأخرى.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center sm:text-right border-t border-slate-850">
            <p className="text-[10px] text-slate-600">الإصدار السيادي الموحد ٢.٤.٠ - خادم أراك الرئيسي بجدة</p>
          </div>
        </div>

        {/* Left Interactive Login Column */}
        <div className="lg:col-span-7 bg-[#0b0c16] border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between text-right">
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">تسجيل الدخول الآمن للمكتب</h2>
              <p className="text-xs text-slate-500 mt-1">يرجى تسجيل الدخول أو اختيار شخصية تجريبية لاستعراض حدود الصلاحيات الفورية</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Switch Tab for Levels to demo login */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-500 block">اضغط لتصفح الحسابات المتاحة لكل مستوى (لأغراض العرض والتجربة)</span>
              <div className="grid grid-cols-3 gap-2 bg-[#0e101f] p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setSelectedLevelTab(3)}
                  className={`py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedLevelTab === 3 
                      ? `${getThemeBgClass()} text-white font-black` 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  نواب ومدراء ومجلس الإدارة (مستوى ٣)
                </button>
                <button
                  onClick={() => setSelectedLevelTab(2)}
                  className={`py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedLevelTab === 2 
                      ? `${getThemeBgClass()} text-white font-black` 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الرئيس التنفيذي (مستوى ٢)
                </button>
                <button
                  onClick={() => setSelectedLevelTab(1)}
                  className={`py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedLevelTab === 1 
                      ? `${getThemeBgClass()} text-white font-black` 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  آدمن النظام (مستوى ١)
                </button>
              </div>

              {/* Quick Persona Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                {getPredefinedUsersForTab().map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    className="p-3.5 rounded-2xl bg-[#0e101f] hover:bg-[#14172c] border border-slate-850 hover:border-amber-500/30 transition-all text-right flex items-center justify-between flex-row-reverse cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-row-reverse">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-950 font-black text-xs ${user.color || 'bg-amber-500'}`}>
                        {user.avatar}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{user.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{user.title}</p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] bg-[#1a1c32] group-hover:bg-amber-500/10 text-slate-400 group-hover:text-amber-400 px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all">
                      دخول سريع <ArrowLeft className="w-2.5 h-2.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-slate-800"></div>
              <span className="text-[10px] text-slate-600 font-bold">أو استخدام النموذج الرسمي</span>
              <div className="flex-grow h-px bg-slate-800"></div>
            </div>

            {/* Official Credentials Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 block">البريد الإلكتروني الرسمي لشركة أراك</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@arak.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-right bg-[#0e101f] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700 font-sans"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <button 
                    type="button"
                    onClick={() => alert('مرحباً بك! يمكنك تسجيل الدخول السريع لأي رتبة بالضغط على البطاقات في الأعلى دون الحاجة لكلمة مرور.')}
                    className="text-amber-500 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                  <label className="text-slate-400">كلمة السر الآمنة</label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-right bg-[#0e101f] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700 font-sans"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center text-slate-600">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-black text-slate-950 text-center transition-all cursor-pointer ${getThemeBgClass()}`}
              >
                التحقق والولوج للمنصة الرقمية
              </button>
            </form>

          </div>

          <div className="pt-6 text-center text-[10px] text-slate-500 leading-relaxed flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>اتصال آمن ومحمي ومصدق عليه بالشهادة الرقمية للتشفير العسكري (AES-256)</span>
          </div>

        </div>

      </div>
    </div>
  );
}
