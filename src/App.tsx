import { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckSquare, 
  Calendar, 
  Video, 
  UserCheck, 
  FolderClosed, 
  MessageSquare, 
  ShieldAlert, 
  Scale, 
  Brain, 
  Mic, 
  BarChart3, 
  Globe, 
  Map, 
  FileText, 
  Bell, 
  Settings, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  HelpCircle,
  LogOut,
  Info
} from 'lucide-react';
import { PlatformTheme, AppUser } from './types';

// Importing views
import ProjectsView from './components/ProjectsView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import MeetingsView from './components/MeetingsView';
import MeetingRequestsView from './components/MeetingRequestsView';
import DocumentCenterView from './components/DocumentCenterView';
import MessagesView from './components/MessagesView';
import SecretariatView from './components/SecretariatView';
import GovernanceView from './components/GovernanceView';
import LegalView from './components/LegalView';
import AiAdvisorView from './components/AiAdvisorView';
import VoiceAssistantView from './components/VoiceAssistantView';
import ReportsView from './components/ReportsView';
import ArakEgyptView from './components/ArakEgyptView';
import ArakLogisticView from './components/ArakLogisticView';
import UserManagementView from './components/UserManagementView';
import LoginView from './components/LoginView';

import { 
  initialNotifications, 
  initialTeamMembers,
  initialProjects,
  initialTasks,
  initialMeetings,
  initialMeetingRequests,
  initialAppUsers
} from './data/mockData';

export default function App() {
  const [theme, setTheme] = useState<PlatformTheme>('vision_2030');
  const [activeView, setActiveView] = useState<string>('reports');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [time, setTime] = useState('');

  // Authentication & Security State Layer
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('arak_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('arak_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialAppUsers;
      }
    }
    return initialAppUsers;
  });
  const [ceoAdminMode, setCeoAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('arak_ceo_admin_mode') === 'true';
  });

  // LocalStorage Synchronizers
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('arak_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('arak_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('arak_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('arak_ceo_admin_mode', String(ceoAdminMode));
  }, [ceoAdminMode]);

  const handleUpdateUser = (updatedUser: AppUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleAddUser = (newUser: AppUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Integrated Platform State
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [meetingRequests, setMeetingRequests] = useState(initialMeetingRequests);

  // Directives-to-Task integration handler
  const handleAddTask = (title: string, sector: string, priority: 'حرج' | 'هام' | 'عادي') => {
    const newTask = {
      id: 't_' + Date.now(),
      title: title,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
      sector: sector,
      priority: priority,
      status: 'قيد التنفيذ' as const,
      assignee: 'نائب الرئيس - التنمية'
    };
    setTasks(prev => [newTask, ...prev]);

    // Push standard alert notification
    const newAlert = {
      id: 'n_' + Date.now(),
      title: `تكليف جديد: ${title}`,
      time: 'الآن',
      type: 'warning' as const,
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      case 'vision_2030': return 'bg-emerald-600';
      case 'golden_luxury': return 'bg-amber-600';
      case 'midnight_navy': return 'bg-blue-600';
      case 'spring': return 'bg-lime-600';
    }
  };

  const getThemeBorderClass = () => {
    switch (theme) {
      case 'vision_2030': return 'border-emerald-500/20';
      case 'golden_luxury': return 'border-amber-500/20';
      case 'midnight_navy': return 'border-blue-500/20';
      case 'spring': return 'border-lime-500/20';
    }
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Sidebar Menu Items grouped and filtered dynamically
  const rawMenuGroups = [
    {
      title: 'اتخاذ القرارات والذكاء الاصطناعي',
      items: [
        { id: 'reports', name: 'التقارير والتحليلات الجغرافية', icon: BarChart3 },
        { id: 'ai-advisor', name: 'المستشار الاستراتيجي الذكي', icon: Brain },
        { id: 'voice-assistant', name: 'الوكيل الصوتي التنفيذي', icon: Mic },
      ]
    },
    {
      title: 'الإدارة التنفيذية للمكتب',
      items: [
        { id: 'projects', name: 'المشاريع والقطاعات التنموية', icon: Building2 },
        { id: 'tasks', name: 'التكاليف والمهام النشطة', icon: CheckSquare },
        { id: 'secretariat', name: 'السكرتارية التنفيذية ', icon: FolderClosed },
        { id: 'messages', name: 'القرارات والتوجيهات ', icon: MessageSquare },
      ]
    },
    {
      title: 'اللقاءات والمحاضر',
      items: [
        { id: 'calendar', name: 'التقويم واللقاءات السنوية', icon: Calendar },
        { id: 'meetings', name: 'اجتماعات حية وفيديو مباشر', icon: Video },
        { id: 'meeting-requests', name: 'طلبات اللقاء والزيارات الخارجية', icon: UserCheck },
      ]
    },
    {
      title: 'الرقابة والالتزامات والوثائق',
      items: [
        { id: 'governance', name: 'الرقابة والتفتيش والمتابعة', icon: ShieldAlert },
        { id: 'legal', name: 'الشؤون القانونية', icon: Scale },
        { id: 'documents', name: 'مركز الوثائق وقاعدة المعرفة', icon: FileText },
        // Only visible to Admin or CEO (when admin mode is active)
        ...(currentUser?.role === 'admin' || (currentUser?.role === 'ceo' && ceoAdminMode) ? [
          { id: 'users', name: 'إدارة المستخدمين والصلاحيات', icon: Settings }
        ] : [])
      ]
    },
    {
      title: 'القطاعات الخارجية وسلاسل الإمداد',
      items: [
        { id: 'egypt', name: 'فرع اراك التنمية بجمهورية مصر', icon: Globe },
        { id: 'logistic', name: 'اراك لوجستيك ', icon: Map },
      ]
    }
  ];

  const menuGroups = rawMenuGroups.map(group => {
    const filteredItems = group.items.filter(item => {
      if (currentUser?.role === 'admin' || currentUser?.role === 'ceo') {
        return true;
      }
      return currentUser?.allowedViews.includes(item.id);
    });
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  // Protection Guard: If current active view is not allowed, revert to first allowed view
  useEffect(() => {
    if (!currentUser) return;
    const allAllowedViewIds = currentUser.role === 'ceo' || currentUser.role === 'admin'
      ? ['reports', 'ai-advisor', 'voice-assistant', 'projects', 'tasks', 'secretariat', 'messages', 'calendar', 'meetings', 'meeting-requests', 'governance', 'legal', 'documents', 'egypt', 'logistic', 'users']
      : currentUser.allowedViews;
      
    if (!allAllowedViewIds.includes(activeView)) {
      if (allAllowedViewIds.length > 0) {
        setActiveView(allAllowedViewIds[0]);
      }
    }
  }, [currentUser, activeView, ceoAdminMode]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'reports': return <ReportsView theme={theme} />;
      case 'ai-advisor': return <AiAdvisorView theme={theme} />;
      case 'voice-assistant': return <VoiceAssistantView theme={theme} />;
      case 'projects': return <ProjectsView projects={projects} setProjects={setProjects} theme={theme} />;
      case 'tasks': return <TasksView tasks={tasks} setTasks={setTasks} theme={theme} />;
      case 'secretariat': return <SecretariatView theme={theme} />;
      case 'messages': return <MessagesView theme={theme} onAddTask={handleAddTask} />;
      case 'calendar': return <CalendarView theme={theme} />;
      case 'meetings': return <MeetingsView meetings={meetings} setMeetings={setMeetings} theme={theme} />;
      case 'meeting-requests': return <MeetingRequestsView meetingRequests={meetingRequests} setMeetingRequests={setMeetingRequests} theme={theme} />;
      case 'governance': return <GovernanceView theme={theme} />;
      case 'legal': return <LegalView theme={theme} />;
      case 'documents': return <DocumentCenterView theme={theme} />;
      case 'egypt': return <ArakEgyptView theme={theme} />;
      case 'logistic': return <ArakLogisticView theme={theme} />;
      case 'users':
        return (
          <UserManagementView
            users={users}
            onUpdateUser={handleUpdateUser}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
            theme={theme}
            ceoAdminMode={ceoAdminMode}
          />
        );
      default: return <ReportsView theme={theme} />;
    }
  };

  if (!currentUser) {
    return (
      <LoginView 
        users={users} 
        onLoginSuccess={(user) => setCurrentUser(user)} 
        theme={theme} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090a12] text-slate-100 flex flex-row-reverse font-sans overflow-x-hidden antialiased">
      
      {/* Sidebar on the Right (Arabic layout standard) */}
      <aside className="w-80 bg-[#0e101f] border-l border-slate-800/80 flex flex-col justify-between flex-shrink-0 z-30 h-screen sticky top-0">
        <div className="flex flex-col h-full overflow-y-auto pr-2">
          
          {/* Top Logo and Title matches Page 1 exactly */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3 justify-end">
            <div className="text-right">
              <h1 className="text-lg font-black text-white tracking-tight">CEO DIGITAL OFFICE</h1>
              <span className={`text-[10px] font-bold block ${getThemeTextClass()}`}>مكتب الرئيس التنفيذي </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Layers className="w-5 h-5 text-slate-950 font-black" />
            </div>
          </div>
 
          {/* Quick Active CEO Status Tracker */}
          <div className="m-4 p-4 rounded-xl bg-[#14172c] border border-slate-800 flex justify-between items-center text-right">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500">التوقيت المحلي للمكتب</span>
              <span className="text-xs font-mono font-bold text-amber-500">{time || '12:00:00'}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-semibold">المستخدم النشط</span>
              <span className="text-xs font-extrabold text-white">{currentUser.name}</span>
            </div>
          </div>
 
          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-6">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block px-3 text-right">
                  {group.title}
                </span>
 
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeView === item.id;
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                          isActive 
                            ? `${getThemeBgClass()} text-white font-black shadow-lg shadow-amber-500/5` 
                            : 'text-slate-400 hover:text-slate-100 hover:bg-[#15172a]'
                        }`}
                      >
                        <ChevronLeft className={`w-3 h-3 transition-transform ${isActive ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 -translate-x-1'}`} />
                        <div className="flex items-center gap-2.5">
                          <span>{item.name}</span>
                          <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
 
        </div>
 
        {/* Bottom copyright & logout */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0c0d1a]">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <button 
              onClick={() => {
                setCurrentUser(null);
                setCeoAdminMode(false);
                setActiveView('reports');
              }}
              className="text-slate-400 hover:text-rose-400 font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> تسجيل خروج
            </button>
            <span>© ٢٠٢٦ مجموعة اراك للتنمية</span>
          </div>
        </div>
      </aside>
 
      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        
        {/* Top Sticky Header */}
        <header className="h-16 bg-[#0c0d1b] border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
          
          {/* Right Header: Fast Search and System indicators */}
          <div className="flex items-center gap-4">
            
            {/* Quick Vision Switcher */}
            <div className="flex items-center gap-1.5 bg-[#121422] border border-slate-800 rounded-xl px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as PlatformTheme)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer font-bold text-right"
              >
                <option value="vision_2030">سمة رؤية ٢٠٣٠ (الأخضر السيادي)</option>
                <option value="golden_luxury">سمة الفخامة الذهبية (الملكي)</option>
                <option value="midnight_navy">سمة كحلي الليل (الوقار)</option>
                <option value="spring">سمة ربيع أراك (الحيوي)</option>
              </select>
            </div>

            {/* CEO Admin Mode Toggle Switch */}
            {currentUser?.role === 'ceo' && (
              <button
                onClick={() => {
                  setCeoAdminMode(!ceoAdminMode);
                  const newAlert = {
                    id: 'n_' + Date.now(),
                    title: !ceoAdminMode 
                      ? 'تم تفعيل وضع الآدمن الفني الاستثنائي للرئيس التنفيذي بنجاح' 
                      : 'تم تجميد وضع الآدمن والعودة لوضع القراءة والرصد فقط',
                    time: 'الآن',
                    type: 'success' as const,
                    read: false
                  };
                  setNotifications(prev => [newAlert, ...prev]);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                  ceoAdminMode 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow shadow-amber-500/5' 
                    : 'bg-[#121422] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${ceoAdminMode ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`}></span>
                <span>{ceoAdminMode ? 'تفعيل دور الآدمن: نشط' : 'تفعيل دور الآدمن'}</span>
              </button>
            )}
 
            {/* Quick help button */}
            <button 
              onClick={() => alert('نظام المساعد التنفيذي متصل بقاعدة البيانات وعقود وميزانيات المجموعة لرصد الأداء واتخاذ القرار.')}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer"
              title="معلومات النظام"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
 
          </div>
 
          {/* Left Header: Profile + Notification alerts */}
          <div className="flex items-center gap-4">
            
            {/* Notifications Dropdown Container */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);
                  setShowProfileDropdown(false);
                }}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 block animate-pulse"></span>
                )}
              </button>
 
              {showNotificationDropdown && (
                <div className="absolute left-0 mt-3 w-80 bg-[#121422] border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden text-right">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#16182c]">
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      تحديد كمقرؤ الكل
                    </button>
                    <span className="text-xs font-black text-slate-200">الإشعارات والتنبيهات الأمنية</span>
                  </div>
                  <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationRead(n.id)}
                        className={`p-4 hover:bg-slate-800/40 cursor-pointer transition-colors ${!n.read ? 'bg-amber-500/5' : ''}`}
                      >
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{n.title}</p>
                        <div className="flex justify-between items-center mt-2 text-[9px] text-slate-500">
                          <span className={`font-bold uppercase ${
                            n.type === 'critical' ? 'text-rose-400' :
                            n.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                          }`}>
                            {n.type === 'critical' ? 'حرج' : n.type === 'warning' ? 'تحذير' : 'إحاطة'}
                          </span>
                          <span>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
 
            {/* Profile trigger dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotificationDropdown(false);
                }}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-black text-white block">{currentUser.name}</span>
                  <span className="text-[9px] text-slate-500 block font-sans">{currentUser.email}</span>
                </div>
                <div className={`w-8 h-8 rounded-lg ${currentUser.color || 'bg-amber-600'} text-slate-950 flex items-center justify-center font-black text-sm shadow`}>
                  {currentUser.avatar}
                </div>
              </button>
 
              {showProfileDropdown && (
                <div className="absolute left-0 mt-3 w-56 bg-[#121422] border border-slate-800 rounded-xl shadow-2xl z-40 overflow-hidden text-right">
                  <div className="p-4 border-b border-slate-800 bg-[#16182c]">
                    <span className="text-xs font-bold text-slate-300 block">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans">{currentUser.title}</span>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => alert(`رتبة حسابك: ${currentUser.title} ومسجل بنجاح.`)}
                      className="w-full text-right hover:bg-slate-800 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      إعدادات الحساب والأمان
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentUser(null);
                        setCeoAdminMode(false);
                        setActiveView('reports');
                      }}
                      className="w-full text-right hover:bg-rose-950/20 px-3 py-2 rounded-lg text-xs text-rose-400 font-bold"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
 
          </div>
 
        </header>
 
        {/* View content container */}
        <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </div>
 
      </main>
 
    </div>
  );
}
