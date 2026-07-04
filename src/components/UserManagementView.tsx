import React, { useState } from 'react';
import { 
  Shield, 
  UserPlus, 
  Unlock, 
  Lock, 
  Check, 
  X, 
  Trash2, 
  UserCheck, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Sparkles,
  Info,
  Settings
} from 'lucide-react';
import { AppUser, PlatformTheme } from '../types';

interface UserManagementViewProps {
  users: AppUser[];
  onUpdateUser: (updatedUser: AppUser) => void;
  onAddUser: (newUser: AppUser) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: AppUser | null;
  theme: PlatformTheme;
  ceoAdminMode: boolean;
}

export default function UserManagementView({ 
  users, 
  onUpdateUser, 
  onAddUser, 
  onDeleteUser, 
  currentUser,
  theme,
  ceoAdminMode
}: UserManagementViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'ceo' | 'vp' | 'head' | 'board_member'>('vp');
  const [newTitle, setNewTitle] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newAllowedViews, setNewAllowedViews] = useState<string[]>([
    'reports', 'projects', 'tasks', 'calendar', 'documents'
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForViews, setSelectedUserForViews] = useState<string | null>(null);

  // Available Views list with their Arabic names and groups
  const allAvailableViews = [
    { id: 'reports', name: 'التقارير والتحليلات الجغرافية', group: 'الذكاء والتحليل' },
    { id: 'ai-advisor', name: 'المستشار الاستراتيجي الذكي', group: 'الذكاء والتحليل' },
    { id: 'voice-assistant', name: 'الوكيل الصوتي التنفيذي', group: 'الذكاء والتحليل' },
    { id: 'projects', name: 'المشاريع والقطاعات التنموية', group: 'الإدارة التنفيذية' },
    { id: 'tasks', name: 'التكليفات والمهام النشطة', group: 'الإدارة التنفيذية' },
    { id: 'secretariat', name: 'السكرتارية والاتصالات والمذكرات', group: 'الإدارة التنفيذية' },
    { id: 'messages', name: 'القرارات والتوجيهات التنفيذية', group: 'الإدارة التنفيذية' },
    { id: 'calendar', name: 'التقويم واللقاءات السنوية', group: 'اللقاءات والمحاضر' },
    { id: 'meetings', name: 'اجتماعات حية وفيديو كونفرنس', group: 'اللقاءات والمحاضر' },
    { id: 'meeting-requests', name: 'طلبات اللقاء والزيارات الخارجية', group: 'اللقاءات والمحاضر' },
    { id: 'governance', name: 'الرقابة والتفتيش والامتثال', group: 'الرقابة والالتزامات' },
    { id: 'legal', name: 'الشؤون القانونية والمحاضر الموثقة', group: 'الرقابة والالتزامات' },
    { id: 'documents', name: 'مركز الوثائق وقاعدة المعرفة', group: 'الرقابة والالتزامات' },
    { id: 'egypt', name: 'فرع أراك التنمية بجمهورية مصر', group: 'القطاعات الخارجية' },
    { id: 'logistic', name: 'أراك لوجستيك للشحن والموانئ', group: 'القطاعات الخارجية' },
  ];

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

  const getThemeBorderClass = () => {
    switch (theme) {
      case 'vision_2030': return 'border-emerald-500/30';
      case 'golden_luxury': return 'border-amber-500/30';
      case 'midnight_navy': return 'border-blue-500/30';
      case 'spring': return 'border-lime-500/30';
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newTitle) {
      alert('يرجى تعبئة كافة الحقول المطلوبة.');
      return;
    }

    const newUser: AppUser = {
      id: 'u_' + Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
      title: newTitle,
      avatar: newName.trim().charAt(0),
      status: 'نشط',
      allowedViews: newAllowedViews,
      color: ['bg-emerald-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500'][Math.floor(Math.random() * 5)],
      password: newPassword || '123456'
    };

    onAddUser(newUser);
    setNewName('');
    setNewEmail('');
    setNewTitle('');
    setNewRole('vp');
    setNewPassword('123456');
    setNewAllowedViews(['reports', 'projects', 'tasks', 'calendar', 'documents']);
    setShowAddForm(false);
  };

  const toggleUserStatus = (user: AppUser) => {
    if (user.id === currentUser?.id) {
      alert('لا يمكنك حجب حسابك النشط الذي تستخدمه حالياً.');
      return;
    }
    const updatedStatus = user.status === 'نشط' ? 'محجوب' : 'نشط';
    onUpdateUser({
      ...user,
      status: updatedStatus
    });
  };

  const toggleViewPermission = (user: AppUser, viewId: string) => {
    // Admin and CEO cannot be restricted easily to prevent lockout
    if (user.role === 'ceo' || user.role === 'admin') {
      alert('الرئيس التنفيذي ومدير النظام يمتلكان صلاحيات مطلقة ومثبتة تلقائياً للوصول إلى كافة الأقسام.');
      return;
    }

    let updatedViews = [...user.allowedViews];
    if (updatedViews.includes(viewId)) {
      updatedViews = updatedViews.filter(v => v !== viewId);
    } else {
      updatedViews.push(viewId);
    }

    onUpdateUser({
      ...user,
      allowedViews: updatedViews
    });
  };

  const grantAllViews = (user: AppUser) => {
    const allIds = allAvailableViews.map(v => v.id);
    onUpdateUser({
      ...user,
      allowedViews: allIds
    });
  };

  const revokeAllViews = (user: AppUser) => {
    onUpdateUser({
      ...user,
      allowedViews: []
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.includes(searchQuery) || 
    u.title.includes(searchQuery) || 
    u.email.includes(searchQuery)
  );

  const canManage = currentUser?.role === 'admin' || (currentUser?.role === 'ceo' && ceoAdminMode);

  return (
    <div className="space-y-8 animate-fade-in" id="user-management-view">
      
      {/* Upper Status Banner */}
      <div className="bg-[#0e101f] border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> طبقة حماية سيادية
              </span>
              <h2 className="text-2xl font-black text-white">إدارة حسابات الدخول وصلاحيات المنصة</h2>
            </div>
            <p className="text-sm text-slate-400">
              بصفتك مخولاً سيادياً، يمكنك إضافة نواب الرئيس التنفيذي، مدراء القطاعات، ورؤساء المكاتب الخارجية وتعيين النطاقات الوظيفية المخصصة لكل مستخدم بدقة متناهية.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#14172c] border border-slate-800 p-4 rounded-2xl w-full md:w-auto">
            <div className="text-right">
              <p className="text-[10px] text-slate-500">حسابك الحالي</p>
              <p className="text-sm font-bold text-white">{currentUser?.name}</p>
              <p className="text-xs text-amber-500 font-mono font-bold mt-1">
                {currentUser?.role === 'ceo' ? 'الرئيس التنفيذي (صلاحيات كاملة)' : 'الآدمن العام'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-950 font-black text-lg ${currentUser?.color || 'bg-amber-500'}`}>
              {currentUser?.avatar || 'ع'}
            </div>
          </div>
        </div>

        {!canManage && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-right flex-row-reverse">
            <div className="flex items-center gap-3 flex-row-reverse">
              <AlertTriangle className="text-rose-400 w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-300">نظام المراقبة مقيد حالياً</p>
                <p className="text-xs text-slate-400 mt-1">
                  أنت مسجل حالياً بحساب الرئيس التنفيذي ولكن لم تقم بتفعيل "التحول لصلاحيات الآدمن". يرجى الضغط على زر التبديل في الأعلى لمنح نفسك صلاحيات الإدارة الكاملة.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Right side: Users list and search */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0e101f] border border-slate-800 rounded-3xl p-6">
            
            <div className="flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md w-full">
                <input 
                  type="text"
                  placeholder="البحث عن مستخدم أو منصب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-right bg-[#14172c] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700 font-sans"
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                {canManage && (
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black text-slate-950 transition-all cursor-pointer ${getThemeBgClass()}`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إضافة مستخدم جديد</span>
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir="rtl">
                <thead>
                  <tr className="border-b border-slate-800/80 text-xs text-slate-500 font-bold">
                    <th className="pb-3 pr-4">المستخدم</th>
                    <th className="pb-3">الدور الاستراتيجي</th>
                    <th className="pb-3 text-center">أقسام مسموحة</th>
                    <th className="pb-3 text-center">الحالة الإدارية</th>
                    <th className="pb-3 pl-4 text-left">أدوات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUserForViews === user.id;
                    const isSelf = user.id === currentUser?.id;
                    return (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-slate-800/20 transition-all ${isSelected ? 'bg-amber-500/5' : ''}`}
                      >
                        {/* User Profile */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-black ${user.color || 'bg-amber-500'}`}>
                              {user.avatar}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white flex items-center gap-1.5">
                                {user.name} 
                                {isSelf && (
                                  <span className="text-[9px] bg-[#14172c] text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">أنت</span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-500 font-sans mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Organizational Role & Title */}
                        <td className="py-4">
                          <div className="text-right">
                            <p className="font-bold text-slate-200">{user.title}</p>
                            <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                              user.role === 'ceo' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              user.role === 'vp' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              user.role === 'board_member' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {user.role === 'ceo' ? 'رئيس تنفيذي' :
                               user.role === 'admin' ? 'مشرف عام' :
                               user.role === 'vp' ? 'نائب رئيس' : 
                               user.role === 'board_member' ? 'عضو مجلس إدارة' : 'مدير قطاع'}
                            </span>
                          </div>
                        </td>

                        {/* Allowed Views Count */}
                        <td className="py-4 text-center">
                          {user.role === 'ceo' || user.role === 'admin' ? (
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">شاملة ومطلقة</span>
                          ) : (
                            <button
                              onClick={() => setSelectedUserForViews(isSelected ? null : user.id)}
                              className="text-amber-400 hover:text-amber-300 font-bold underline bg-[#14172c] px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
                            >
                              {user.allowedViews.length} أقسام مصرحة
                            </button>
                          )}
                        </td>

                        {/* Status badge */}
                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            user.status === 'نشط' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'نشط' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                            {user.status === 'نشط' ? 'مفعل ومصرح' : 'محجوب / معلق'}
                          </span>
                        </td>

                        {/* Quick Controls */}
                        <td className="py-4 pl-4 text-left">
                          <div className="flex items-center gap-2 justify-start">
                            <button
                              onClick={() => setSelectedUserForViews(isSelected ? null : user.id)}
                              className="p-1.5 bg-[#14172c] hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg border border-slate-800 transition-all cursor-pointer"
                              title="تعديل الصلاحيات الفردية"
                            >
                              <Settings className="w-4 h-4" />
                            </button>

                            {canManage && !isSelf && (
                              <>
                                <button
                                  onClick={() => toggleUserStatus(user)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    user.status === 'نشط' 
                                      ? 'bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border-rose-500/20' 
                                      : 'bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-400 border-emerald-500/20'
                                  }`}
                                  title={user.status === 'نشط' ? 'حجب هذا الحساب الفوري' : 'تنشيط وفك الحظر'}
                                >
                                  {user.status === 'نشط' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                </button>
                                
                                <button
                                  onClick={() => {
                                    if (confirm(`هل أنت متأكد من حذف الحساب الاستراتيجي للمستخدم: ${user.name}؟`)) {
                                      onDeleteUser(user.id);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-950/20 hover:bg-rose-900/50 text-rose-500 hover:text-rose-400 rounded-lg border border-rose-500/10 transition-all cursor-pointer"
                                  title="إزالة الحساب بالكامل"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Left side: Add User form or Edit Allowed Views */}
        <div className="space-y-6">
          
          {/* Active Edit Permissions View */}
          {selectedUserForViews && (
            (() => {
              const selectedUserObj = users.find(u => u.id === selectedUserForViews);
              if (!selectedUserObj) return null;
              
              const isCEOorAdmin = selectedUserObj.role === 'ceo' || selectedUserObj.role === 'admin';
              
              return (
                <div className="bg-[#0e101f] border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden animate-fade-in">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <button 
                      onClick={() => setSelectedUserForViews(null)}
                      className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                    <div className="text-right">
                      <h3 className="text-sm font-black text-white">تفويض وصلاحيات: {selectedUserObj.name}</h3>
                      <p className="text-[10px] text-amber-500 font-bold mt-1">{selectedUserObj.title}</p>
                    </div>
                  </div>

                  {canManage && (
                    <div className="mb-4 bg-[#14172c] p-3.5 rounded-2xl border border-slate-800 text-right space-y-2 text-xs">
                      <span className="text-[10px] font-black text-amber-500 block">تحديث الحساب الفعلي وكلمة المرور</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-500 block">الاسم</label>
                          <input 
                            type="text"
                            value={selectedUserObj.name}
                            onChange={(e) => onUpdateUser({ ...selectedUserObj, name: e.target.value, avatar: e.target.value.trim().charAt(0) })}
                            className="w-full text-right bg-[#0e101f] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block">المسمى الوظيفي</label>
                          <input 
                            type="text"
                            value={selectedUserObj.title}
                            onChange={(e) => onUpdateUser({ ...selectedUserObj, title: e.target.value })}
                            className="w-full text-right bg-[#0e101f] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-500 block">كلمة السر</label>
                          <input 
                            type="text"
                            value={selectedUserObj.password || ''}
                            placeholder="123456"
                            onChange={(e) => onUpdateUser({ ...selectedUserObj, password: e.target.value })}
                            className="w-full text-right bg-[#0e101f] border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block">الدور الأمني</label>
                          <select
                            value={selectedUserObj.role}
                            onChange={(e) => onUpdateUser({ ...selectedUserObj, role: e.target.value as any })}
                            className="w-full text-right bg-[#0e101f] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          >
                            <option value="admin">مشرف عام</option>
                            <option value="ceo">رئيس تنفيذي</option>
                            <option value="vp">نائب رئيس</option>
                            <option value="head">مدير قطاع</option>
                            <option value="board_member">عضو مجلس إدارة</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {isCEOorAdmin ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-right space-y-2">
                      <p className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> صلاحية سيادية مطلقة
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        بما أن هذا العضو يحمل رتبة (رئيس تنفيذي / مشرف عام)، فإن النظام يمنحه تلقائياً حق الوصول الكامل لجميع الأدوات والمشاريع والمحافظ بدون قيود.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-[#14172c] p-3 rounded-2xl border border-slate-800 text-xs">
                        <div className="flex gap-2">
                          <button
                            onClick={() => grantAllViews(selectedUserObj)}
                            disabled={!canManage}
                            className="text-[10px] font-bold text-emerald-400 hover:underline disabled:opacity-50"
                          >
                            تنشيط الكل
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => revokeAllViews(selectedUserObj)}
                            disabled={!canManage}
                            className="text-[10px] font-bold text-rose-400 hover:underline disabled:opacity-50"
                          >
                            حجب الكل
                          </button>
                        </div>
                        <span className="font-bold text-slate-400">التوجيه السريع</span>
                      </div>

                      {/* Grouped view list checkboxes */}
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                        {['الذكاء والتحليل', 'الإدارة التنفيذية', 'اللقاءات والمحاضر', 'الرقابة والالتزامات', 'القطاعات الخارجية'].map((group) => {
                          const groupViews = allAvailableViews.filter(v => v.group === group);
                          return (
                            <div key={group} className="space-y-2 text-right">
                              <span className="text-[10px] font-black text-slate-500">{group}</span>
                              <div className="space-y-1.5 bg-[#14172c] p-2.5 rounded-xl border border-slate-850">
                                {groupViews.map((view) => {
                                  const isAllowed = selectedUserObj.allowedViews.includes(view.id);
                                  return (
                                    <label 
                                      key={view.id}
                                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                                        isAllowed 
                                          ? 'bg-amber-500/5 text-amber-200 font-bold border border-amber-500/10' 
                                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                      }`}
                                    >
                                      <input 
                                        type="checkbox"
                                        checked={isAllowed}
                                        disabled={!canManage}
                                        onChange={() => toggleViewPermission(selectedUserObj, view.id)}
                                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                                      />
                                      <span>{view.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-[#131525] rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed text-right flex gap-2">
                        <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>عند حجب أو تفعيل أي قسم هنا، سيتم تجميد أو إظهار الخيار المقابل فوراً في القائمة الجانبية لهذا المستخدم بمجرد حفظ الإعدادات تلقائياً.</span>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()
          )}

          {/* Add User Form */}
          {showAddForm && canManage && (
            <div className="bg-[#0e101f] border border-slate-800 rounded-3xl p-6 animate-fade-in text-right">
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
                <h3 className="text-sm font-black text-white">إضافة حساب دخول سيادي جديد</h3>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">اسم المستخدم الرباعي</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: أ. عبدالمحسن بن ناصر"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-right bg-[#14172c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">البريد الإلكتروني الرسمي للمكتب</label>
                  <input 
                    type="email"
                    required
                    placeholder="مثال: nasser@arak.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full text-right bg-[#14172c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">المسمى التنفيذي الدقيق</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: نائب الرئيس للشؤون اللوجستية"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-right bg-[#14172c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">كلمة المرور الفعالة للحساب</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: 123456"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-right bg-[#14172c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">المستوى الأمني للولوج (الدور)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full text-right bg-[#14172c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="vp">المستوى الثالث: نائب الرئيس التنفيذي</option>
                    <option value="head">المستوى الثالث: مدير إقليمي / رئيس قطاع</option>
                    <option value="board_member">عضو مجلس إدارة (غير تنفيذي / رصد واطلاع)</option>
                    <option value="admin">المستوى الأول: آدمن فني للنظام</option>
                  </select>
                </div>

                <div className="p-3 bg-[#131525] rounded-xl border border-slate-800 text-[10px] text-slate-400 text-right leading-relaxed">
                  <p className="font-bold text-amber-500 mb-1">الربط والتقييد المباشر:</p>
                  عند اختيار (المستوى الثالث)، سيتم تقييد حساب المستخدم ليعرض له فقط الأدوار والقطاعات التي تحددها له من جدول الصلاحيات النشط.
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-xs font-black text-slate-950 text-center cursor-pointer transition-all ${getThemeBgClass()}`}
                >
                  حفظ وتفعيل الحساب فوراً
                </button>
              </form>
            </div>
          )}

          {/* Quick System Statistics Card */}
          <div className="bg-[#0e101f] border border-slate-800 rounded-3xl p-6 text-right space-y-4">
            <h4 className="text-xs font-black text-white">إحصائيات المفاتيح الأمنية</h4>
            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="bg-[#14172c] p-3 rounded-2xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block">إجمالي المستخدمين</span>
                <span className="text-lg font-mono font-bold text-white">{users.length}</span>
              </div>
              <div className="bg-[#14172c] p-3 rounded-2xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block">الحسابات النشطة</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {users.filter(u => u.status === 'نشط').length}
                </span>
              </div>
              <div className="bg-[#14172c] p-3 rounded-2xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block">الحسابات المعلقة</span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  {users.filter(u => u.status === 'محجوب').length}
                </span>
              </div>
              <div className="bg-[#14172c] p-3 rounded-2xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block">المستوى الثالث (المقيد)</span>
                <span className="text-lg font-mono font-bold text-blue-400">
                  {users.filter(u => u.role === 'vp' || u.role === 'head').length}
                </span>
              </div>
              <div className="bg-[#14172c] p-3 rounded-2xl border border-slate-850">
                <span className="text-[9px] text-slate-500 block">أعضاء مجلس الإدارة</span>
                <span className="text-lg font-mono font-bold text-teal-400">
                  {users.filter(u => u.role === 'board_member').length}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
