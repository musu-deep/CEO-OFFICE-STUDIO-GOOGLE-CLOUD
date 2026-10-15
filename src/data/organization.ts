/** Organizational matrix, 29 July 2026. Unnamed boxes are intentionally omitted. */
export type OrgNode = { id: string; name: string; view?: string; planned?: boolean; children?: OrgNode[] };
const node = (id: string, name: string, children?: OrgNode[], view?: string): OrgNode => ({ id, name, children, view });
export const organization: OrgNode[] = [
  node('ceo', 'الرئيس التنفيذي', [
    node('ai-advisor', 'مستشار الذكاء الاصطناعي', undefined, 'ai-advisor'),
    node('secretariat', 'السكرتارية التنفيذية', undefined, 'secretariat'),
    node('legal', 'المستشار القانوني', undefined, 'legal'),
    node('internal-audit', 'المراجعة الداخلية'),
    node('governance', 'الحوكمة والجودة', undefined, 'governance'),
  ]),
  node('investment', 'اراك للاستثمار', [
    node('national', 'اراك الوطنية', [
      node('national-projects', 'اراك المشاريع', [
        node('technical-office', 'المكتب الفني'), node('sites', 'المواقع'),
        node('planning-quality', 'التخطيط والجودة'), node('operations-control', 'العمليات والرقابة'),
        node('contracts-procurement', 'العقود والمشتريات'),
      ]),
      node('trading', 'اراك التجارية', [node('showroom', 'المعرض'), node('warehouse', 'المستودع'), node('wholesale', 'الجملة والصفقات'), node('branches', 'الفروع')]),
    ]),
    node('industrial', 'اراك الصناعية', [node('steel-factory', 'مصنع اراك الحديد')]),
    node('digital', 'اراك الرقمية', [node('araak-stores', 'اراك ستورز'), node('grow-on', 'جرون'), node('araak-home', 'اراك هوم')]),
    node('logistics', 'اراك لوجستيك', undefined, 'logistic'),
  ]),
  node('support', 'الإدارات المساندة', [
    node('hr', 'الموارد البشرية'), node('finance', 'الشؤون المالية'),
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
  { ...node('planned', 'قيد التنفيذ', [node('food', 'اراك الغذائية'), node('araak-ai', 'اراك AI')]), planned: true },
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
