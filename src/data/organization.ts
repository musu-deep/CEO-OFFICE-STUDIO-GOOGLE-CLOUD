/** Organizational matrix, 21 October 2026. Unnamed boxes are intentionally omitted. */
export type OrgNode = { id: string; name: string; view?: string; planned?: boolean; status?: string; description?: string; website?: string; children?: OrgNode[] };
const node = (id: string, name: string, children?: OrgNode[], view?: string): OrgNode => ({ id, name, children, view });
export const organization: OrgNode[] = [
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
  ]),
  node('logistics', 'اراك اللوجستية', undefined, 'logistic'),
  node('support', 'الإدارات المساندة', [
    node('internal-audit', 'المراجعة الداخلية'),
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
    node('resource-development', 'تنمية الموارد', [node('public-relations', 'العلاقات العامة')]),
    node('marketing', 'إدارة التسويق المركزي', [
      node('marketing-campaigns', 'الحملات التسويقية', [
        node('marketing-stores', 'أراك ستور'), node('marketing-home', 'أراك هوم'),
        { id: 'marketing-nest', name: 'نست', planned: true, status: 'مستقبلي' },
        { id: 'marketing-academy', name: 'أكاديمية أراك الرقمية', planned: true, status: 'مستقبلي' },
      ]),
      node('marketing-content', 'إدارة المحتوى'),
      node('marketing-social', 'متابعة منصات التواصل الاجتماعي'),
      node('marketing-analytics', 'تحليل الحملات والأداء الرقمي'),
      node('marketing-agent-link', 'الارتباط بوكلاء التحليل والمحتوى'),
      node('marketing-coverage', 'تغطية شركات وإدارات مجموعة أراك'),
    ]),
  ]),
  node('development', 'اراك للتنمية', [
    node('external-offices', 'المكاتب الخارجية', [node('london', 'لندن (مكتب افتراضي)'), node('khartoum', 'الخرطوم'), node('cairo', 'القاهرة', undefined, 'egypt'), node('istanbul', 'إسطنبول')]),
    node('education', 'الحلول التعليمية', [node('university-partnerships', 'الشراكات الجامعية')]),
    node('consulting', 'الاستشارات والتطوير', [node('consulting-services', 'الخدمات الاستشارية'), node('research', 'الدراسات والأبحاث'), node('training', 'التدريب والتأهيل'), node('accreditation', 'المقاييس والاعتمادات')]),
  ]),
  node('digital', 'أراك الرقمية', [
    node('araak-stores', 'اراك ستور'), node('grow-on', 'جرون'),
    node('araak-home', 'اراك هوم'), node('araak-ai', 'اراك AI'),
    node('academy', 'أكاديمية اراك'),
  ]),
  node('strategic-projects', 'المشاريع الاستراتيجية', [
    node('development-council', 'مجلس التنمية'),
    node('development-waqf-company', 'شركة وقف التنمية'),
    { id: 'university', name: 'جامعة أراك', status: 'قيد استكمال التراخيص', description: 'مشروع الجامعة ومتابعة متطلبات الترخيص', website: 'https://araak-university.org' },
    { id: 'volunteering', name: 'منصة أراك للتطوع', status: 'مشروع تنموي', description: 'منصة للتطوع في مجالات التنمية' },
    { id: 'tanmyat', name: 'مجتمع تنميات', status: 'مجتمع متخصص', description: 'للمهتمين بقطاع التنمية من خبراء وعاملين ومؤسسات وشركات وكيانات' },
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
