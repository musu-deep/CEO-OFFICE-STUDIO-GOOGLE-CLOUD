/** Organizational matrix, 21 October 2026. Unnamed boxes are intentionally omitted. */
export type OrgNode = { id: string; name: string; view?: string; planned?: boolean; children?: OrgNode[] };
const node = (id: string, name: string, children?: OrgNode[], view?: string): OrgNode => ({ id, name, children, view });
export const organization: OrgNode[] = [
  node('ceo', 'الرئيس التنفيذي', [
    node('ai-advisor', 'مستشار الذكاء الاصطناعي', undefined, 'ai-advisor'),
    node('internal-audit', 'المراجعة الداخلية'),
  ]),
  node('investment', 'اراك للاستثمار', [
    node('national', 'اراك الوطنية', [
      node('national-projects', 'اراك المشاريع', [
        node('technical-office', 'المكتب الفني'), node('sites', 'المواقع'),
        node('planning-quality', 'التخطيط والجودة'), node('operations-control', 'العمليات والرقابة'),
        node('contracts-procurement', 'العقود والمشتريات'),
        node('pricing-project-link', 'التنسيق مع قسم التسعير المركزي'),
      ]),
      node('trading', 'اراك التجارية', [node('showroom', 'المعرض'), node('warehouse', 'المستودع'), node('wholesale', 'الجملة والصفقات'), node('branches', 'الفروع')]),
    ]),
    node('industrial', 'اراك الصناعية', [node('steel-factory', 'اراك الحديد'), node('food', 'اراك الغذائية')]),
    node('digital', 'اراك الرقمية', [node('araak-stores', 'اراك ستور'), node('grow-on', 'جرون'), node('araak-home', 'اراك هوم'), node('araak-ai', 'اراك AI')]),
  ]),
  node('logistics', 'اراك اللوجستية', undefined, 'logistic'),
  node('support', 'الإدارات المساندة', [
    node('secretariat', 'السكرتارية التنفيذية'), node('legal', 'الشؤون القانونية'),
    node('hr', 'الموارد البشرية'), node('archive-documents', 'الأرشفة والوثائق'),
    node('governance', 'الحوكمة والجودة'),
    node('procurement', 'إدارة المشتريات والعقود', [node('pricing-procurement-link', 'التنسيق مع التسعير المركزي')]),
    node('finance', 'الشؤون المالية', [node('pricing-finance-link', 'التنسيق مع التسعير المركزي')]),
    node('pricing', 'قسم التسعير المركزي', [
      node('pricing-procurement', 'تكلفة المشتريات والمدخلات'),
      node('pricing-finance', 'التكلفة والربحية والهوامش'),
      node('pricing-projects', 'المقاولات والمشاريع'),
      node('pricing-store-showroom', 'المتجر الإلكتروني والمعرض'),
      node('pricing-factory', 'منتجات المصنع'),
    ]),
    node('administration', 'الإدارية والخدمات'), node('maintenance', 'المتابعة والصيانة'),
    node('it', 'تقنية المعلومات', [node('digital-transformation', 'التحول الرقمي'), node('marketing-media', 'تسويق وإعلام')]),
    node('resource-development', 'تنمية الموارد', [node('marketing', 'التسويق'), node('public-relations', 'العلاقات العامة')]),
  ]),
  node('development', 'اراك للتنمية', [
    node('external-offices', 'المكاتب الخارجية', [node('london', 'لندن (مكتب افتراضي)'), node('khartoum', 'الخرطوم'), node('cairo', 'القاهرة'), node('istanbul', 'إسطنبول')]),
    node('platforms', 'منصات اراك', [node('academy', 'أكاديمية اراك'), node('tanmyat', 'مجتمع تنميات'), node('university', 'جامعة اراك'), node('volunteering', 'منصة اراك التطوع')]),
    node('education', 'الحلول التعليمية', [node('education-platforms', 'منصات التعليم'), node('university-partnerships', 'الشراكات الجامعية')]),
    node('consulting', 'الاستشارات والتطوير', [node('consulting-services', 'الخدمات الاستشارية'), node('research', 'الدراسات والأبحاث'), node('training', 'التدريب والتأهيل', undefined, 'egypt'), node('accreditation', 'المقاييس والاعتمادات')]),
  ]),
  { ...node('planned', 'قيد التنفيذ', []), planned: true },
];
export function findOrgPath(id: string, nodes = organization, trail: OrgNode[] = []): OrgNode[] {
  for (const item of nodes) {
    const path = [...trail, item];
    if (item.id === id) return path;
    const found = findOrgPath(id, item.children || [], path);
    if (found.length) return found;
  }
  return [];
}
