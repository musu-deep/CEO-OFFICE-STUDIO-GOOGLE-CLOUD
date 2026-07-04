import { useState } from 'react';
import { Clock, Check, X, Shield, Calendar, User, MessageSquare } from 'lucide-react';
import { MeetingRequest, PlatformTheme } from '../types';

interface MeetingRequestsViewProps {
  meetingRequests: MeetingRequest[];
  setMeetingRequests: (reqs: MeetingRequest[]) => void;
  theme: PlatformTheme;
}

export default function MeetingRequestsView({ meetingRequests, setMeetingRequests, theme }: MeetingRequestsViewProps) {
  
  const handleStatusChange = (requestId: string, newStatus: MeetingRequest['status']) => {
    const updated = meetingRequests.map((r) => {
      if (r.id === requestId) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    setMeetingRequests(updated);
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
    }
  };

  const getThemeBadgeClass = (status: MeetingRequest['status']) => {
    switch (status) {
      case 'معتمد':
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40';
      case 'بانتظار المراجعة':
        return 'bg-amber-950/40 text-amber-400 border border-amber-900/40';
      case 'مرفوض':
        return 'bg-rose-950/40 text-rose-400 border border-rose-900/40';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 11 */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
          طلبات الاجتماع والمواعيد
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          جدولة لقاء مع الرئيس التنفيذي
        </h2>
        <span className="text-xs text-slate-400">
          {meetingRequests.filter(r => r.status === 'بانتظار المراجعة').length} طلب معلق بانتظار تصديقكم الكريم
        </span>
      </div>

      {/* Requests List exactly as depicted on Page 11 */}
      <div className="space-y-5">
        {meetingRequests.map((r) => {
          const isPending = r.status === 'بانتظار المراجعة';
          const isApproved = r.status === 'معتمد';
          
          return (
            <div 
              key={r.id}
              className="bg-[#121422] rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between gap-5 hover:border-slate-700/80 transition-all duration-300 shadow-lg relative text-right"
            >
              {/* Highlight strip based on status */}
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                isApproved ? 'bg-emerald-500' : isPending ? 'bg-amber-500' : 'bg-rose-500'
              }`}></div>

              <div className="flex justify-between items-start flex-wrap gap-4">
                
                {/* Actions panel */}
                <div className="flex gap-2 w-full md:w-auto justify-end order-2 md:order-1">
                  {isPending ? (
                    <>
                      <button 
                        onClick={() => handleStatusChange(r.id, 'معتمد')}
                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>اعتماد اللقاء</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange(r.id, 'مرفوض')}
                        className="flex items-center gap-1 px-4 py-2 bg-rose-900/40 hover:bg-rose-800/40 text-rose-300 border border-rose-800/30 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>رفض</span>
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${getThemeBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  )}
                </div>

                {/* Left metadata & title - matches exactly Page 11 */}
                <div className="space-y-2 flex-1 order-1 md:order-2">
                  <div className="flex items-center gap-3 justify-start flex-wrap">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                      {r.sector}
                    </span>
                    
                    <span className="text-xs font-semibold text-amber-500 font-sans">
                      {r.proposedDate} ، {r.proposedTime} م
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-100">{r.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{r.description}</p>
                  
                  {/* Detailed icons info */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-sans mt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>المدة المقترحة: {r.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span>بواسطة: {r.proposer}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
