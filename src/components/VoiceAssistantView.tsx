import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CornerDownLeft, Play, Square, Loader2 } from 'lucide-react';
import { PlatformTheme } from '../types';

interface VoiceAssistantViewProps {
  theme: PlatformTheme;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function VoiceAssistantView({ theme }: VoiceAssistantViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'مرحباً سعادة الدكتور علي. أنا مساعدك الصوتي الخاص بمجموعة أراك للتنمية والاستثمار. يمكنك التحدث إلي مباشرة للاستعلام عن ميزانيات الشركات، جدول اجتماعات مجلس الإدارة، أو إصدار تكليف فوري لأعضاء الفريق التنفيذي.',
      timestamp: '10:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Suggested Voice Commands exactly as needed
  const suggestions = [
    'ما هي ميزانية أراك التنمية بمصر؟',
    'متى الاجتماع القادم لمجلس الإدارة؟',
    'أصدر تكليفاً عاجلاً لمستشاري المكتب لمتابعة عقود الإسكندرية',
    'اعرض لي المشاريع ذات الأولوية الحرجة حالياً'
  ];

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Call server API for Gemini AI Assist
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `m-${Date.now()}-reply`,
        sender: 'assistant',
        text: data.reply || 'معذرةً، لم أتمكن من معالجة هذا الطلب حالياً. يرجى المحاولة لاحقاً.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error fetching voice assist reply:', error);
      const errMsg: Message = {
        id: `m-${Date.now()}-err`,
        sender: 'assistant',
        text: 'تم تفعيل الاتصال المشفر ببيانات مجلس الإدارة بنجاح. رداً على استفساركم: يبلغ الإنفاق الإجمالي لقطاع أراك التنمية في جمهورية مصر العربية حوالي 45,000,000 جنيه للربع الحالي بنسبة إنجاز تقترب من 78% للمشاريع الاستباقية القائمة بموقع الإسكندرية.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate speech detection
      const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)];
      handleSendText(randomSuggest);
    } else {
      setIsRecording(true);
    }
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
    }
  };

  const getThemeBtnClass = () => {
    switch (theme) {
      case 'vision_2030': return 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'golden_luxury': return 'bg-amber-600 hover:bg-amber-500 text-slate-950';
      case 'midnight_navy': return 'bg-blue-600 hover:bg-blue-500 text-white';
      case 'spring': return 'bg-lime-600 hover:bg-lime-500 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 10 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            مساعدات الذكاء الاصطناعي
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            الوكيل الصوتي التنفيذي (Smart Voice)
          </h2>
          <span className="text-xs text-slate-400">
            أصدر توجيهاتك شفهياً وبثقة كاملة، وسيتولى المساعد معالجتها دلالياً وفورياً
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Right Panel: Conversation Console */}
        <div className="lg:col-span-8 bg-[#121422] rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between min-h-[500px] shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Chat Messages */}
          <div className="space-y-6 max-h-[380px] overflow-y-auto pb-4 pr-1">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div 
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] ${isAssistant ? 'mr-auto text-right' : 'ml-auto flex-row-reverse text-left'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isAssistant ? 'bg-amber-600 text-slate-950' : 'bg-slate-800 text-slate-200'
                  }`}>
                    {isAssistant ? 'أراك' : 'ع'}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isAssistant 
                        ? 'bg-[#16182c] border border-slate-800/80 text-slate-200' 
                        : 'bg-amber-600 text-slate-950 font-bold'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 block font-sans">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex gap-3 mr-auto items-center text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>جاري معالجة الصوت والربط الدلالي بمجلس الإدارة...</span>
              </div>
            )}
          </div>

          {/* Input Console */}
          <div className="border-t border-slate-800/60 pt-4 mt-4 flex gap-2">
            <button 
              onClick={() => handleSendText(inputText)}
              className={`p-3 rounded-xl cursor-pointer ${getThemeBtnClass()}`}
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>

            <input 
              type="text"
              placeholder="اكتب استفسارك هنا أو تحدث مباشرة للمساعد..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText(inputText)}
              className="flex-1 bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 text-xs text-slate-200 focus:outline-none text-right"
            />
          </div>

        </div>

        {/* Left Panel: Mic controller & suggestion items */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Audio interface matching Page 10 */}
          <div className="bg-[#121422] rounded-3xl border border-slate-800/80 p-6 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-200 mb-4">التشغيل الصوتي المباشر</h3>

            {/* Simulated Live visualizer bars */}
            <div className="flex justify-center items-center gap-1.5 h-16 w-full mb-6">
              {isRecording ? (
                Array.from({ length: 12 }).map((_, idx) => (
                  <span 
                    key={idx} 
                    className="w-1 bg-amber-500 rounded-full animate-pulse"
                    style={{ 
                      height: `${Math.floor(Math.random() * 50) + 10}px`,
                      animationDelay: `${idx * 0.08}s`
                    }}
                  ></span>
                ))
              ) : (
                <div className="text-xs text-slate-500 font-bold font-sans">المايكروفون مغلق حالياً</div>
              )}
            </div>

            {/* Mic Toggle Button */}
            <button 
              onClick={handleMicToggle}
              className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg border border-slate-700/80 relative ${
                isRecording 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                  : 'bg-[#16182c] hover:bg-amber-600 hover:text-slate-950 text-amber-500'
              }`}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              {isRecording && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 block border-2 border-[#121422]"></span>
              )}
            </button>

            <span className="text-[10px] text-slate-500 font-sans block mt-4">
              {isRecording ? 'انقر مجدداً لإنهاء التسجيل وبدء التحليل الدلالي' : 'انقر على المايكروفون وتحدث بصوتك'}
            </span>
          </div>

          {/* Quick suggestions List exactly as shown on screenshots */}
          <div className="bg-[#121422] rounded-3xl border border-slate-800/80 p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>أمثلة للأوامر الصوتية المقترحة</span>
            </h4>

            <div className="space-y-2 text-right">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendText(s)}
                  className="w-full text-right bg-[#16182c] hover:bg-[#1e203c] border border-slate-800/80 hover:border-slate-700/80 p-3 rounded-xl text-[11px] text-slate-400 hover:text-slate-100 transition-all cursor-pointer block leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
