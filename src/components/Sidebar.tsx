import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  Video, 
  Clock, 
  FolderClosed, 
  Mail, 
  Mic, 
  Sliders, 
  ShieldAlert, 
  Scale, 
  BrainCircuit, 
  BarChart3, 
  Users, 
  Bell, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationsCount: number;
  theme: PlatformTheme;
  userName: string;
  userRole: string;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  unreadNotificationsCount, 
  theme,
  userName,
  userRole
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'لوحة المتابعة', icon: LayoutDashboard },
    { id: 'daily_briefing', label: 'الموجز اليومي', icon: FileText },
    { id: 'projects', label: 'المشاريع', icon: Briefcase },
    { id: 'tasks', label: 'إدارة المهام', icon: CheckSquare },
    { id: 'calendar', label: 'التقويم', icon: Calendar },
    { id: 'meetings', label: 'الاجتماعات', icon: Video },
    { id: 'meeting_requests', label: 'جدولة اللقاءات', icon: Clock },
    { id: 'documents', label: 'مركز الوثائق', icon: FolderClosed },
    { id: 'messages', label: 'مركز الرسائل', icon: Mail },
    { id: 'voice_assistant', label: 'الوكيل الصوتي', icon: Mic },
    { id: 'secretariat', label: 'السكرتارية التنفيذية', icon: Sliders },
    { id: 'governance', label: 'الرقابة والتفتيش', icon: ShieldAlert },
    { id: 'legal', label: 'الشؤون القانونية', icon: Scale },
    { id: 'ai_advisor', label: 'المستشار الذكي', icon: BrainCircuit },
    { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3 },
    { id: 'team', label: 'فريق العمل', icon: Users },
    { id: 'notifications', label: 'مركز الإشعارات', icon: Bell, badge: unreadNotificationsCount },
    { id: 'settings', label: 'الإعدادات والسمات', icon: Settings },
  ];

  // Colors based on selected theme
  const getThemeBadgeColor = () => {
    switch (theme) {
      case 'vision_2030':
        return 'bg-emerald-600 text-white';
      case 'golden_luxury':
        return 'bg-amber-500 text-black';
      case 'midnight_navy':
        return 'bg-blue-600 text-white';
      case 'spring':
        return 'bg-lime-600 text-white';
    }
  };

  return (
    <div className="w-80 bg-[#0f111a] border-l border-slate-800/80 h-screen flex flex-col fixed top-0 right-0 z-20 text-right overflow-hidden select-none">
      
      {/* Brand Logo Card */}
      <div className="p-5 border-b border-slate-800/80 bg-[#121522]">
        <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 shadow-lg relative overflow-hidden group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          
          {/* Circular Logo exactly matching screenshots */}
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center relative flex-shrink-0 border border-slate-700/50">
            <div className="absolute inset-1 rounded-full border-2 border-dashed border-emerald-500 animate-[spin_20s_linear_infinite]"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center font-bold text-black text-sm relative">
              A
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border border-black"></div>
            </div>
          </div>
          
          <div className="flex flex-col text-right">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight leading-none">مجموعة أراك للتنمية</h1>
            <span className="text-xs font-semibold text-amber-500/90 tracking-wide font-sans mt-0.5">Araak Group</span>
            <span className="text-[10px] text-slate-400 leading-none mt-1">مستقبل التنمية | Development Future</span>
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] font-sans tracking-widest text-slate-500 font-bold uppercase block">Executive Platform</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          // Style active tab based on selected theme
          let activeStyles = "";
          if (isActive) {
            switch (theme) {
              case 'vision_2030':
                activeStyles = "bg-emerald-950/40 text-emerald-400 border-r-4 border-emerald-500 font-bold";
                break;
              case 'golden_luxury':
                activeStyles = "bg-amber-950/40 text-amber-400 border-r-4 border-amber-500 font-bold";
                break;
              case 'midnight_navy':
                activeStyles = "bg-blue-950/40 text-blue-400 border-r-4 border-blue-500 font-bold";
                break;
              case 'spring':
                activeStyles = "bg-lime-950/40 text-lime-400 border-r-4 border-lime-500 font-bold";
                break;
            }
          } else {
            activeStyles = "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100";
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 group text-right ${activeStyles}`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-100'}`} />
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getThemeBadgeColor()}`}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronLeft className="w-3.5 h-3.5 opacity-60 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* User Profile Card Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#111320] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-extrabold text-lg border border-amber-500/30">
            {userName.charAt(0) || 'د'}
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-slate-100">{userName}</span>
            <span className="text-xs text-slate-400">{userRole}</span>
          </div>
        </div>
        
        <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer" title="تسجيل الخروج">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
