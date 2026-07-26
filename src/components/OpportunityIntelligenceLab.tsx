import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  Download,
  FileSearch,
  FileText,
  Filter,
  Gauge,
  Globe2,
  Landmark,
  Layers3,
  Lightbulb,
  MapPinned,
  Plus,
  Radar,
  RefreshCw,
  Save,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { PlatformTheme } from '../types';

type OpportunityStatus = 'مسودة' | 'قيد الدراسة' | 'بانتظار التحقق' | 'جاهز للقرار' | 'معتمد' | 'مستبعد';
type OpportunityStage = 'استقبال الفرصة' | 'جمع الأدلة' | 'تحليل السوق' | 'بناء السيناريوهات' | 'مراجعة القرار' | 'تحويل إلى مشروع';
type OpportunityType =
  | 'مخطط سكني متعدد القطع'
  | 'قطعة تطوير مفردة'
  | 'أرض خام'
  | 'مجمع سكني'
  | 'مشروع متعدد الاستخدامات'
  | 'فرصة صناعية'
  | 'فرصة تعليمية'
  | 'فرصة تقنية'
  | 'استحواذ أو شراكة';

type LabTab = 'cockpit' | 'intake' | 'evidence' | 'market' | 'scenarios' | 'stakeholders' | 'decision';

interface EvidenceItem {
  id: string;
  title: string;
  category: 'نظامي' | 'مكاني' | 'مالي' | 'سوقي' | 'فني' | 'تعاقدي';
  status: 'موثق' | 'قيد المراجعة' | 'مفقود';
  owner: string;
  updatedAt: string;
}

interface MarketComparable {
  id: string;
  area: string;
  product: string;
  size: string;
  price: string;
  source: string;
  confidence: 'مرتفعة' | 'متوسطة' | 'منخفضة';
  note: string;
}

interface Scenario {
  id: string;
  name: string;
  thesis: string;
  productMix: string;
  executionModel: string;
  capex: number;
  revenue: number;
  roi: number;
  durationMonths: number;
  absorptionMonths: number;
  risk: 'منخفض' | 'متوسط' | 'مرتفع';
  score: number;
}

interface Stakeholder {
  name: string;
  role: string;
  interest: string;
  influence: 'مرتفع' | 'متوسط' | 'منخفض';
  engagement: string;
}

interface RiskItem {
  id: string;
  title: string;
  category: string;
  likelihood: number;
  impact: number;
  mitigation: string;
  owner: string;
}

interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  sector: string;
  city: string;
  district: string;
  locationUrl: string;
  objective: string;
  owner: string;
  sponsor: string;
  status: OpportunityStatus;
  stage: OpportunityStage;
  createdAt: string;
  lastUpdated: string;
  landArea: number | null;
  parcelCount: number | null;
  referenceParcelArea: number | null;
  askingPrice: number | null;
  developmentModel: string;
  readiness: number;
  confidence: number;
  strategicFit: number;
  evidence: EvidenceItem[];
  marketComparables: MarketComparable[];
  scenarios: Scenario[];
  stakeholders: Stakeholder[];
  risks: RiskItem[];
  assumptions: string[];
  missingData: string[];
  decisionConditions: string[];
}

interface OpportunityIntelligenceLabProps {
  theme: PlatformTheme;
}

const STORAGE_KEY = 'araak_opportunity_intelligence_v1';

const initialOpportunity: Opportunity = {
  id: 'opp-madinah-ain-alkhaif',
  title: 'مخطط عين الخيف السكني – المدينة المنورة',
  type: 'مخطط سكني متعدد القطع',
  sector: 'التطوير العقاري',
  city: 'المدينة المنورة',
  district: 'عين الخيف / ميطان',
  locationUrl: 'https://maps.app.goo.gl/eB6jTsUKUtedu6wv9',
  objective: 'تحديد نموذج التطوير والمنتج السكني الأنسب لكل شريحة مستهدفة، وبناء قرار مرحلي للتطوير أو الشراكة أو التخارج.',
  owner: 'فريق التطوير والاستثمار',
  sponsor: 'مكتب الرئيس التنفيذي',
  status: 'قيد الدراسة',
  stage: 'جمع الأدلة',
  createdAt: '2026-07-26',
  lastUpdated: '2026-07-26',
  landArea: null,
  parcelCount: null,
  referenceParcelArea: 1050,
  askingPrice: null,
  developmentModel: 'لم يعتمد بعد – الدراسة على مستوى المخطط كاملاً، وليست عمارة مفردة.',
  readiness: 58,
  confidence: 54,
  strategicFit: 82,
  evidence: [
    { id: 'ev-1', title: 'رابط الموقع والإحداثيات', category: 'مكاني', status: 'موثق', owner: 'فريق التطوير', updatedAt: '26 يوليو 2026' },
    { id: 'ev-2', title: 'كروكي قطعة مرجعية داخل المخطط', category: 'فني', status: 'موثق', owner: 'الفريق الفني', updatedAt: '26 يوليو 2026' },
    { id: 'ev-3', title: 'المخطط العام وحدود جميع القطع', category: 'نظامي', status: 'مفقود', owner: 'المالك / المساح', updatedAt: 'بانتظار الاستلام' },
    { id: 'ev-4', title: 'سجل الصفقات والأسعار المقارنة', category: 'سوقي', status: 'قيد المراجعة', owner: 'محلل السوق', updatedAt: 'قيد التحديث' },
    { id: 'ev-5', title: 'اشتراطات الاستعمال والكثافة والخدمات', category: 'نظامي', status: 'قيد المراجعة', owner: 'الفريق النظامي', updatedAt: 'قيد التحقق' },
    { id: 'ev-6', title: 'سعر الأرض وشروط العرض', category: 'مالي', status: 'مفقود', owner: 'الاستثمار والمالية', updatedAt: 'غير متاح' },
  ],
  marketComparables: [
    {
      id: 'mc-1',
      area: 'عين الخيف',
      product: 'شقق تمليك عائلية',
      size: '125–165 م²',
      price: 'نطاق معلن يحتاج تحققاً من الصفقات',
      source: 'منصات العرض + مسح ميداني',
      confidence: 'متوسطة',
      note: 'قاعدة أولية لا يعتمد عليها وحدها قبل مطابقة الصفقات الفعلية ومستوى التشطيب.',
    },
    {
      id: 'mc-2',
      area: 'ميطان والمخططات القريبة',
      product: 'فلل ودوبلكسات',
      size: 'حسب مساحة القطعة',
      price: 'قيد بناء العينة',
      source: 'وسطاء محليون + إعلانات حديثة',
      confidence: 'منخفضة',
      note: 'يلزم فصل سعر الأرض عن تكلفة المبنى ثم اختبار السعر الإجمالي القابل للتمويل.',
    },
    {
      id: 'mc-3',
      area: 'المدينة المنورة – نطاق منافس',
      product: 'تاون هاوس / وحدات متلاصقة',
      size: 'منتج بديل للدراسة',
      price: 'غير محسوم',
      source: 'مشروعات منافسة ومقابلات العملاء',
      confidence: 'منخفضة',
      note: 'ينبغي اختبار قبول المنتج محلياً قبل إدخاله في المزيج النهائي للمخطط.',
    },
  ],
  scenarios: [
    {
      id: 'sc-1',
      name: 'المحافظ',
      thesis: 'تطوير البنية الأساسية وطرح القطع السكنية على مراحل مع احتفاظ محدود بقطع استراتيجية.',
      productMix: 'قطع فلل + خدمات أساسية + قطع مختارة للاحتفاظ',
      executionModel: 'تطوير مرحلي وبيع قطع',
      capex: 0,
      revenue: 0,
      roi: 0,
      durationMonths: 24,
      absorptionMonths: 30,
      risk: 'منخفض',
      score: 74,
    },
    {
      id: 'sc-2',
      name: 'المتوازن',
      thesis: 'مزيج بين بيع بعض القطع وتطوير منتجات سكنية نموذجية على القطع الأعلى قيمة لرفع الهامش.',
      productMix: 'فلل + تاون هاوس تجريبي + عمائر محدودة + خدمات حي',
      executionModel: 'تطوير ذاتي + شراكات تنفيذية',
      capex: 0,
      revenue: 0,
      roi: 0,
      durationMonths: 36,
      absorptionMonths: 36,
      risk: 'متوسط',
      score: 86,
    },
    {
      id: 'sc-3',
      name: 'تعظيم القيمة',
      thesis: 'تطوير المخطط كوجهة سكنية متكاملة بهوية موحدة، ومنتجات متعددة، ومراحل إطلاق مترابطة.',
      productMix: 'فلل متنوعة + تاون هاوس + عمائر مختارة + تجاري وخدمات ومرافق مجتمعية',
      executionModel: 'مطور رئيسي + تحالف تمويلي وتشغيلي',
      capex: 0,
      revenue: 0,
      roi: 0,
      durationMonths: 48,
      absorptionMonths: 54,
      risk: 'مرتفع',
      score: 79,
    },
  ],
  stakeholders: [
    { name: 'المالك', role: 'صاحب الأصل', interest: 'تعظيم قيمة الأرض وسرعة التسييل أو الشراكة', influence: 'مرتفع', engagement: 'اعتماد البيانات وحدود المخطط وشروط التصرف' },
    { name: 'الرئيس التنفيذي', role: 'راعي القرار', interest: 'ملاءمة الفرصة للاستراتيجية والعائد والمخاطر', influence: 'مرتفع', engagement: 'اعتماد الانتقال بين بوابات القرار' },
    { name: 'الاستثمار والمالية', role: 'فحص الجدوى والتمويل', interest: 'حماية رأس المال وضبط الافتراضات', influence: 'مرتفع', engagement: 'مراجعة السعر والتكلفة والتدفقات والحساسية' },
    { name: 'الفريق الفني', role: 'التخطيط والتصميم والبنية', interest: 'قابلية التنفيذ والاشتراطات والكفاءة', influence: 'متوسط', engagement: 'إعداد المخطط المفاهيمي والبدائل الفنية' },
    { name: 'الجهات التنظيمية والخدمية', role: 'اعتماد وتنظيم', interest: 'الالتزام بالاستعمالات والخدمات والسلامة', influence: 'مرتفع', engagement: 'تحقق مبكر من المتطلبات قبل تثبيت المزيج' },
    { name: 'المشتري والمستفيد', role: 'مصدر الطلب', interest: 'السعر، التمويل، الخصوصية، الجودة والخدمات', influence: 'متوسط', engagement: 'مقابلات واختبار مفهوم المنتج ونطاقات السعر' },
  ],
  risks: [
    { id: 'r-1', title: 'عدم اكتمال المخطط العام وحدود جميع القطع', category: 'بيانات / نظامي', likelihood: 4, impact: 5, mitigation: 'تعليق أي توصية كمية نهائية حتى استلام المخطط المعتمد والرفع المساحي.', owner: 'الفريق النظامي والفني' },
    { id: 'r-2', title: 'الخلط بين أسعار العرض وأسعار الصفقات الفعلية', category: 'سوقي', likelihood: 4, impact: 4, mitigation: 'بناء قاعدة مقارنات متعددة المصادر وترجيحها بدرجة الثقة وتاريخ الرصد.', owner: 'محلل السوق' },
    { id: 'r-3', title: 'رفع الكثافة أو تنويع المنتج قبل اختبار الطلب', category: 'تجاري', likelihood: 3, impact: 4, mitigation: 'اختبار المنتج والسعر على عينة عملاء ووسطاء وممولين قبل اعتماد المخطط النهائي.', owner: 'التطوير والتسويق' },
    { id: 'r-4', title: 'تضخم تكلفة البنية الأساسية والخدمات', category: 'مالي / تنفيذي', likelihood: 3, impact: 5, mitigation: 'تقديرات مستقلة، احتياطي مخاطر، وحزم تنفيذ مرحلية مرتبطة بالطلب.', owner: 'المالية وإدارة المشاريع' },
    { id: 'r-5', title: 'بطء الامتصاص وتعطل التدفقات النقدية', category: 'سوقي / تمويلي', likelihood: 3, impact: 5, mitigation: 'تجزئة الإطلاق، تنويع قنوات البيع، وربط بدء كل مرحلة بمؤشرات حجز واضحة.', owner: 'الاستثمار والمبيعات' },
  ],
  assumptions: [
    'المشروع مخطط سكني متعدد القطع، وليس قطعة واحدة لعمارة سكنية.',
    'الكروكي الحالي يمثل قطعة مرجعية داخل المخطط ولا يمثل كامل مساحة المشروع.',
    'أي أسعار حالية تعد مؤشرات أولية حتى التحقق من الصفقات الفعلية وتاريخ الرصد.',
    'اختيار المنتج النهائي مرتبط بتوزيع القطع، الاستعمالات، الطرق، الخدمات، والتكلفة الفعلية للبنية الأساسية.',
  ],
  missingData: [
    'المخطط العام المعتمد شاملاً أرقام ومساحات القطع والطرق والخدمات.',
    'المساحة الإجمالية الصافية والإجمالية للمخطط.',
    'عدد القطع وتصنيف كل قطعة واستعمالها.',
    'سعر العرض وشروط التملك أو الشراكة والدفعات.',
    'تكلفة البنية الأساسية والربط بالخدمات.',
    'بيانات صفقات فعلية حديثة ومقابلات طلب محلية.',
  ],
  decisionConditions: [
    'استلام المخطط العام والرفع المساحي والتحقق النظامي.',
    'اعتماد قاعدة سوقية موثقة تفرق بين العرض والصفقة.',
    'تسعير البنية الأساسية وتحديد احتياطي المخاطر.',
    'اختبار ثلاثة مزيجات منتجات على الشرائح المستهدفة.',
    'إعداد نموذج مالي مرحلي وتحديد حدود الاستثمار المقبولة.',
  ],
};

const emptyOpportunity = (): Opportunity => ({
  ...initialOpportunity,
  id: `opp-${Date.now()}`,
  title: 'فرصة جديدة',
  type: 'قطعة تطوير مفردة',
  sector: 'الاستثمار',
  city: '',
  district: '',
  locationUrl: '',
  objective: '',
  owner: 'فريق الاستثمار',
  sponsor: 'مكتب الرئيس التنفيذي',
  status: 'مسودة',
  stage: 'استقبال الفرصة',
  createdAt: new Date().toISOString().slice(0, 10),
  lastUpdated: new Date().toISOString().slice(0, 10),
  landArea: null,
  parcelCount: null,
  referenceParcelArea: null,
  askingPrice: null,
  developmentModel: 'قيد التصنيف',
  readiness: 15,
  confidence: 10,
  strategicFit: 50,
  evidence: [],
  marketComparables: [],
  scenarios: [],
  stakeholders: initialOpportunity.stakeholders.slice(0, 3),
  risks: [],
  assumptions: [],
  missingData: ['الموقع والحدود', 'المستندات النظامية', 'سعر العرض', 'تحليل السوق', 'النموذج المالي'],
  decisionConditions: [],
});

const tabs: { id: LabTab; label: string; icon: typeof Radar }[] = [
  { id: 'cockpit', label: 'غرفة القيادة', icon: Radar },
  { id: 'intake', label: 'استقبال وتصنيف', icon: ClipboardCheck },
  { id: 'evidence', label: 'الأدلة والموقع', icon: FileSearch },
  { id: 'market', label: 'السوق والمعرفة', icon: Database },
  { id: 'scenarios', label: 'السيناريوهات والجدوى', icon: Layers3 },
  { id: 'stakeholders', label: 'الأطراف والمخاطر', icon: Users },
  { id: 'decision', label: 'مذكرة القرار', icon: Scale },
];

const stageOrder: OpportunityStage[] = [
  'استقبال الفرصة',
  'جمع الأدلة',
  'تحليل السوق',
  'بناء السيناريوهات',
  'مراجعة القرار',
  'تحويل إلى مشروع',
];

export default function OpportunityIntelligenceLab({ theme }: OpportunityIntelligenceLabProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [initialOpportunity];
    } catch {
      return [initialOpportunity];
    }
  });
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id || initialOpportunity.id);
  const [activeTab, setActiveTab] = useState<LabTab>('cockpit');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<Opportunity>(() => emptyOpportunity());
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const current = opportunities.find(item => item.id === selectedId) || opportunities[0] || initialOpportunity;

  const themeClasses = useMemo(() => {
    switch (theme) {
      case 'golden_luxury':
        return { text: 'text-amber-400', bg: 'bg-amber-600 hover:bg-amber-500', soft: 'bg-amber-500/10 border-amber-500/20', ring: 'focus:border-amber-400/60' };
      case 'midnight_navy':
        return { text: 'text-blue-400', bg: 'bg-blue-600 hover:bg-blue-500', soft: 'bg-blue-500/10 border-blue-500/20', ring: 'focus:border-blue-400/60' };
      case 'spring':
        return { text: 'text-lime-400', bg: 'bg-lime-600 hover:bg-lime-500', soft: 'bg-lime-500/10 border-lime-500/20', ring: 'focus:border-lime-400/60' };
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-600 hover:bg-emerald-500', soft: 'bg-emerald-500/10 border-emerald-500/20', ring: 'focus:border-emerald-400/60' };
    }
  }, [theme]);

  const filteredOpportunities = opportunities.filter(item =>
    `${item.title} ${item.city} ${item.district} ${item.type}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const bestScenario = [...current.scenarios].sort((a, b) => b.score - a.score)[0];
  const verifiedEvidence = current.evidence.filter(item => item.status === 'موثق').length;
  const evidenceCompletion = current.evidence.length ? Math.round((verifiedEvidence / current.evidence.length) * 100) : 0;
  const highRisks = current.risks.filter(item => item.likelihood * item.impact >= 16).length;
  const stageIndex = stageOrder.indexOf(current.stage);

  const formatMoney = (value: number | null) => {
    if (!value) return 'قيد الإدخال';
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(value);
  };

  const updateCurrent = (patch: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(item => item.id === current.id ? { ...item, ...patch, lastUpdated: new Date().toISOString().slice(0, 10) } : item));
  };

  const updateScenario = (scenarioId: string, patch: Partial<Scenario>) => {
    updateCurrent({ scenarios: current.scenarios.map(item => item.id === scenarioId ? { ...item, ...patch } : item) });
  };

  const createOpportunity = () => {
    const normalized = { ...draft, title: draft.title.trim() || 'فرصة جديدة' };
    setOpportunities(prev => [normalized, ...prev]);
    setSelectedId(normalized.id);
    setShowCreate(false);
    setDraft(emptyOpportunity());
    setActiveTab('intake');
    setToast('تم إنشاء بطاقة الفرصة وإضافتها إلى الرادار التنفيذي');
  };

  const exportBrief = () => {
    const memo = {
      generatedAt: new Date().toISOString(),
      opportunity: current.title,
      classification: current.type,
      status: current.status,
      stage: current.stage,
      readiness: current.readiness,
      confidence: current.confidence,
      strategicFit: current.strategicFit,
      bestScenario: bestScenario || null,
      missingData: current.missingData,
      keyRisks: current.risks,
      decisionConditions: current.decisionConditions,
    };
    const blob = new Blob([JSON.stringify(memo, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `araak-opportunity-${current.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast('تم تصدير موجز الفرصة وبيانات القرار');
  };

  const approveOpportunity = () => {
    updateCurrent({ status: 'معتمد', stage: 'تحويل إلى مشروع', readiness: Math.max(current.readiness, 90) });
    setToast('تم اعتماد الفرصة وتحويلها إلى بوابة إنشاء مشروع تنفيذي');
  };

  const addEvidence = () => {
    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: 'مستند جديد – يحتاج تسمية ومراجعة',
      category: 'فني',
      status: 'قيد المراجعة',
      owner: 'فريق الدراسة',
      updatedAt: 'الآن',
    };
    updateCurrent({ evidence: [item, ...current.evidence] });
    setToast('تمت إضافة سجل مستند جديد إلى غرفة الأدلة');
  };

  const renderProgress = (value: number, colour = 'from-emerald-500 to-cyan-400') => (
    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
      <div className={`h-full bg-gradient-to-l ${colour} rounded-full transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );

  const statusBadge = (status: OpportunityStatus) => {
    const map: Record<OpportunityStatus, string> = {
      'مسودة': 'bg-slate-700/60 text-slate-300',
      'قيد الدراسة': 'bg-blue-500/15 text-blue-300 border-blue-500/25',
      'بانتظار التحقق': 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      'جاهز للقرار': 'bg-violet-500/15 text-violet-300 border-violet-500/25',
      'معتمد': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
      'مستبعد': 'bg-rose-500/15 text-rose-300 border-rose-500/25',
    };
    return map[status];
  };

  const renderCockpit = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'جاهزية القرار', value: `${current.readiness}%`, detail: 'اكتمال البيانات والبوابات', icon: Gauge, colour: 'text-emerald-400', progress: current.readiness },
          { label: 'الثقة في الأدلة', value: `${current.confidence}%`, detail: `${verifiedEvidence} من ${current.evidence.length} مستندات موثقة`, icon: ShieldAlert, colour: 'text-blue-400', progress: current.confidence },
          { label: 'الملاءمة الاستراتيجية', value: `${current.strategicFit}%`, detail: 'اتساق الفرصة مع التوجهات', icon: Target, colour: 'text-violet-400', progress: current.strategicFit },
          { label: 'مخاطر عالية', value: String(highRisks), detail: 'تحتاج إجراءً قبل الاعتماد', icon: AlertTriangle, colour: 'text-rose-400', progress: Math.max(5, 100 - highRisks * 18) },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl bg-[#121422] border border-slate-800/80 p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className={`w-11 h-11 rounded-2xl ${themeClasses.soft} border flex items-center justify-center`}><Icon className={`w-5 h-5 ${card.colour}`} /></div>
                <div className="text-left" dir="rtl">
                  <p className="text-xs text-slate-400 font-bold">{card.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{card.value}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 mb-2">{card.detail}</p>
              {renderProgress(card.progress)}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className={`text-xs font-black ${themeClasses.text}`}>مسار نضج الفرصة</p>
              <h3 className="text-xl font-black text-white mt-1">من الاستقبال إلى قرار قابل للبناء</h3>
            </div>
            <span className={`px-3 py-1.5 rounded-full border text-[11px] font-black ${statusBadge(current.status)}`}>{current.status}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {stageOrder.map((stage, index) => {
              const done = index < stageIndex;
              const active = index === stageIndex;
              return (
                <button
                  key={stage}
                  onClick={() => updateCurrent({ stage })}
                  className={`rounded-2xl border p-4 text-right min-h-[124px] transition-all ${active ? `${themeClasses.soft} border-[var(--theme-accent)]` : done ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-black/20 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black mb-3 ${done ? 'bg-emerald-500 text-slate-950' : active ? 'bg-[var(--theme-accent)] text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <p className="text-xs font-black text-slate-200 leading-relaxed">{stage}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-4 rounded-3xl bg-gradient-to-br from-[#121422] to-[#0c1d2b] border border-slate-800/80 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className={`w-11 h-11 rounded-2xl ${themeClasses.soft} border flex items-center justify-center`}><BrainCircuit className={`w-5 h-5 ${themeClasses.text}`} /></div>
            <div className="text-right">
              <p className={`text-xs font-black ${themeClasses.text}`}>توجيه الذكاء التنفيذي</p>
              <h3 className="text-lg font-black text-white mt-1">الإجراء الأعلى أولوية</h3>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-7">
            قبل أي توصية كمية للمزيج السكني، يجب تثبيت أن المشروع <strong className="text-white">مخطط متعدد القطع</strong>، واستلام المخطط العام المعتمد ومساحات القطع والخدمات، ثم بناء المقارنات على مستوى المنتجات الممكنة لكل نطاق داخل المخطط.
          </p>
          <div className="mt-5 space-y-2">
            {current.missingData.slice(0, 4).map((item, index) => (
              <div key={item} className="flex gap-2 items-start rounded-xl bg-black/20 border border-white/5 p-3">
                <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-black flex-shrink-0">{index + 1}</span>
                <p className="text-[11px] text-slate-400 leading-5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <button onClick={() => setActiveTab('scenarios')} className={`text-xs font-black ${themeClasses.text} flex items-center gap-1`}>فتح المقارنة <ChevronLeft className="w-3.5 h-3.5" /></button>
            <h3 className="text-lg font-black text-white">السيناريوهات المرشحة</h3>
          </div>
          <div className="space-y-3">
            {current.scenarios.map(item => (
              <div key={item.id} className={`rounded-2xl border p-4 ${bestScenario?.id === item.id ? `${themeClasses.soft}` : 'bg-black/20 border-slate-800'}`}>
                <div className="flex justify-between items-start gap-3">
                  <span className={`text-2xl font-black ${bestScenario?.id === item.id ? themeClasses.text : 'text-slate-300'}`}>{item.score}</span>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-5">{item.executionModel}</p>
                  </div>
                </div>
                <div className="mt-3">{renderProgress(item.score, item.risk === 'مرتفع' ? 'from-rose-500 to-amber-400' : 'from-emerald-500 to-cyan-400')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <button onClick={() => setActiveTab('decision')} className={`text-xs font-black ${themeClasses.text} flex items-center gap-1`}>مذكرة القرار <ChevronLeft className="w-3.5 h-3.5" /></button>
            <h3 className="text-lg font-black text-white">بوابات ما قبل الاعتماد</h3>
          </div>
          <div className="space-y-3">
            {current.decisionConditions.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-black/20 border border-slate-800 p-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-black text-xs">G{index + 1}</div>
                <p className="flex-1 text-xs text-slate-300 leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntake = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="text-right">
            <p className={`text-xs font-black ${themeClasses.text}`}>بطاقة تعريف الفرصة</p>
            <h3 className="text-xl font-black text-white mt-1">التصنيف الصحيح قبل بدء التحليل</h3>
          </div>
          <ClipboardCheck className={`w-8 h-8 ${themeClasses.text}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2 md:col-span-2"><span className="text-xs font-bold text-slate-400">اسم الفرصة</span><input value={current.title} onChange={event => updateCurrent({ title: event.target.value })} className={`w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none ${themeClasses.ring}`} /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">نوع الفرصة</span><select value={current.type} onChange={event => updateCurrent({ type: event.target.value as OpportunityType })} className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"><option>مخطط سكني متعدد القطع</option><option>قطعة تطوير مفردة</option><option>أرض خام</option><option>مجمع سكني</option><option>مشروع متعدد الاستخدامات</option><option>فرصة صناعية</option><option>فرصة تعليمية</option><option>فرصة تقنية</option><option>استحواذ أو شراكة</option></select></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">القطاع</span><input value={current.sector} onChange={event => updateCurrent({ sector: event.target.value })} className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">المدينة</span><input value={current.city} onChange={event => updateCurrent({ city: event.target.value })} className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">الحي / النطاق</span><input value={current.district} onChange={event => updateCurrent({ district: event.target.value })} className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">المساحة الإجمالية للمخطط</span><input type="number" value={current.landArea || ''} onChange={event => updateCurrent({ landArea: event.target.value ? Number(event.target.value) : null })} placeholder="تدخل بعد التحقق" className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">عدد القطع</span><input type="number" value={current.parcelCount || ''} onChange={event => updateCurrent({ parcelCount: event.target.value ? Number(event.target.value) : null })} placeholder="تدخل بعد استلام المخطط" className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">سعر العرض</span><input type="number" value={current.askingPrice || ''} onChange={event => updateCurrent({ askingPrice: event.target.value ? Number(event.target.value) : null })} placeholder="ريال سعودي" className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2"><span className="text-xs font-bold text-slate-400">الراعي التنفيذي</span><input value={current.sponsor} onChange={event => updateCurrent({ sponsor: event.target.value })} className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none" /></label>
          <label className="space-y-2 md:col-span-2"><span className="text-xs font-bold text-slate-400">هدف الدراسة والقرار المطلوب</span><textarea rows={4} value={current.objective} onChange={event => updateCurrent({ objective: event.target.value })} className="w-full bg-[#16182c] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none" /></label>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <button onClick={() => setToast('تم حفظ بطاقة الفرصة في الذاكرة المؤسسية المحلية')} className={`px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 ${themeClasses.bg} text-white`}><Save className="w-4 h-4" /> حفظ التحديثات</button>
          <button onClick={() => updateCurrent({ status: 'بانتظار التحقق', stage: 'جمع الأدلة' })} className="px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200"><ArrowUpRight className="w-4 h-4" /> إحالة للتحقق</button>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-5">
        <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-5 shadow-xl">
          <h3 className="text-base font-black text-white mb-4">اختبار التصنيف المبكر</h3>
          <div className="space-y-3 text-[11px] leading-6">
            {[
              ['وحدة التحليل', current.type === 'مخطط سكني متعدد القطع' ? 'المخطط والقطع ومراحل التطوير' : 'الأصل أو المشروع المحدد'],
              ['المخرج المطلوب', current.type === 'مخطط سكني متعدد القطع' ? 'مزيج القطع والمنتجات والخدمات والمراحل' : 'أفضل استخدام ونموذج مالي وتنفيذي'],
              ['الخطأ الواجب منعه', current.type === 'مخطط سكني متعدد القطع' ? 'اختزال المخطط في نموذج عمارة واحدة' : 'تعميم افتراضات غير مناسبة على الأصل'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-black/20 border border-slate-800 p-3"><p className={`font-black ${themeClasses.text}`}>{label}</p><p className="text-slate-300 mt-1">{value}</p></div>
            ))}
          </div>
        </div>
        <div className={`rounded-3xl border p-5 ${themeClasses.soft}`}>
          <div className="flex justify-between items-center mb-4"><Sparkles className={`w-5 h-5 ${themeClasses.text}`} /><h3 className="text-base font-black text-white">نواقص الاستقبال</h3></div>
          <div className="space-y-2">{current.missingData.map(item => <div key={item} className="flex gap-2 items-start"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-1 flex-shrink-0" /><p className="text-[11px] text-slate-300 leading-5">{item}</p></div>)}</div>
        </div>
      </div>
    </div>
  );

  const renderEvidence = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          ['اكتمال الأدلة', `${evidenceCompletion}%`, FileText, 'text-blue-400'],
          ['موثق', String(verifiedEvidence), CheckCircle2, 'text-emerald-400'],
          ['قيد المراجعة', String(current.evidence.filter(item => item.status === 'قيد المراجعة').length), RefreshCw, 'text-amber-400'],
          ['مفقود', String(current.evidence.filter(item => item.status === 'مفقود').length), AlertTriangle, 'text-rose-400'],
        ].map(([label, value, Icon, colour]) => {
          const DisplayIcon = Icon as typeof FileText;
          return <div key={String(label)} className="rounded-2xl bg-[#121422] border border-slate-800 p-4 flex justify-between items-center"><DisplayIcon className={`w-5 h-5 ${colour}`} /><div className="text-right"><p className="text-[10px] text-slate-500 font-bold">{String(label)}</p><p className="text-2xl text-white font-black mt-1">{String(value)}</p></div></div>;
        })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 rounded-3xl bg-[#121422] border border-slate-800/80 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center gap-4"><button onClick={addEvidence} className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 ${themeClasses.bg} text-white`}><Upload className="w-4 h-4" /> إضافة مستند</button><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>غرفة أدلة الفرصة</p><h3 className="text-lg font-black text-white mt-1">كل حقيقة مرتبطة بمصدر ومسؤول وحالة تحقق</h3></div></div>
          <div className="divide-y divide-slate-800/70">
            {current.evidence.map(item => (
              <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-[1.5fr_.7fr_.7fr_.8fr] gap-3 items-center hover:bg-white/[0.025]">
                <div className="text-right"><p className="text-sm font-black text-slate-200">{item.title}</p><p className="text-[10px] text-slate-500 mt-1">آخر تحديث: {item.updatedAt}</p></div>
                <span className="text-[11px] text-slate-400 font-bold">{item.category}</span>
                <button onClick={() => updateCurrent({ evidence: current.evidence.map(evidence => evidence.id === item.id ? { ...evidence, status: evidence.status === 'موثق' ? 'قيد المراجعة' : 'موثق' } : evidence) })} className={`w-fit px-3 py-1.5 rounded-full border text-[10px] font-black ${item.status === 'موثق' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : item.status === 'مفقود' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>{item.status}</button>
                <span className="text-[10px] text-slate-500 font-bold">{item.owner}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="xl:col-span-4 space-y-5">
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4"><MapPinned className={`w-5 h-5 ${themeClasses.text}`} /><h3 className="text-base font-black text-white">بطاقة الموقع والمخطط</h3></div>
            <div className="space-y-3">
              {[
                ['المدينة', current.city || 'غير محدد'],
                ['النطاق', current.district || 'غير محدد'],
                ['نوع الأصل', current.type],
                ['المساحة الكلية', current.landArea ? `${current.landArea.toLocaleString('ar-SA')} م²` : 'لم تثبت'],
                ['عدد القطع', current.parcelCount ? current.parcelCount.toLocaleString('ar-SA') : 'لم يثبت'],
                ['قطعة مرجعية', current.referenceParcelArea ? `${current.referenceParcelArea.toLocaleString('ar-SA')} م²` : 'لا يوجد'],
              ].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-slate-800 pb-2"><span className="text-xs text-slate-300 font-black">{value}</span><span className="text-[10px] text-slate-500">{label}</span></div>)}
            </div>
            {current.locationUrl && <a href={current.locationUrl} target="_blank" rel="noreferrer" className={`mt-4 w-full rounded-xl border ${themeClasses.soft} ${themeClasses.text} py-3 text-xs font-black flex items-center justify-center gap-2`}><Globe2 className="w-4 h-4" /> فتح الموقع الجغرافي</a>}
          </div>
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-5 shadow-xl"><h3 className="text-base font-black text-white mb-4">قواعد جودة الأدلة</h3><div className="space-y-3">{['تاريخ الرصد ظاهر وقابل للتتبع','التمييز بين المصدر الرسمي والمعلن والميداني','عدم تحويل الافتراض إلى حقيقة دون دليل','درجة ثقة لكل مقارنة أو تقدير','تسجيل صاحب المعلومة وآخر تحديث'].map((item,index)=><div key={item} className="flex gap-3 items-start"><span className={`w-6 h-6 rounded-lg ${themeClasses.soft} ${themeClasses.text} flex items-center justify-center text-[10px] font-black flex-shrink-0`}>{index+1}</span><p className="text-[11px] text-slate-400 leading-5">{item}</p></div>)}</div></div>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['عينات مقارنة', current.marketComparables.length, Database],
          ['نطاقات سوقية', new Set(current.marketComparables.map(item => item.area)).size, MapPinned],
          ['منتجات تحت الاختبار', new Set(current.marketComparables.map(item => item.product)).size, Building2],
          ['ثقة مرتفعة', current.marketComparables.filter(item => item.confidence === 'مرتفعة').length, ShieldAlert],
        ].map(([label, value, Icon]) => { const DisplayIcon = Icon as typeof Database; return <div key={String(label)} className="rounded-2xl bg-[#121422] border border-slate-800 p-4"><div className="flex justify-between items-center"><DisplayIcon className={`w-5 h-5 ${themeClasses.text}`} /><span className="text-3xl font-black text-white">{String(value)}</span></div><p className="text-[10px] text-slate-500 font-bold mt-3 text-right">{String(label)}</p></div>; })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 rounded-3xl bg-[#121422] border border-slate-800/80 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center"><div className="flex items-center gap-2 bg-[#16182c] border border-slate-800 rounded-xl px-3 py-2"><Search className="w-4 h-4 text-slate-500" /><input placeholder="بحث في المقارنات" className="bg-transparent outline-none text-xs text-white w-44" /></div><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>قاعدة المعرفة السوقية</p><h3 className="text-lg font-black text-white mt-1">الأسعار والمنتجات والتفضيلات ودرجة الثقة</h3></div></div>
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[800px]"><thead className="bg-black/20 text-[10px] text-slate-500"><tr><th className="p-3">النطاق</th><th className="p-3">المنتج</th><th className="p-3">المساحة</th><th className="p-3">السعر</th><th className="p-3">المصدر</th><th className="p-3">الثقة</th></tr></thead><tbody className="divide-y divide-slate-800">{current.marketComparables.map(item=><tr key={item.id} className="hover:bg-white/[0.025]"><td className="p-3 text-xs text-slate-200 font-bold">{item.area}</td><td className="p-3 text-xs text-slate-300">{item.product}</td><td className="p-3 text-[11px] text-slate-400">{item.size}</td><td className="p-3 text-[11px] text-slate-300">{item.price}</td><td className="p-3 text-[10px] text-slate-500">{item.source}</td><td className="p-3"><span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${item.confidence==='مرتفعة'?'bg-emerald-500/10 text-emerald-300':item.confidence==='متوسطة'?'bg-amber-500/10 text-amber-300':'bg-rose-500/10 text-rose-300'}`}>{item.confidence}</span></td></tr>)}</tbody></table>
          </div>
        </div>
        <div className="xl:col-span-4 space-y-5">
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-5 shadow-xl"><div className="flex justify-between items-center mb-4"><Filter className={`w-5 h-5 ${themeClasses.text}`} /><h3 className="text-base font-black text-white">منهج ترجيح المقارنات</h3></div>{[['حداثة الرصد','25%'],['قرب الموقع','25%'],['تشابه المنتج والمساحة','25%'],['موثوقية المصدر','15%'],['تشابه مستوى التشطيب','10%']].map(([label,value])=><div key={label} className="mb-3"><div className="flex justify-between text-[10px] mb-1"><span className={themeClasses.text}>{value}</span><span className="text-slate-400">{label}</span></div>{renderProgress(Number(value.replace('%','')),'from-blue-500 to-cyan-400')}</div>)}</div>
          <div className={`rounded-3xl border p-5 ${themeClasses.soft}`}><div className="flex justify-between items-center mb-4"><Lightbulb className={`w-5 h-5 ${themeClasses.text}`} /><h3 className="text-base font-black text-white">تفضيلات يجب قياسها</h3></div><div className="flex flex-wrap gap-2">{['السعر الإجمالي','مساحة القطعة','نوع المنتج','عدد الغرف','الخصوصية','سهولة التمويل','المواقف','الخدمات','الضمانات','الوقت المتوقع للتسليم'].map(item=><span key={item} className="px-3 py-1.5 rounded-full bg-black/20 border border-white/10 text-[10px] text-slate-300 font-bold">{item}</span>)}</div></div>
        </div>
      </div>
    </div>
  );

  const renderScenarios = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {current.scenarios.map(item => (
          <div key={item.id} className={`rounded-3xl border p-5 shadow-xl ${bestScenario?.id === item.id ? `${themeClasses.soft} border-[var(--theme-accent)]` : 'bg-[#121422] border-slate-800/80'}`}>
            <div className="flex justify-between items-start gap-3"><div className={`w-12 h-12 rounded-2xl ${bestScenario?.id === item.id ? 'bg-[var(--theme-accent)] text-white' : 'bg-slate-800 text-slate-300'} flex items-center justify-center font-black text-lg`}>{item.score}</div><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>{bestScenario?.id === item.id ? 'المرشح الأعلى حالياً' : 'سيناريو تطوير'}</p><h3 className="text-xl font-black text-white mt-1">{item.name}</h3></div></div>
            <p className="text-xs text-slate-400 leading-6 mt-4 min-h-[72px]">{item.thesis}</p>
            <div className="space-y-3 mt-4 border-t border-slate-800 pt-4">
              <div><p className="text-[9px] text-slate-500">مزيج المنتج</p><p className="text-[11px] text-slate-200 leading-5 mt-1">{item.productMix}</p></div>
              <div><p className="text-[9px] text-slate-500">نموذج التنفيذ</p><p className="text-[11px] text-slate-200 leading-5 mt-1">{item.executionModel}</p></div>
              <div className="grid grid-cols-2 gap-2"><label className="space-y-1"><span className="text-[9px] text-slate-500">مدة التطوير</span><input type="number" value={item.durationMonths} onChange={event=>updateScenario(item.id,{durationMonths:Number(event.target.value)})} className="w-full rounded-lg bg-black/20 border border-slate-800 px-2 py-2 text-xs text-white" /></label><label className="space-y-1"><span className="text-[9px] text-slate-500">مدة الامتصاص</span><input type="number" value={item.absorptionMonths} onChange={event=>updateScenario(item.id,{absorptionMonths:Number(event.target.value)})} className="w-full rounded-lg bg-black/20 border border-slate-800 px-2 py-2 text-xs text-white" /></label></div>
              <div className="grid grid-cols-2 gap-2"><label className="space-y-1"><span className="text-[9px] text-slate-500">التكلفة الرأسمالية</span><input type="number" value={item.capex || ''} onChange={event=>updateScenario(item.id,{capex:Number(event.target.value)})} placeholder="ريال" className="w-full rounded-lg bg-black/20 border border-slate-800 px-2 py-2 text-xs text-white" /></label><label className="space-y-1"><span className="text-[9px] text-slate-500">الإيراد المتوقع</span><input type="number" value={item.revenue || ''} onChange={event=>updateScenario(item.id,{revenue:Number(event.target.value)})} placeholder="ريال" className="w-full rounded-lg bg-black/20 border border-slate-800 px-2 py-2 text-xs text-white" /></label></div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5"><BarChart3 className={`w-6 h-6 ${themeClasses.text}`} /><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>مصفوفة المفاضلة</p><h3 className="text-lg font-black text-white mt-1">المقارنة لا تعتمد على العائد وحده</h3></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">{[['القيمة والعائد','30%','الإيراد والهامش والقيمة المتبقية'],['طلب السوق','25%','حجم الشريحة وسرعة الامتصاص'],['قابلية التنفيذ','20%','الاشتراطات والبنية والقدرات'],['المخاطر والتمويل','15%','رأس المال والحساسية والتدفقات'],['الملاءمة الاستراتيجية','10%','الهوية والتوسع وبناء القدرة']].map(([title,weight,desc])=><div key={title} className="rounded-2xl bg-black/20 border border-slate-800 p-4"><span className={`text-2xl font-black ${themeClasses.text}`}>{weight}</span><h4 className="text-sm text-white font-black mt-3">{title}</h4><p className="text-[10px] text-slate-500 leading-5 mt-2">{desc}</p></div>)}</div>
      </div>
    </div>
  );

  const renderStakeholders = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-7 rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5"><Users className={`w-6 h-6 ${themeClasses.text}`} /><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>خريطة أصحاب المصلحة</p><h3 className="text-lg font-black text-white mt-1">المصلحة والتأثير وخطة المشاركة</h3></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{current.stakeholders.map(item=><div key={item.name} className="rounded-2xl bg-black/20 border border-slate-800 p-4"><div className="flex justify-between gap-3"><span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${item.influence==='مرتفع'?'bg-rose-500/10 text-rose-300':item.influence==='متوسط'?'bg-amber-500/10 text-amber-300':'bg-slate-700 text-slate-300'}`}>تأثير {item.influence}</span><div className="text-right"><h4 className="text-sm font-black text-white">{item.name}</h4><p className="text-[9px] text-slate-500 mt-1">{item.role}</p></div></div><p className="text-[10px] text-slate-400 leading-5 mt-3"><strong className="text-slate-300">المصلحة:</strong> {item.interest}</p><p className="text-[10px] text-slate-400 leading-5 mt-2"><strong className={themeClasses.text}>المشاركة:</strong> {item.engagement}</p></div>)}</div>
      </div>
      <div className="xl:col-span-5 rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5"><ShieldAlert className="w-6 h-6 text-rose-400" /><div className="text-right"><p className="text-xs font-black text-rose-400">سجل المخاطر</p><h3 className="text-lg font-black text-white mt-1">الأولوية = الاحتمال × الأثر</h3></div></div>
        <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">{current.risks.sort((a,b)=>(b.likelihood*b.impact)-(a.likelihood*a.impact)).map(item=>{const score=item.likelihood*item.impact;return <div key={item.id} className="rounded-2xl bg-black/20 border border-slate-800 p-4"><div className="flex justify-between gap-3"><span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${score>=16?'bg-rose-500/15 text-rose-300':score>=10?'bg-amber-500/15 text-amber-300':'bg-emerald-500/15 text-emerald-300'}`}>{score}</span><div className="text-right"><h4 className="text-xs font-black text-white leading-5">{item.title}</h4><p className="text-[9px] text-slate-500 mt-1">{item.category} • المسؤول: {item.owner}</p></div></div><p className="text-[10px] text-slate-400 leading-5 mt-3"><strong className={themeClasses.text}>المعالجة:</strong> {item.mitigation}</p></div>})}</div>
      </div>
    </div>
  );

  const renderDecision = () => (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-[#102638] via-[#121422] to-[#17210f] border border-slate-700/70 p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--theme-accent-soft)] blur-3xl" />
        <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 text-right">
            <span className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black ${statusBadge(current.status)}`}>{current.status} • {current.stage}</span>
            <p className={`text-xs font-black ${themeClasses.text} mt-5`}>مذكرة قرار تنفيذية</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mt-2">{current.title}</h2>
            <p className="text-sm text-slate-300 leading-8 mt-4 max-w-4xl">{current.objective}</p>
          </div>
          <div className="xl:col-span-4 grid grid-cols-2 gap-3">
            {[
              ['الجاهزية', `${current.readiness}%`],
              ['الثقة', `${current.confidence}%`],
              ['الملاءمة', `${current.strategicFit}%`],
              ['السيناريو المرشح', bestScenario?.name || 'غير متاح'],
            ].map(([label,value])=><div key={label} className="rounded-2xl bg-black/25 border border-white/10 p-4 text-right"><p className="text-[9px] text-slate-500">{label}</p><p className={`text-lg font-black mt-2 ${themeClasses.text}`}>{value}</p></div>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-5">
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl"><h3 className="text-lg font-black text-white mb-4">الخلاصة التنفيذية الحالية</h3><div className={`rounded-2xl border p-5 ${themeClasses.soft}`}><p className="text-sm text-slate-200 leading-8">الفرصة يجب تقييمها باعتبارها <strong className="text-white">مخططاً سكنياً متعدد القطع</strong>. وعليه، فإن القرار لا يتعلق بعدد شقق في مبنى واحد، بل بتوزيع القطع والمنتجات والخدمات، وترتيب مراحل التطوير، ونموذج التنفيذ والتمويل. السيناريو المتوازن هو المرشح المبدئي، لكنه يظل مشروطاً باستكمال المخطط العام والبيانات السوقية والنموذج المالي.</p></div></div>
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl"><h3 className="text-lg font-black text-white mb-4">القرار المقترح</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{[['اعتماد مشروط','الانتقال إلى دراسة مفاهيمية ونموذج مالي بعد استيفاء البوابات.','text-emerald-400'],['عدم تثبيت المنتج','تأجيل اعتماد المزيج النهائي حتى اختبار الطلب وتوزيع القطع.','text-amber-400'],['تنفيذ مرحلي','ربط كل مرحلة بمؤشر مبيعات وتمويل ومخاطر محدد.','text-blue-400']].map(([title,desc,colour])=><div key={title} className="rounded-2xl bg-black/20 border border-slate-800 p-4"><CheckCircle2 className={`w-5 h-5 ${colour}`} /><h4 className="text-sm font-black text-white mt-3">{title}</h4><p className="text-[10px] text-slate-500 leading-5 mt-2">{desc}</p></div>)}</div></div>
        </div>
        <div className="xl:col-span-5 space-y-5">
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl"><h3 className="text-lg font-black text-white mb-4">شروط الاعتماد</h3><div className="space-y-3">{current.decisionConditions.map((item,index)=><div key={item} className="flex gap-3 items-start rounded-xl bg-black/20 border border-slate-800 p-3"><span className={`w-7 h-7 rounded-lg ${themeClasses.soft} ${themeClasses.text} flex items-center justify-center text-[10px] font-black flex-shrink-0`}>{index+1}</span><p className="text-[11px] text-slate-300 leading-5">{item}</p></div>)}</div></div>
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-6 shadow-xl"><div className="grid grid-cols-2 gap-3"><button onClick={exportBrief} className="rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-black text-slate-200 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> تصدير الموجز</button><button disabled={current.readiness < 80} onClick={approveOpportunity} className={`rounded-xl py-3 text-xs font-black flex items-center justify-center gap-2 ${current.readiness>=80?`${themeClasses.bg} text-white`:'bg-slate-800 text-slate-600 cursor-not-allowed'}`}><Zap className="w-4 h-4" /> اعتماد وتحويل</button></div><p className="text-[9px] text-slate-500 leading-5 mt-3 text-center">يُفتح الاعتماد عند وصول الجاهزية إلى 80% فأعلى وإغلاق المخاطر الحرجة.</p></div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'intake': return renderIntake();
      case 'evidence': return renderEvidence();
      case 'market': return renderMarket();
      case 'scenarios': return renderScenarios();
      case 'stakeholders': return renderStakeholders();
      case 'decision': return renderDecision();
      default: return renderCockpit();
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease_out] text-right">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCreate(true)} className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 ${themeClasses.bg} text-white shadow-lg`}><Plus className="w-4 h-4" /> فرصة جديدة</button>
          <button onClick={exportBrief} className="px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200"><Download className="w-4 h-4" /> تصدير</button>
        </div>
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.text}`}>Opportunity & Investment Intelligence Lab</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">مختبر الفرص والقرارات الاستثمارية</h2>
          <p className="text-xs text-slate-400 mt-2">من استقبال العرض وبناء الأدلة إلى السيناريوهات ومذكرة القرار والتحويل إلى مشروع تنفيذي.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6 items-start">
        <aside className="rounded-3xl bg-[#121422] border border-slate-800/80 shadow-xl overflow-hidden xl:sticky xl:top-24">
          <div className="p-4 border-b border-slate-800"><div className="flex gap-2 items-center bg-[#16182c] border border-slate-800 rounded-xl px-3 py-2.5"><Search className="w-4 h-4 text-slate-500" /><input value={searchQuery} onChange={event=>setSearchQuery(event.target.value)} placeholder="بحث في الفرص" className="w-full bg-transparent text-xs text-white outline-none" /></div></div>
          <div className="p-3 max-h-[510px] overflow-y-auto space-y-2">
            {filteredOpportunities.map(item=><button key={item.id} onClick={()=>setSelectedId(item.id)} className={`w-full text-right rounded-2xl border p-3.5 transition-all ${item.id===current.id?`${themeClasses.soft} border-[var(--theme-accent)]`:'bg-black/20 border-slate-800 hover:border-slate-700'}`}><div className="flex justify-between gap-2 items-start"><span className={`text-[9px] px-2 py-1 rounded-full border ${statusBadge(item.status)}`}>{item.status}</span><div><p className="text-xs font-black text-white leading-5">{item.title}</p><p className="text-[9px] text-slate-500 mt-1">{item.city || 'الموقع غير محدد'} • {item.type}</p></div></div><div className="mt-3 flex items-center gap-2"><div className="flex-1">{renderProgress(item.readiness)}</div><span className={`text-[10px] font-black ${themeClasses.text}`}>{item.readiness}%</span></div></button>)}
          </div>
          <div className="p-4 border-t border-slate-800 bg-black/15"><div className="grid grid-cols-2 gap-2 text-center"><div><p className={`text-xl font-black ${themeClasses.text}`}>{opportunities.length}</p><p className="text-[9px] text-slate-500">فرص مسجلة</p></div><div><p className="text-xl font-black text-white">{opportunities.filter(item=>item.status==='جاهز للقرار'||item.status==='معتمد').length}</p><p className="text-[9px] text-slate-500">جاهزة / معتمدة</p></div></div></div>
        </aside>

        <section className="min-w-0">
          <div className="rounded-3xl bg-[#121422] border border-slate-800/80 p-5 shadow-xl mb-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">{tabs.map(tab=>{const Icon=tab.icon;return <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-3 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${activeTab===tab.id?`${themeClasses.bg} text-white shadow-lg`:'bg-black/20 border border-slate-800 text-slate-400 hover:text-white'}`}><Icon className="w-3.5 h-3.5" />{tab.label}</button>})}</div>
              <div className="text-right"><div className="flex items-center gap-2 justify-end"><span className={`px-2.5 py-1 rounded-full border text-[9px] font-black ${statusBadge(current.status)}`}>{current.status}</span><span className="text-[10px] text-slate-500">{current.id}</span></div><h3 className="text-xl font-black text-white mt-2">{current.title}</h3><p className="text-[10px] text-slate-500 mt-1">{current.type} • {current.stage}</p></div>
            </div>
          </div>
          {renderActiveTab()}
        </section>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setShowCreate(false)}>
          <div className="w-full max-w-2xl rounded-3xl bg-[#121422] border border-slate-700 shadow-2xl p-6" onClick={event=>event.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5"><button onClick={()=>setShowCreate(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button><div className="text-right"><p className={`text-xs font-black ${themeClasses.text}`}>تسجيل فرصة جديدة</p><h3 className="text-xl font-black text-white mt-1">بطاقة استقبال سريعة</h3></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><label className="space-y-2 md:col-span-2"><span className="text-xs text-slate-400">اسم الفرصة</span><input value={draft.title} onChange={event=>setDraft({...draft,title:event.target.value})} className="w-full rounded-xl bg-[#16182c] border border-slate-800 px-4 py-3 text-sm text-white outline-none" /></label><label className="space-y-2"><span className="text-xs text-slate-400">النوع</span><select value={draft.type} onChange={event=>setDraft({...draft,type:event.target.value as OpportunityType})} className="w-full rounded-xl bg-[#16182c] border border-slate-800 px-4 py-3 text-sm text-white"><option>مخطط سكني متعدد القطع</option><option>قطعة تطوير مفردة</option><option>أرض خام</option><option>مجمع سكني</option><option>مشروع متعدد الاستخدامات</option><option>فرصة صناعية</option><option>فرصة تعليمية</option><option>فرصة تقنية</option><option>استحواذ أو شراكة</option></select></label><label className="space-y-2"><span className="text-xs text-slate-400">القطاع</span><input value={draft.sector} onChange={event=>setDraft({...draft,sector:event.target.value})} className="w-full rounded-xl bg-[#16182c] border border-slate-800 px-4 py-3 text-sm text-white outline-none" /></label><label className="space-y-2"><span className="text-xs text-slate-400">المدينة</span><input value={draft.city} onChange={event=>setDraft({...draft,city:event.target.value})} className="w-full rounded-xl bg-[#16182c] border border-slate-800 px-4 py-3 text-sm text-white outline-none" /></label><label className="space-y-2"><span className="text-xs text-slate-400">الحي / الموقع</span><input value={draft.district} onChange={event=>setDraft({...draft,district:event.target.value})} className="w-full rounded-xl bg-[#16182c] border border-slate-800 px-4 py-3 text-sm text-white outline-none" /></label><label className="space-y-2 md:col-span-2"><span className="text-xs text-slate-400">الهدف والقرار المطلوب</span><textarea rows={3} value={draft.objective} onChange={event=>setDraft({...draft,objective:event.target.value})} className="w-full rounded-xl bg-[#16182c] border border-slate-800 px-4 py-3 text-sm text-white outline-none resize-none" /></label></div>
            <div className="flex gap-3 mt-6"><button onClick={createOpportunity} className={`flex-1 rounded-xl py-3 text-xs font-black ${themeClasses.bg} text-white flex items-center justify-center gap-2`}><Plus className="w-4 h-4" /> إنشاء بطاقة الفرصة</button><button onClick={()=>setShowCreate(false)} className="px-5 rounded-xl bg-slate-800 text-slate-300 text-xs font-black">إلغاء</button></div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-6 z-50 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-2xl px-5 py-4 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><p className="text-xs font-black text-slate-200">{toast}</p></div>}
    </div>
  );
}
