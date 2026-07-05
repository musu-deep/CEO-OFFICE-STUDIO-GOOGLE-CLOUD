import { useState, useEffect, type CSSProperties } from 'react';
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
  Info,
  Search,
  Command,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Bot,
  Zap
} from 'lucide-react';
import { PlatformTheme, AppUser } from './types';


type ThemeDesignTokens = {
  name: string;
  mainBg: string;
  sidebarBg: string;
  headerBg: string;
  panelBg: string;
  softPanelBg: string;
  text: string;
  bg: string;
  bgHover: string;
  border: string;
  strongBorder: string;
  glow: string;
  icon: string;
  gradientButton: string;
  activeMenu: string;
  selectRing: string;
  cssVars: CSSProperties;
};

const themeTokens: Record<PlatformTheme, ThemeDesignTokens> = {
  vision_2030: {
    name: 'سمة رؤية ٢٠٣٠',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.09),transparent_36%),linear-gradient(135deg,#06110d_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-emerald-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-emerald-500/[0.055] backdrop-blur-xl',
    text: 'text-emerald-400',
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-500',
    border: 'border-emerald-500/20',
    strongBorder: 'border-emerald-400/45',
    glow: 'shadow-emerald-500/20',
    icon: 'text-emerald-400',
    gradientButton: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
    activeMenu: 'bg-gradient-to-l from-emerald-500/95 to-teal-500/85 text-white border border-emerald-300/25 shadow-lg shadow-emerald-500/20',
    selectRing: 'focus-within:border-emerald-400/50 focus-within:ring-2 focus-within:ring-emerald-400/10',
    cssVars: {
      '--theme-accent': '#10b981',
      '--theme-accent-soft': 'rgba(16,185,129,.14)',
      '--theme-card': 'rgba(16,185,129,.055)',
      '--theme-border': 'rgba(16,185,129,.22)',
    } as CSSProperties,
  },
  golden_luxury: {
    name: 'سمة فخامة اراك',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.10),transparent_36%),linear-gradient(135deg,#160f05_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-amber-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-amber-500/[0.06] backdrop-blur-xl',
    text: 'text-amber-400',
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-500',
    border: 'border-amber-500/20',
    strongBorder: 'border-amber-400/45',
    glow: 'shadow-amber-500/20',
    icon: 'text-amber-400',
    gradientButton: 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400',
    activeMenu: 'bg-gradient-to-l from-amber-500/95 to-orange-500/85 text-white border border-amber-300/25 shadow-lg shadow-amber-500/20',
    selectRing: 'focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-400/10',
    cssVars: {
      '--theme-accent': '#f59e0b',
      '--theme-accent-soft': 'rgba(245,158,11,.15)',
      '--theme-card': 'rgba(245,158,11,.06)',
      '--theme-border': 'rgba(245,158,11,.24)',
    } as CSSProperties,
  },
  midnight_navy: {
    name: 'سمة ليل اراك',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_36%),linear-gradient(135deg,#061021_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-blue-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-blue-500/[0.06] backdrop-blur-xl',
    text: 'text-blue-400',
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-500',
    border: 'border-blue-500/20',
    strongBorder: 'border-blue-400/45',
    glow: 'shadow-blue-500/20',
    icon: 'text-blue-400',
    gradientButton: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400',
    activeMenu: 'bg-gradient-to-l from-blue-500/95 to-cyan-500/85 text-white border border-blue-300/25 shadow-lg shadow-blue-500/20',
    selectRing: 'focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-400/10',
    cssVars: {
      '--theme-accent': '#3b82f6',
      '--theme-accent-soft': 'rgba(59,130,246,.15)',
      '--theme-card': 'rgba(59,130,246,.06)',
      '--theme-border': 'rgba(59,130,246,.24)',
    } as CSSProperties,
  },
  spring: {
    name: 'سمة ربيع أراك',
    mainBg: 'bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(101,163,13,0.10),transparent_36%),linear-gradient(135deg,#101a05_0%,#090a12_48%,#050608_100%)]',
    sidebarBg: 'bg-lime-950/10 backdrop-blur-2xl',
    headerBg: 'bg-black/25 backdrop-blur-2xl',
    panelBg: 'bg-white/[0.045] backdrop-blur-xl',
    softPanelBg: 'bg-lime-500/[0.06] backdrop-blur-xl',
    text: 'text-lime-400',
    bg: 'bg-lime-600',
    bgHover: 'hover:bg-lime-500',
    border: 'border-lime-500/20',
    strongBorder: 'border-lime-400/45',
    glow: 'shadow-lime-500/20',
    icon: 'text-lime-400',
    gradientButton: 'bg-gradient-to-r from-lime-600 to-green-500 hover:from-lime-500 hover:to-green-400',
    activeMenu: 'bg-gradient-to-l from-lime-500/95 to-green-500/85 text-slate-950 border border-lime-200/25 shadow-lg shadow-lime-500/20',
    selectRing: 'focus-within:border-lime-400/50 focus-within:ring-2 focus-within:ring-lime-400/10',
    cssVars: {
      '--theme-accent': '#84cc16',
      '--theme-accent-soft': 'rgba(132,204,22,.15)',
      '--theme-card': 'rgba(132,204,22,.06)',
      '--theme-border': 'rgba(132,204,22,.24)',
    } as CSSProperties,
  },
};

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
import DashboardView from './components/DashboardView';
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
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [time, setTime] = useState('');
  const currentTheme = themeTokens[theme];

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowCommandBar(true);
      }
      if (event.key === 'Escape') {
        setShowCommandBar(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executiveSummary = {
    decisions: 4,
    delayedProjects: projects.filter(p => p.status === 'معلق' || p.progress < 45).length || 1,
    meetings: meetings.filter(m => m.status === 'مجدول').length || 2,
    financialRisks: 1,
    delegatedTasks: tasks.filter(t => t.status !== 'مكتمل').length || 7,
  };

  const executiveTimeline = [
    { time: '08:12', title: 'اعتماد تقرير الأداء المالي والتشغيلي', type: 'تم الاعتماد', icon: CheckCircle2 },
    { time: '09:15', title: 'تكليف نائب التنمية بمتابعة المشاريع المتأخرة', type: 'تفويض', icon: ArrowUpRight },
    { time: '10:40', title: 'تنبيه مخاطرة على بند المصروف الفعلي المعتمد', type: 'تنبيه', icon: AlertTriangle },
    { time: '11:20', title: 'الوكيل التنفيذي لخص محضر اجتماع السكرتارية', type: 'ذكاء تنفيذي', icon: Bot },
  ];

  const commandActions = [
    { label: 'افتح مركز القيادة', description: 'الانتقال إلى الصفحة التنفيذية الأولى', target: 'dashboard', icon: Command },
    { label: 'اعرض التقارير والتحليلات', description: 'الموازنات والإنفاق ومؤشرات الأداء', target: 'reports', icon: BarChart3 },
    { label: 'أنشئ تكليفاً جديداً', description: 'فتح صفحة التكاليف والمهام النشطة', target: 'tasks', icon: CheckSquare },
    { label: 'اعرض المشاريع المتأخرة', description: 'متابعة القطاعات والمشاريع الحرجة', target: 'projects', icon: Building2 },
    { label: 'افتح مركز القرارات', description: 'القرارات والتوجيهات التنفيذية', target: 'messages', icon: MessageSquare },
    { label: 'راجع اجتماعات اليوم', description: 'التقويم والاجتماعات الحية', target: 'calendar', icon: Calendar },
    { label: 'اسأل المستشار الذكي', description: 'تحليل، توصية، ومساندة قرار', target: 'ai-advisor', icon: Brain },
  ];

  const filteredCommandActions = commandActions.filter(action =>
    `${action.label} ${action.description}`.toLowerCase().includes(commandQuery.trim().toLowerCase())
  );

  const runCommand = (target: string) => {
    setActiveView(target);
    setShowCommandBar(false);
    setCommandQuery('');
  };

  const getThemeTextClass = () => currentTheme.text;
  const getThemeBgClass = () => currentTheme.bg;
  const getThemeBorderClass = () => currentTheme.border;
  const getThemeGradientButtonClass = () => currentTheme.gradientButton;
  const getThemePanelClass = () => `${currentTheme.panelBg} border border-white/10 ${currentTheme.border}`;

  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Sidebar Menu Items grouped and filtered dynamically
  const rawMenuGroups = [
    {
      title: 'اتخاذ القرارات والذكاء الاصطناعي',
      items: [
        { id: 'dashboard', name: 'مركز القيادة التنفيذي', icon: Layers },
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
        { id: 'documents', name: 'مركز الوثائق وقاعدة البيانات', icon: FileText },
        // Only visible to Admin or CEO (when admin mode is active)
        ...(currentUser?.role === 'admin' || (currentUser?.role === 'ceo' && ceoAdminMode) ? [
          { id: 'users', name: 'إدارة المستخدمين والصلاحيات', icon: Settings }
        ] : [])
      ]
    },
    {
      title: 'القطاعات الخارجية وسلاسل الإمداد',
      items: [
        { id: 'egypt', name: 'فرع اراك التنمية مصر', icon: Globe },
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
      ? ['dashboard', 'reports', 'ai-advisor', 'voice-assistant', 'projects', 'tasks', 'secretariat', 'messages', 'calendar', 'meetings', 'meeting-requests', 'governance', 'legal', 'documents', 'egypt', 'logistic', 'users']
      : currentUser.allowedViews;
      
    if (!allAllowedViewIds.includes(activeView)) {
      if (allAllowedViewIds.length > 0) {
        setActiveView(allAllowedViewIds[0]);
      }
    }
  }, [currentUser, activeView, ceoAdminMode]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView projects={projects} tasks={tasks} theme={theme} onNavigate={setActiveView} />;
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
      default: return <DashboardView projects={projects} tasks={tasks} theme={theme} onNavigate={setActiveView} />;
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
    <div
      dir="rtl"
      style={currentTheme.cssVars}
      data-theme={theme}
      className={`min-h-screen ${currentTheme.mainBg} text-slate-100 flex flex-row-reverse font-sans overflow-x-hidden antialiased selection:bg-[var(--theme-accent-soft)]`}
    >
      
      {/* Sidebar on the Right (Arabic layout standard) */}
      <aside className={`w-80 ${currentTheme.sidebarBg} border-l border-white/10 ${currentTheme.border} flex flex-col justify-between flex-shrink-0 z-30 h-screen sticky top-0 shadow-2xl shadow-black/30`}>
        <div className="flex flex-col h-full overflow-y-auto pr-2">
          
          {/* Araak Group official logo */}
          <div className={`p-5 border-b border-white/10 ${currentTheme.border} flex flex-col items-center gap-3`}>
            <img
              src="/araak-main-logo.png"
              alt="Araak Group"
              className="w-full max-w-[230px] h-auto object-contain drop-shadow-[0_0_18px_rgba(132,204,22,0.16)]"
            />
            <div className="text-center">
              <h1 className="text-sm font-black text-white tracking-tight">CEO DIGITAL OFFICE</h1>
              <span className={`text-[10px] font-bold block ${getThemeTextClass()}`}>مكتب الرئيس التنفيذي</span>
            </div>
          </div>
 
          {/* Quick Active CEO Status Tracker */}
          <div className={`m-4 p-4 rounded-xl ${getThemePanelClass()} flex justify-between items-center text-right shadow-lg shadow-black/15`}>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500">التوقيت المحلي للمكتب</span>
              <span className={`text-xs font-mono font-bold ${currentTheme.text}`}>{time || '12:00:00'}</span>
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
                            ? `${currentTheme.activeMenu} font-black` 
                            : 'text-slate-400 hover:text-slate-100 hover:bg-white/10 hover:backdrop-blur-xl'
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
        <div className={`p-4 border-t border-white/10 ${currentTheme.headerBg}`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <button 
              onClick={() => {
                setCurrentUser(null);
                setCeoAdminMode(false);
                setActiveView('dashboard');
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
        <header className={`h-16 ${currentTheme.headerBg} border-b border-white/10 ${currentTheme.border} px-8 flex items-center justify-between sticky top-0 z-20 shadow-lg shadow-black/20`}>
          
          {/* Right Header: Fast Search and System indicators */}
          <div className="flex items-center gap-4">
            
            {/* Global Command Bar Trigger */}
            <button
              onClick={() => setShowCommandBar(true)}
              className={`${currentTheme.panelBg} border border-white/10 ${currentTheme.border} rounded-xl px-3 py-1.5 min-w-[260px] flex items-center justify-between gap-3 text-xs text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all`}
              title="Ctrl + K"
            >
              <span className="flex items-center gap-2"><Search className="w-3.5 h-3.5" /> ماذا تريد أن تنجز؟</span>
              <span className="font-sans text-[10px] border border-white/10 rounded-md px-1.5 py-0.5 text-slate-500">Ctrl K</span>
            </button>

            {/* Quick Vision Switcher */}
            <div className={`flex items-center gap-1.5 ${currentTheme.panelBg} border border-white/10 ${currentTheme.border} ${currentTheme.selectRing} rounded-xl px-3 py-1.5 transition-all`}>
              <Sparkles className={`w-3.5 h-3.5 ${currentTheme.icon} animate-pulse`} />
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
                    ? `${currentTheme.softPanelBg} ${currentTheme.text} ${currentTheme.strongBorder} shadow ${currentTheme.glow}` 
                    : `${currentTheme.panelBg} text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10`
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${ceoAdminMode ? `${currentTheme.bg} animate-pulse` : 'bg-slate-500'}`}></span>
                <span>{ceoAdminMode ? 'تفعيل دور الآدمن: نشط' : 'تفعيل دور الآدمن'}</span>
              </button>
            )}
 
            {/* Quick help button */}
            <button 
              onClick={() => alert('نظام المساعد التنفيذي متصل بقاعدة البيانات وعقود وميزانيات المجموعة لرصد الأداء واتخاذ القرار.')}
              className="p-2 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer"
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
                className="p-2 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 block animate-pulse"></span>
                )}
              </button>
 
              {showNotificationDropdown && (
                <div className={`absolute left-0 mt-3 w-80 ${currentTheme.panelBg} border border-white/10 ${currentTheme.border} rounded-2xl shadow-2xl shadow-black/40 z-40 overflow-hidden text-right`}>
                  <div className={`p-4 border-b border-white/10 flex justify-between items-center ${currentTheme.softPanelBg}`}>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                      className={`text-[10px] ${currentTheme.text} font-bold hover:underline`}
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
                        className={`p-4 hover:bg-white/10 cursor-pointer transition-colors ${!n.read ? currentTheme.softPanelBg : ''}`}
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
                className="flex items-center gap-2.5 p-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
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
                <div className={`absolute left-0 mt-3 w-56 ${currentTheme.panelBg} border border-white/10 ${currentTheme.border} rounded-xl shadow-2xl shadow-black/40 z-40 overflow-hidden text-right`}>
                  <div className={`p-4 border-b border-white/10 ${currentTheme.softPanelBg}`}>
                    <span className="text-xs font-bold text-slate-300 block">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans">{currentUser.title}</span>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => alert(`رتبة حسابك: ${currentUser.title} ومسجل بنجاح.`)}
                      className="w-full text-right hover:bg-white/10 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      إعدادات الحساب والأمان
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentUser(null);
                        setCeoAdminMode(false);
                        setActiveView('dashboard');
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
 
        {/* Executive morning brief shown after login */}
        {activeView === 'dashboard' && (
          <section className="px-8 pt-8 max-w-[1700px] mx-auto w-full">
            <div className={`relative overflow-hidden rounded-3xl ${currentTheme.panelBg} border border-white/10 ${currentTheme.border} p-6 shadow-2xl shadow-black/25`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)] pointer-events-none" />
              <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                <div className="xl:col-span-7 space-y-5">
                  <div>
                    <span className={`text-xs font-black ${currentTheme.text}`}>Executive Mission Control</span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mt-2">صباح الخير {currentUser.name}</h2>
                    <p className="text-slate-400 text-sm mt-2">اليوم لديك موجز تنفيذي سريع قبل الدخول في التفاصيل.</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      ['قرارات تنتظر الاعتماد', executiveSummary.decisions, 'messages'],
                      ['مشروع متأخر يحتاج تدخل', executiveSummary.delayedProjects, 'projects'],
                      ['اجتماعات قادمة', executiveSummary.meetings, 'calendar'],
                      ['مخاطرة مالية', executiveSummary.financialRisks, 'reports'],
                      ['تكليفات مفتوحة', executiveSummary.delegatedTasks, 'tasks'],
                    ].map(([label, value, target]) => (
                      <button key={String(label)} onClick={() => setActiveView(String(target))} className="rounded-2xl bg-black/25 border border-white/10 p-4 text-right hover:bg-white/10 transition-all">
                        <span className="block text-2xl font-black text-white font-sans">{String(value)}</span>
                        <span className="block text-[11px] text-slate-400 mt-1 leading-relaxed">{String(label)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="xl:col-span-5 rounded-2xl bg-black/25 border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black ${currentTheme.text}`}>التايم لاين التنفيذي</span>
                    <Clock3 className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-3">
                    {executiveTimeline.map((item, idx) => {
                      const TimelineIcon = item.icon;
                      return (
                        <div key={idx} className="flex items-start gap-3 text-right">
                          <span className="font-sans text-[11px] text-slate-500 mt-1">{item.time}</span>
                          <div className={`w-8 h-8 rounded-xl ${currentTheme.softPanelBg} border border-white/10 flex items-center justify-center flex-shrink-0`}>
                            <TimelineIcon className={`w-4 h-4 ${currentTheme.text}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-100">{item.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.type}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* View content container */}
        <div className={`${activeView === 'dashboard' ? 'p-8 pt-6' : 'p-8'} flex-1 max-w-[1700px] mx-auto w-full`}>
          {renderActiveView()}
        </div>

        {showCommandBar && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-28 px-4" onClick={() => setShowCommandBar(false)}>
            <div className={`w-full max-w-2xl ${currentTheme.panelBg} border border-white/10 ${currentTheme.border} rounded-3xl shadow-2xl shadow-black/50 overflow-hidden`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <Command className={`w-5 h-5 ${currentTheme.text}`} />
                <input
                  autoFocus
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="اكتب أمراً... افتح المشاريع، لخص التقارير، أنشئ تكليفاً"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 text-right"
                />
                <span className="text-[10px] text-slate-500 border border-white/10 rounded-lg px-2 py-1">ESC</span>
              </div>
              <div className="p-3 max-h-[420px] overflow-y-auto">
                {(filteredCommandActions.length ? filteredCommandActions : commandActions).map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => runCommand(action.target)}
                      className="w-full flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all text-right group"
                    >
                      <Zap className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
                      <div className="flex-1">
                        <p className="text-sm font-black text-white">{action.label}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{action.description}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-2xl ${currentTheme.softPanelBg} border border-white/10 flex items-center justify-center`}>
                        <ActionIcon className={`w-4 h-4 ${currentTheme.text}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
 
      </main>
 
    </div>
  );
}
