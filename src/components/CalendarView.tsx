import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Plus, X, Video } from 'lucide-react';
import { PlatformTheme } from '../types';

interface CalendarViewProps {
  theme: PlatformTheme;
}

interface CalendarEvent {
  day: number;
  title: string;
  time: string;
}

export default function CalendarView({ theme }: CalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed: 5)
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00');

  // Days headings in Arabic exactly matching Page 3
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Static list of initial events to populate June 2026 exactly as shown on Page 3
  const [events, setEvents] = useState<CalendarEvent[]>([
    { day: 16, title: 'اجتماع دوري شهر مايو', time: '20:26' },
    { day: 16, title: 'اجتماع مصنع الحديد والصلب', time: '19:27' },
    { day: 20, title: 'مراجعة عقود الإسكندرية', time: '11:00' },
    { day: 24, title: 'اجتماع اليوم الوطني للتخطيط', time: '09:00' },
    { day: 27, title: 'مراجعة ميزانية لوجستيك', time: '14:30' }
  ]);

  // June 2026 starts on Monday (Monday = Index 1 of weekdays where Sun = 0)
  // Number of days in June is 30.
  const daysInMonth = 30;
  const startOffset = 1; // June 1st is Monday

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay !== null && newEventTitle) {
      setEvents([...events, { day: selectedDay, title: newEventTitle, time: newEventTime }]);
      setShowEventModal(false);
      setNewEventTitle('');
    }
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowEventModal(true);
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

  const getThemeDayHighlight = () => {
    switch (theme) {
      case 'vision_2030': return 'border-emerald-500 bg-emerald-950/20';
      case 'golden_luxury': return 'border-amber-500 bg-amber-950/20';
      case 'midnight_navy': return 'border-blue-500 bg-blue-950/20';
      case 'spring': return 'border-lime-500 bg-lime-950/20';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            التقويم المؤسسي
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            تقويم تنفيذي ذكي
          </h2>
          <span className="text-xs text-slate-400">
            انقر على أي يوم لإضافة حدث جديد ومباشر • انقر لمراجعة مواعيد المجلس التنفيذي
          </span>
        </div>

        <button 
          onClick={() => handleDayClick(new Date().getDate())}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>حدث جديد</span>
        </button>
      </div>

      {/* Calendar Controller Month bar */}
      <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80 flex justify-between items-center">
        
        {/* Navigation month arrows */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
            className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button 
            className="px-4 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-xs font-bold text-slate-200 cursor-pointer"
            onClick={() => {
              setCurrentMonth(5); // reset to June
              setCurrentYear(2026);
            }}
          >
            اليوم
          </button>

          <button 
            onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Month Name label exactly like Page 3 */}
        <h3 className="text-xl font-black text-slate-100 font-sans flex items-center gap-2">
          <span className="text-amber-500 font-sans">{currentYear}</span>
          <span>{monthNames[currentMonth]}</span>
        </h3>

      </div>

      {/* Calendar Grid matching Page 3 */}
      <div className="bg-[#121422] rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl p-6">
        
        {/* Week Days Headings */}
        <div className="grid grid-cols-7 gap-3 mb-4 text-center">
          {weekDays.map((day) => (
            <div key={day} className="text-xs font-bold text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid of days */}
        <div className="grid grid-cols-7 gap-3 min-h-[450px]">
          
          {/* Empty cells before start offset */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-900/10 border border-transparent rounded-2xl"></div>
          ))}

          {/* June Days cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === 24; // June 24th is today in our dataset
            const dayEvents = events.filter(e => e.day === dayNum);

            return (
              <div 
                key={`day-${dayNum}`}
                onClick={() => handleDayClick(dayNum)}
                className={`bg-[#16182c]/60 hover:bg-[#1a1d35]/80 border p-3 rounded-2xl flex flex-col justify-between items-end cursor-pointer transition-all duration-200 group relative min-h-[90px] ${
                  isToday ? getThemeDayHighlight() + ' border-2' : 'border-slate-800/60'
                }`}
              >
                {/* Day number */}
                <span className={`text-sm font-extrabold font-sans leading-none ${isToday ? 'text-amber-400 scale-110' : 'text-slate-400'}`}>
                  {dayNum}
                </span>

                {/* Event badges exactly matching Page 3 layout */}
                <div className="w-full space-y-1 mt-2">
                  {dayEvents.map((ev, index) => (
                    <div 
                      key={index}
                      className="text-[9px] bg-slate-900/90 text-slate-300 border border-slate-800/60 p-1.5 rounded-lg flex items-center justify-between text-right truncate font-sans"
                    >
                      <Video className="w-2.5 h-2.5 text-amber-500 flex-shrink-0 ml-1" />
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div className="text-[8px] text-amber-500 font-bold text-left pr-1">
                      {dayEvents.length - 2}+ إضافي
                    </div>
                  )}
                </div>

                {/* Micro accent */}
                {isToday && (
                  <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </div>
            );
          })}

        </div>

      </div>

      {/* Event Insertion Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <span>إضافة حدث لليوم {selectedDay}</span>
              </h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">عنوان الفعالية / الاجتماع</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مراجعة خطة موازنة الحديد والصلب" 
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">التوقيت</label>
                <input 
                  type="time" 
                  required
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none font-sans"
                />
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors text-slate-300"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${getThemeBtnClass()}`}
                >
                  حفظ الحدث بالتقويم
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
