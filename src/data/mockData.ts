import { Project, Task, Meeting, MeetingRequest, TeamMember, DocumentItem, Commission, AlertNotification, AppUser } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'مجمع أراك التجاري - الإسكندرية',
    description: 'مشروع تطوير مجمع تجاري متكامل وصديق للبيئة بمحافظة الإسكندرية بمصر.',
    sector: 'أراك التنمية (مصر)',
    progress: 25,
    priority: 'حرج',
    status: 'نشط',
    budget: 120000000,
    manager: 'مدير أراك التنمية - مصر'
  },
  {
    id: 'p2',
    name: 'خط التنمية الإستراتيجية 2026-2030',
    description: 'وضع خارطة طريق التنمية والتحول الرقمي للسنوات الخمس القادمة.',
    sector: 'التنمية العامة',
    progress: 18,
    priority: 'حرج',
    status: 'نشط',
    budget: 45000000,
    manager: 'نائب الرئيس - التنمية'
  },
  {
    id: 'p3',
    name: 'صندوق الاستثمار في التقنية الناشئة',
    description: 'استثمار في الشركات التقنية الناشئة بمنطقة الخليج العربي وشمال أفريقيا.',
    sector: 'الاستثمار',
    progress: 42,
    priority: 'حرج',
    status: 'نشط',
    budget: 85000000,
    manager: 'نائب الرئيس - الاستثمار'
  },
  {
    id: 'p4',
    name: 'تطوير مصانع أراك للحديد والصلب',
    description: 'تحديث خطوط الإنتاج والتحول المؤتمت بالكامل لتقليل الانبعاثات الكربونية.',
    sector: 'الحديد والصناعة',
    progress: 65,
    priority: 'عالية',
    status: 'نشط',
    budget: 32000000,
    manager: 'المهندس أحمد صالح'
  },
  {
    id: 'p5',
    name: 'أكاديمية أراك الرقمية للتدريب',
    description: 'منصة تعليمية ذكية لتأهيل الكوادر وتنمية المهارات التقنية لشباب المجموعة.',
    sector: 'التطوير الأكاديمي',
    progress: 90,
    priority: 'متوسطة',
    status: 'نشط',
    budget: 6750006,
    manager: 'أ. جاسم الشمري'
  },
  {
    id: 'p6',
    name: 'تحديث البنية التحتية والشبكات لشركة لوجستيك',
    description: 'ربط الفروع اللوجستية وتتبع المركبات لحظياً باستخدام أجهزة الـ IoT.',
    sector: 'أراك لوجستيك',
    progress: 10,
    priority: 'عالية',
    status: 'قيد المراجعة',
    budget: 15000000,
    manager: 'مدير قطاع التقنية'
  },
  {
    id: 'p7',
    name: 'مشروع مجمع مدارس أراك الحديثة - الرياض',
    description: 'تأسيس صرح تعليمي حديث متكامل يدعم الابتكار والذكاء الاصطناعي.',
    sector: 'التنمية التعليمية',
    progress: 85,
    priority: 'عالية',
    status: 'مكتمل',
    budget: 45000000,
    manager: 'أ. فهد المدير'
  },
  {
    id: 'p8',
    name: 'توطين صناعة الأدوية الحيوية',
    description: 'شراكة إستراتيجية مع شركات ألمانية لإنتاج اللقاحات محلياً.',
    sector: 'الاستثمار الدوائي',
    progress: 5,
    priority: 'متوسطة',
    status: 'معلق',
    budget: 50000000,
    manager: 'نائب الرئيس - الاستثمار'
  },
  {
    id: 'p9',
    name: 'مستودعات أراك الذكية - جدة',
    description: 'إنشاء أكبر مستودع مبرد يعمل بالطاقة الشمسية بالكامل.',
    sector: 'أراك لوجستيك',
    progress: 33,
    priority: 'منخفضة',
    status: 'نشط',
    budget: 20000000,
    manager: 'أ. بندر الجوفي'
  }
];

export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Follow-up: مراجعة العقود التجارية المبرمة مع شركة الحديد والصلب وتدقيق الضمانات البنكية.',
    dueDate: '2026-06-25',
    sector: 'الحديد والصناعة',
    priority: 'حرج',
    status: 'قيد المتابعة',
    assignee: 'نائب الرئيس - الاستثمار'
  },
  {
    id: 't2',
    title: 'Follow-up: اعتماد ميزانية الربع الثالث لصندوق الاستثمار في التقنية الناشئة.',
    dueDate: '2026-06-28',
    sector: 'الاستثمار',
    priority: 'حرج',
    status: 'قيد المتابعة',
    assignee: 'د. علي العتيبي'
  },
  {
    id: 't3',
    title: 'مهمة #1 - مجمع أراك التجاري - الإسكندرية: تقديم المخططات الهندسية المحدثة للبلدية.',
    dueDate: '2026-06-20',
    sector: 'أراك التنمية',
    priority: 'هام',
    status: 'بانتظار الاعتماد',
    assignee: 'مدير أراك التنمية - مصر'
  },
  {
    id: 't4',
    title: 'مهمة #1 - التحول الرقمي للمجموعة: استكمال نقل الخوادم المحلية إلى السحابة الهجينة.',
    dueDate: '2026-06-20',
    sector: 'التحول الرقمي',
    priority: 'هام',
    status: 'بانتظار الاعتماد',
    assignee: 'مدير قطاع التقنية'
  },
  {
    id: 't5',
    title: 'مهمة #1 - تطوير أكاديمية أراك: اختبار منصة البث المباشر والامتحانات الذكية.',
    dueDate: '2026-06-20',
    sector: 'التطوير الأكاديمي',
    priority: 'عادي',
    status: 'بانتظار الاعتماد',
    assignee: 'أ. جاسم الشمري'
  },
  {
    id: 't6',
    title: 'مراجعة المذكرة القانونية المرفوعة بخصوص نزاع أرض مجمع الإسكندرية.',
    dueDate: '2026-07-01',
    sector: 'الشؤون القانونية',
    priority: 'حرج',
    status: 'قيد التنفيذ',
    assignee: 'المستشار القانوني'
  },
  {
    id: 't7',
    title: 'إعداد خطة تفتيش مفاجئة لمستودعات أراك لوجستيك في جدة والدمام.',
    dueDate: '2026-07-04',
    sector: 'الرقابة والتفتيش',
    priority: 'هام',
    status: 'قيد التنفيذ',
    assignee: 'رئيس لجنة الرقابة'
  },
  {
    id: 't8',
    title: 'مراجعة طلبات التوظيف القيادية لمكتب السكرتارية التنفيذية الجديد.',
    dueDate: '2026-07-05',
    sector: 'السكرتارية التنفيذية',
    priority: 'عادي',
    status: 'قيد التنفيذ',
    assignee: 'أ. فهد المدير'
  }
];

export const initialMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'اجتماع دوري شهر مايو',
    description: 'مناقشة تقرير الأداء المالي للمجموعة وطلب اعتماد ميزانية الطوارئ للمشروعات الحيوية بمصر وجدة.',
    date: '2026-06-16',
    time: '20:26',
    duration: 60,
    type: 'دوري',
    location: 'غرفة اجتماعات مجلس الإدارة الرئيسية',
    inviteesCount: 12,
    status: 'مجدول'
  },
  {
    id: 'm2',
    title: 'اجتماع مصنع الحديد والصلب',
    description: 'عرض دراسة جدوى تمويلية بشأن خطوط إنتاج دفيئة متطورة لتقليل الانبعاثات الحرارية.',
    date: '2026-06-16',
    time: '19:27',
    duration: 60,
    type: 'فردي',
    location: 'قاعة الاجتماعات الافتراضية 2',
    inviteesCount: 5,
    status: 'مجدول'
  },
  {
    id: 'm3',
    title: 'مراجعة مخاطر الاستثمار الدوائي',
    description: 'اجتماع طارئ لبحث تباطؤ الشراكة الألمانية والحلول البديلة للتوطين.',
    date: '2026-07-05',
    time: '10:00',
    duration: 90,
    type: 'طارئ',
    location: 'مكتب الرئيس التنفيذي',
    inviteesCount: 4,
    status: 'مجدول'
  }
];

export const initialMeetingRequests: MeetingRequest[] = [
  {
    id: 'mr1',
    title: 'دراسة إنشاء بنك أراك الدولي للتمويل والتنمية والاستثمار',
    proposer: 'نائب الرئيس - الاستثمار',
    sector: 'الاستثمار والتنمية',
    proposedDate: '2026-06-15',
    proposedTime: '13:07',
    duration: 36,
    description: 'عرض دراسة متكاملة ومؤشرات الجدوى الاقتصادية لتأسيس ذراع بنكي دولي يخدم توسعات مجموعة أراك للتنمية بمصر والخليج.',
    status: 'معتمد'
  },
  {
    id: 'mr2',
    title: 'مراجعة بروتوكول تتبع المركبات بالـ IoT لشركة لوجستيك',
    proposer: 'مدير قطاع التقنية',
    sector: 'أراك لوجستيك / التقنية',
    proposedDate: '2026-07-06',
    proposedTime: '11:00',
    duration: 45,
    description: 'مناقشة خطة تجريبية لنظام المتابعة الحية للشاحنات والاتصال مع Odoo و ERP المركزي.',
    status: 'بانتظار المراجعة'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'مدير النظام',
    role: 'مدير العمليات التقنية وبنية الأنظمة',
    sector: 'قطاع تقنية المعلومات',
    email: 'admin@arak.com',
    avatarChar: 'م',
    color: '#E11D48' // rose
  },
  {
    id: 'tm2',
    name: 'د. علي العتيبي',
    role: 'الرئيس التنفيذي - مجموعة أراك للتنمية',
    sector: 'الإدارة العليا ومكتب الـ CEO',
    email: 'ceo@arak.com',
    avatarChar: 'د',
    color: '#D97706' // amber
  },
  {
    id: 'tm3',
    name: 'نائب الرئيس - التنمية',
    role: 'المشرف على التنمية والتطوير الأكاديمي والصناعي',
    sector: 'قطاع التنمية',
    email: 'vp.dev@arak.com',
    avatarChar: 'ن',
    color: '#059669' // emerald
  },
  {
    id: 'tm4',
    name: 'نائب الرئيس - الاستثمار',
    role: 'المسؤول المالي والاستثمارات الإستراتيجية',
    sector: 'قطاع الاستثمار والمشروعات الدولية',
    email: 'vp.invest@arak.com',
    avatarChar: 'ن',
    color: '#2563EB' // blue
  },
  {
    id: 'tm5',
    name: 'مدير أراك التنمية - مصر',
    role: 'المدير الإقليمي ومطور المشروعات بمصر',
    sector: 'أراك التنمية (مصر)',
    email: 'egypt.mgr@arak.com',
    avatarChar: 'م',
    color: '#7C3AED' // violet
  },
  {
    id: 'tm6',
    name: 'المستشار القانوني العام',
    role: 'رئيس قطاع الشؤون القانونية والمطابقة',
    sector: 'القطاع القانوني والامتثال',
    email: 'legal.chief@arak.com',
    avatarChar: 'م',
    color: '#4B5563' // gray
  }
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc1',
    title: 'عقد تأسيس مجمع أراك التجاري بالإسكندرية ملحق ب',
    category: 'العقود والسياسات',
    date: '2026-06-24',
    size: '14.2 MB',
    author: 'المستشار القانوني العام',
    tags: ['مجمع الإسكندرية', 'عقد', 'تأسيس']
  },
  {
    id: 'doc2',
    title: 'دراسة جدوى تأسيس بنك أراك الدولي للاستثمار والتطوير',
    category: 'التقارير',
    date: '2026-06-14',
    size: '8.7 MB',
    author: 'نائب الرئيس - الاستثمار',
    tags: ['بنك أراك', 'دراسة جدوى', 'تمويل']
  },
  {
    id: 'doc3',
    title: 'محضر اجتماع لجنة التخطيط والموازنة الربع الثاني',
    category: 'محاضر الاجتماعات',
    date: '2026-05-18',
    size: '3.1 MB',
    author: 'مكتب السكرتارية التنفيذية',
    tags: ['محضر', 'لجنة الموازنة', 'الربع الثاني']
  },
  {
    id: 'doc4',
    title: 'دليل حوكمة الاستثمارات المباشرة ومكافحة غسل الأموال',
    category: 'العقود والسياسات',
    date: '2026-04-12',
    size: '1.8 MB',
    author: 'رئيس قطاع الامتثال',
    tags: ['سياسات', 'حوكمة', 'امتثال']
  }
];

export const initialCommissions: Commission[] = [
  {
    id: 'c1',
    title: 'عاجل: تقرير الأداء الإنشائي لمجمع الإسكندرية',
    sender: 'د. علي العتيبي',
    receiver: 'نائب الرئيس - التنمية',
    date: '2026-06-24',
    time: '22:31',
    priority: 'حرج',
    content: 'يرجى تزويدي بالتقرير الفني المحدث من الاستشاري الهندسي بخصوص تأخر صب الخرسانة للمرحلة الثانية في مجمع أراك التجاري بالإسكندرية.',
    status: 'صادر'
  },
  {
    id: 'c2',
    title: 'دراسة إنشاء بنك أراك الدولي',
    sender: 'نائب الرئيس - الاستثمار',
    receiver: 'د. علي العتيبي',
    date: '2026-06-24',
    time: '20:15',
    priority: 'مهم',
    content: 'المستشار المالي للمجموعة أعد التقرير الأولي لخطوات الترخيص. يرجى الاطلاع وتحديد موعد لمناقشته مع البنك المركزي.',
    status: 'وارد'
  },
  {
    id: 'c3',
    title: 'إنذار بوجود تسريب بيانات شبكة مستودعات لوجستيك',
    sender: 'رئيس قطاع الامتثال والتفتيش',
    receiver: 'مدير قطاع التقنية',
    date: '2026-06-24',
    time: '18:40',
    priority: 'حرج',
    content: 'تنبيه عاجل من مركز الرقابة والتفتيش بخصوص محاولات غير مصرح بها للاتصال بقاعدة بيانات المركبات المترابطة بالـ IoT في مستودعات جدة.',
    status: 'غير مقروء'
  }
];

export const initialNotifications: AlertNotification[] = [
  {
    id: 'n1',
    title: 'كشف محاولة ولوج شبكية مريبة بمستودعات جدة اللوجستية',
    time: 'منذ ١٠ دقائق',
    type: 'critical',
    read: false
  },
  {
    id: 'n2',
    title: 'تم اعتماد دراسة جدوى بنك أراك الدولي للتمويل والتنمية من الإدارة العليا',
    time: 'منذ ساعتين',
    type: 'success',
    read: false
  },
  {
    id: 'n3',
    title: 'طلب تفتيش جديد تم جدولته لمصانع الحديد والصلب بالجبيل',
    time: 'منذ ٤ ساعات',
    type: 'info',
    read: false
  },
  {
    id: 'n4',
    title: 'جلسة محاكمة قادمة للنزاع العقاري بمجمع الإسكندرية خلال ٤ أيام',
    time: 'منذ يوم واحد',
    type: 'warning',
    read: true
  }
];

export const initialAppUsers: AppUser[] = [
  {
    id: 'u1',
    name: 'المهندس فهد الحربي',
    email: 'admin@arak.com',
    role: 'admin',
    title: 'الآدمن العام للنظام الفني للمنصة',
    avatar: 'ف',
    status: 'نشط',
    allowedViews: ['reports', 'ai-advisor', 'voice-assistant', 'projects', 'tasks', 'secretariat', 'messages', 'calendar', 'meetings', 'meeting-requests', 'governance', 'legal', 'documents', 'egypt', 'logistic', 'users'],
    color: 'bg-purple-500',
    password: 'admin'
  },
  {
    id: 'u2',
    name: 'د. علي العتيبي',
    email: 'ceo@arak.com',
    role: 'ceo',
    title: 'الرئيس التنفيذي لمجموعة أراك للتنمية',
    avatar: 'ع',
    status: 'نشط',
    allowedViews: ['reports', 'ai-advisor', 'voice-assistant', 'projects', 'tasks', 'secretariat', 'messages', 'calendar', 'meetings', 'meeting-requests', 'governance', 'legal', 'documents', 'egypt', 'logistic', 'users'],
    color: 'bg-amber-500',
    password: 'ceo'
  },
  {
    id: 'u3',
    name: 'نائب الرئيس للاستثمار',
    email: 'investment@arak.com',
    role: 'vp',
    title: 'نائب الرئيس التنفيذي لقطاع الاستثمار والمحافظ',
    avatar: 'م',
    status: 'نشط',
    allowedViews: ['reports', 'ai-advisor', 'projects', 'tasks', 'calendar', 'meetings', 'documents'],
    color: 'bg-blue-500',
    password: 'invest'
  },
  {
    id: 'u4',
    name: 'نائب الرئيس للتنمية العامة',
    email: 'development@arak.com',
    role: 'vp',
    title: 'نائب الرئيس التنفيذي لقطاع التنمية العامة',
    avatar: 'ت',
    status: 'نشط',
    allowedViews: ['reports', 'projects', 'tasks', 'calendar', 'documents'],
    color: 'bg-emerald-500',
    password: 'dev'
  },
  {
    id: 'u5',
    name: 'أ. عبدالكريم معمار',
    email: 'vp.invest@arak.com',
    role: 'head',
    title: 'مدير فرع أراك للتنمية بجمهورية مصر العربية',
    avatar: 'ع',
    status: 'نشط',
    allowedViews: ['egypt', 'tasks', 'documents'],
    color: 'bg-rose-500',
    password: 'egypt'
  },
  {
    id: 'u6',
    name: 'مدير قطاع أراك لوجستيك',
    email: 'logistic@arak.com',
    role: 'head',
    title: 'مدير عام شركة أراك لوجستيك الملاحية - جدة',
    avatar: 'ل',
    status: 'نشط',
    allowedViews: ['logistic', 'tasks', 'documents'],
    color: 'bg-sky-500',
    password: 'logistic'
  },
  {
    id: 'u7',
    name: 'المهندس أحمد صالح',
    email: 'steel@arak.com',
    role: 'head',
    title: 'مدير عام قطاع الحديد والصلب والصناعات',
    avatar: 'أ',
    status: 'نشط',
    allowedViews: ['projects', 'tasks', 'documents'],
    color: 'bg-indigo-500',
    password: 'steel'
  },
  {
    id: 'u8',
    name: 'الشيخ خالد العبيكان',
    email: 'board@arak.com',
    role: 'board_member',
    title: 'عضو مجلس إدارة - الرصد الاستراتيجي',
    avatar: 'خ',
    status: 'نشط',
    allowedViews: ['reports', 'projects', 'calendar', 'documents'],
    color: 'bg-teal-500',
    password: 'board'
  }
];

