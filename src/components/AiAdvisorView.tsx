import { useState } from 'react';
import {
  Brain,
  Sparkles,
  CornerDownLeft,
  Loader2,
  ShieldCheck,
  Radar,
  MessageSquareText,
  Zap,
} from 'lucide-react';
import { PlatformTheme } from '../types';
import OpportunityIntelligenceLab from './OpportunityIntelligenceLab';

interface AiAdvisorViewProps {
  theme: PlatformTheme;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  content: string;
  time: string;
}

type AdvisorMode = 'advisor' | 'opportunities';

export default function AiAdvisorView({ theme }: AiAdvisorViewProps) {
  const [mode, setMode] = useState<AdvisorMode>('opportunities');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-1',
      sender: 'system',
      content:
        'أهلاً بك في المستشار الاستراتيجي الذكي لمجموعة اراك للتنمية. أستطيع تحليل البيانات التشغيلية والمالية، وصياغة مذكرات القرار، وربط النتائج بالمشاريع والوثائق ومحاضر الاجتماعات. كما أضيف الآن مختبر الفرص والقرارات الاستثمارية لتحويل العروض والأصول والمخططات إلى دراسات قابلة للاعتماد.',
      time: '10:00',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presetPrompts = [
    'حلل فرصة استثمارية جديدة وحدد البيانات الناقصة وبوابات القرار',
    'قارن بين التطوير الذاتي والشراكة والبيع المرحلي للأصل',
    'أنشئ مذكرة قرار تنفيذية تتضمن الافتراضات والمخاطر وشروط الاعتماد',
    'استخرج مؤشرات السوق المطلوبة لبناء قاعدة معرفة للأسعار والتفضيلات',
  ];

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030':
        return 'text-emerald-400';
      case 'golden_luxury':
        return 'text-amber-400';
      case 'midnight_navy':
        return 'text-blue-400';
      case 'spring':
        return 'text-lime-400';
    }
  };

  const getThemeBtnClass = () => {
    switch (theme) {
      case 'vision_2030':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'golden_luxury':
        return 'bg-amber-600 hover:bg-amber-500 text-slate-950';
      case 'midnight_navy':
        return 'bg-blue-600 hover:bg-blue-500 text-white';
      case 'spring':
        return 'bg-lime-600 hover:bg-lime-500 text-slate-950';
    }
  };

  const getThemeSoftClass = () => {
    switch (theme) {
      case 'vision_2030':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'golden_luxury':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'midnight_navy':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'spring':
        return 'bg-lime-500/10 border-lime-500/20';
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: text,
      time: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(previous => [...previous, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      const reply: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        content:
          data.reply ||
          'تعذر إكمال التحليل من الخادم الذكي في هذه اللحظة. تم الاحتفاظ بالسؤال ويمكن إعادة المحاولة.',
        time: new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(previous => [...previous, reply]);
    } catch (error) {
      console.error(error);
      const fallback: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        content:
          'تم تسجيل طلب التحليل. المنهج التنفيذي المقترح يبدأ بتصنيف الفرصة، تثبيت المستندات والموقع، بناء قاعدة سوقية موثقة، تطوير ثلاثة سيناريوهات، اختبار الجدوى والحساسية، ثم صياغة مذكرة قرار تتضمن الافتراضات والمخاطر وشروط الاعتماد. استخدم تبويب «مختبر الفرص» لتسجيل الحالة وتشغيل المسار كاملاً.',
        time: new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(previous => [...previous, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease_out] text-right">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b border-slate-800/60 pb-5">
        <div className={`flex items-center gap-1.5 rounded-2xl border p-1.5 ${getThemeSoftClass()}`}>
          <button
            onClick={() => setMode('opportunities')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              mode === 'opportunities'
                ? `${getThemeBtnClass()} shadow-lg`
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radar className="w-4 h-4" />
            مختبر الفرص والقرارات
          </button>
          <button
            onClick={() => setMode('advisor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              mode === 'advisor'
                ? `${getThemeBtnClass()} shadow-lg`
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            المستشار التنفيذي
          </button>
        </div>

        <div>
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            مساعدات اتخاذ القرارات العليا
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            الذكاء الاستراتيجي ومختبر الفرص
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            تحليل مؤسسي متكامل من السؤال التنفيذي واستقبال العرض إلى دراسة السوق والسيناريوهات والقرار.
          </p>
        </div>
      </div>

      {mode === 'opportunities' ? (
        <OpportunityIntelligenceLab theme={theme} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-[#121422] rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between min-h-[620px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-80 h-80 bg-[var(--theme-accent-soft)] rounded-full blur-[110px] pointer-events-none" />

            <div className="relative space-y-6 max-h-[480px] overflow-y-auto pb-4 pr-1">
              {messages.map(message => {
                const systemMessage = message.sender === 'system';
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 max-w-[92%] ${
                      systemMessage
                        ? 'mr-auto text-right'
                        : 'ml-auto flex-row-reverse text-left'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        systemMessage
                          ? `${getThemeBtnClass()}`
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {systemMessage ? 'اراك' : 'ع'}
                    </div>
                    <div className="space-y-1 w-full">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-7 whitespace-pre-wrap ${
                          systemMessage
                            ? 'bg-[#16182c] border border-slate-800/80 text-slate-200 shadow-inner'
                            : 'bg-[var(--theme-accent)] text-white font-bold shadow'
                        }`}
                      >
                        {message.content}
                      </div>
                      <span className="text-[9px] text-slate-500 block font-sans">
                        {message.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2 mr-auto items-center text-slate-400 text-xs font-medium">
                  <Loader2 className={`w-4 h-4 animate-spin ${getThemeTextClass()}`} />
                  <span>جاري استقراء الوثائق والبيانات ومطابقة الافتراضات...</span>
                </div>
              )}
            </div>

            <div className="relative border-t border-slate-800/60 pt-4 mt-4 flex gap-2">
              <button
                onClick={() => handleSendMessage(inputValue)}
                className={`p-3.5 rounded-xl cursor-pointer shadow transition-all duration-300 ${getThemeBtnClass()}`}
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="اطرح سؤالاً استراتيجياً أو اطلب تحليل فرصة أو صياغة مذكرة قرار"
                value={inputValue}
                onChange={event => setInputValue(event.target.value)}
                onKeyDown={event =>
                  event.key === 'Enter' && handleSendMessage(inputValue)
                }
                className="flex-1 bg-[#16182c] border border-slate-800 focus:border-[var(--theme-accent)] rounded-xl px-4 text-xs text-slate-200 focus:outline-none text-right"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#121422] rounded-3xl border border-slate-800/80 p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 justify-end">
                <Sparkles className={`w-4 h-4 ${getThemeTextClass()} animate-pulse`} />
                أدلة تحليلية سريعة
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                استخدم أحد الطلبات لبدء تحليل متسق مع مسار مختبر الفرص:
              </p>
              <div className="space-y-2.5">
                {presetPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-right bg-[#16182c] hover:bg-[#1f213a] border border-slate-800/60 hover:border-slate-700 p-3 rounded-xl text-[11px] text-slate-300 hover:text-white transition-all leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMode('opportunities')}
              className={`w-full rounded-3xl border p-5 text-right ${getThemeSoftClass()} hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex justify-between items-center gap-3">
                <Radar className={`w-7 h-7 ${getThemeTextClass()}`} />
                <div>
                  <p className={`text-xs font-black ${getThemeTextClass()}`}>
                    تحويل الإجابة إلى دراسة
                  </p>
                  <h4 className="text-base font-black text-white mt-1">
                    افتح مختبر الفرص
                  </h4>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-6 mt-3">
                سجل الفرصة، اربط الأدلة، ابنِ المقارنات والسيناريوهات، ثم أصدر مذكرة قرار قابلة للاعتماد.
              </p>
            </button>

            <div className={`p-5 rounded-2xl border ${getThemeSoftClass()} space-y-3`}>
              <span className="text-xs font-black text-slate-200 flex items-center gap-2 justify-end">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                حوكمة الذكاء التنفيذي
              </span>
              <div className="space-y-2">
                {[
                  'كل نتيجة مرتبطة بافتراض أو دليل',
                  'درجة ثقة للمعلومات والمقارنات',
                  'فصل التوصية عن قرار الاعتماد',
                  'تسجيل المخاطر وشروط الانتقال',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Zap className={`w-3 h-3 ${getThemeTextClass()}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
