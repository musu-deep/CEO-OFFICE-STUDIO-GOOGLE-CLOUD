import React, { useState } from 'react';
import { Video, Plus, Calendar, Clock, MapPin, Users, X, Info, MonitorPlay } from 'lucide-react';
import { Meeting, PlatformTheme } from '../types';

interface MeetingsViewProps {
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
  theme: PlatformTheme;
}

export default function MeetingsView({ meetings, setMeetings, theme }: MeetingsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [showVideoSim, setShowVideoSim] = useState(false);
  const [activeCallTitle, setActiveCallTitle] = useState('');
  
  // New meeting form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('2026-06-16');
  const [newTime, setNewTime] = useState('10:00');
  const [newDuration, setNewDuration] = useState('60');
  const [newType, setNewType] = useState<'دوري' | 'فردي' | 'طارئ'>('دوري');
  const [newLocation, setNewLocation] = useState('غرفة مجلس الإدارة');
  const [newInvitees, setNewInvitees] = useState('5');

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newMeet: Meeting = {
      id: `m-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      date: newDate,
      time: newTime,
      duration: Number(newDuration) || 60,
      type: newType,
      location: newLocation,
      inviteesCount: Number(newInvitees) || 0,
      status: 'مجدول'
    };

    setMeetings([newMeet, ...meetings]);
    setShowModal(false);
    
    // Reset Form
    setNewTitle('');
    setNewDesc('');
  };

  const startMeetingCall = (title: string) => {
    setActiveCallTitle(title);
    setShowVideoSim(true);
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
      
      {/* Header exactly like Page 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            الاجتماعات والمحاضر
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            إدارة الاجتماعات التنفيذية
          </h2>
          <span className="text-xs text-slate-400">
            {meetings.length} اجتماع مجدول نشط على نظام أراك المرئي والمحلي
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>اجتماع جديد</span>
        </button>
      </div>

      {/* Video Simulated Calling Interface */}
      {showVideoSim && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl p-6 relative flex flex-col items-center justify-center min-h-[400px] animate-[fadeIn_0.3s_ease_out]">
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-bold font-sans">بث مباشر آمن ومغلق</span>
          </div>

          <div className="text-center space-y-4 max-w-md">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center mx-auto text-black font-extrabold text-3xl animate-pulse">
              د
            </div>
            <h3 className="text-lg font-bold text-slate-100">{activeCallTitle}</h3>
            <p className="text-xs text-slate-400">
              أهلاً بك سعادة الرئيس د. علي في منصة أراك المرئية. جاري توصيل الصوت والصورة وتهيئة جلسة إجتماع الإدارة العليا مع المكاتب الإقليمية بين جدة والقاهرة...
            </p>
            
            {/* Simulation visual lines */}
            <div className="flex justify-center gap-1.5 h-8 items-end">
              <span className="w-1.5 bg-amber-500 rounded h-4 animate-[bounce_0.6s_infinite_0.1s]"></span>
              <span className="w-1.5 bg-amber-500 rounded h-8 animate-[bounce_0.6s_infinite_0.3s]"></span>
              <span className="w-1.5 bg-amber-500 rounded h-6 animate-[bounce_0.6s_infinite_0.2s]"></span>
              <span className="w-1.5 bg-amber-500 rounded h-3 animate-[bounce_0.6s_infinite_0.4s]"></span>
              <span className="w-1.5 bg-amber-500 rounded h-7 animate-[bounce_0.6s_infinite_0.1s]"></span>
            </div>

            <button 
              onClick={() => setShowVideoSim(false)}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              مغادرة الجلسة المرئية
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Meetings List - exactly matching Page 1 layout */}
      <div className="space-y-4">
        {meetings.map((m) => {
          const isEmergency = m.type === 'طارئ';
          const isRecurring = m.type === 'دوري';
          
          return (
            <div 
              key={m.id}
              className="bg-[#121422] rounded-2xl border border-slate-800/80 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700/80 transition-all duration-300 shadow-lg relative overflow-hidden text-right"
            >
              {/* Emergency indicator strip */}
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${isEmergency ? 'bg-rose-600' : isRecurring ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>

              {/* Left action panel: Join Button exactly like Page 1 */}
              <div className="flex flex-col gap-2 w-full md:w-auto items-end md:items-start flex-shrink-0">
                <button 
                  onClick={() => startMeetingCall(m.title)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161a2e] hover:bg-amber-600 hover:text-slate-950 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition-all duration-300"
                >
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>دخول الاجتماع</span>
                </button>
                <span className="text-[10px] text-slate-500 font-sans">معرف الاجتماع آمن ومحمي</span>
              </div>

              {/* Middle meeting details */}
              <div className="space-y-2 flex-1 pr-4">
                <div className="flex items-center gap-3 justify-start flex-wrap">
                  {/* Badge at top right */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isEmergency ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' : 
                    isRecurring ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 
                    'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                  }`}>
                    {m.type}
                  </span>
                  
                  {/* Timing exactly like Page 1 */}
                  <span className="text-[11px] text-slate-400 font-sans">
                    {m.date} ، {m.time} م
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{m.description}</p>
                
                {/* Icons metadata matching exactly */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-sans mt-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>{m.duration} د</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <span className="truncate max-w-[150px]">{m.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    <span>{m.inviteesCount} مدعوين</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* New Meeting Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-500" />
                <span>برمجة وجدولة اجتماع تنفيذي</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">موضوع الاجتماع</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: مناقشة تقرير المطابقة والمخاطر" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">أجندة وتفاصيل الاجتماع</label>
                <textarea 
                  rows={2}
                  placeholder="اكتب النقاط الرئيسية للأجندة..." 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">تاريخ الاجتماع</label>
                  <input 
                    type="date" 
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">توقيت البدء</label>
                  <input 
                    type="time" 
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">مدة الاجتماع (بالدقائق)</label>
                  <input 
                    type="number" 
                    placeholder="60" 
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">نوع الاجتماع</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="دوري">دوري</option>
                    <option value="فردي">فردي</option>
                    <option value="طارئ">طارئ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">الموقع / قاعة الاجتماع</label>
                  <input 
                    type="text" 
                    placeholder="مثال: قاعة مجلس الإدارة" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">عدد المدعوين</label>
                  <input 
                    type="number" 
                    placeholder="5" 
                    value={newInvitees}
                    onChange={(e) => setNewInvitees(e.target.value)}
                    className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors text-slate-300"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${getThemeBtnClass()}`}
                >
                  جدولة الاجتماع
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
