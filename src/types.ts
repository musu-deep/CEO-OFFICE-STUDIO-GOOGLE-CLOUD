export interface Project {
  id: string;
  name: string;
  description: string;
  sector: string;
  progress: number;
  priority: 'عالية' | 'متوسطة' | 'منخفضة' | 'حرج';
  status: 'نشط' | 'قيد المراجعة' | 'معلق' | 'مكتمل';
  budget: number;
  manager: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  sector: string;
  priority: 'حرج' | 'هام' | 'عادي';
  status: 'قيد المتابعة' | 'بانتظار الاعتماد' | 'قيد التنفيذ' | 'مكتمل';
  assignee: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'دوري' | 'فردي' | 'طارئ';
  location: string;
  inviteesCount: number;
  status: 'مجدول' | 'منتهي' | 'ملغي';
}

export interface MeetingRequest {
  id: string;
  title: string;
  proposer: string;
  sector: string;
  proposedDate: string;
  proposedTime: string;
  duration: number;
  description: string;
  status: 'معتمد' | 'بانتظار المراجعة' | 'مرفوض';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  sector: string;
  email: string;
  avatarChar: string;
  color: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'العقود والسياسات' | 'التقارير' | 'محاضر الاجتماعات' | 'مستندات عامة';
  date: string;
  size: string;
  author: string;
  tags: string[];
}

export interface Commission {
  id: string;
  title: string;
  sender: string;
  receiver: string;
  date: string;
  time: string;
  priority: 'مهم' | 'حرج' | 'عادي';
  content: string;
  status: 'صادر' | 'وارد' | 'غير مقروء';
}

export interface AlertNotification {
  id: string;
  title: string;
  time: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
}

export type PlatformTheme = 'vision_2030' | 'golden_luxury' | 'midnight_navy' | 'spring';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'ceo' | 'vp' | 'head' | 'board_member';
  title: string;
  avatar: string;
  status: 'نشط' | 'محجوب';
  allowedViews: string[];
  color: string;
  password?: string;
}

