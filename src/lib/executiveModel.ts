import type { PerformanceReport } from './performanceReports';
import { organization, findOrgPath, type OrgNode } from '../data/organization';
import { achievement, type Metric, type UnitSnapshot } from './unitWorkspace';
export const dimensions = [
 ['plan','إنجاز الخطة'],['revenue','الإيرادات والنمو'],['profit','الربحية'],['cash','السيولة والتحصيل'],['budget','الالتزام بالموازنة'],['productivity','الإنتاجية'],['quality','جودة المخرجات'],['time','الالتزام الزمني'],['resources','كفاءة الموارد'],['risk','المخاطر والالتزام'],
] as const;
export const functions = [
 {id:'executive',name:'الإدارة التنفيذية والأمانة العامة',inputs:'الخطط والتقارير والتوجيهات',operations:'تنسيق الاجتماعات ومتابعة القرارات والخطط',outputs:'المتابعة اليومية والقرارات ومحاضر الاجتماعات'},
 {id:'sales',name:'المبيعات',inputs:'العملاء والفرص والأسعار والمخزون',operations:'إدارة الفرص والعروض والطلبات والتحصيل',outputs:'المبيعات والتحويل وتوقع الإيرادات'},
 {id:'legal',name:'الشؤون القانونية',inputs:'العقود والقضايا والوكالات',operations:'المراجعة والترافع ومتابعة النزاعات والوكالات',outputs:'موقف القضايا والالتزام والمخاطر القانونية'},
 {id:'finance',name:'الإدارة المالية',inputs:'القيود والموازنات والفواتير',operations:'الإقفال والتحليل وإدارة النقد ومطابقة الأنظمة',outputs:'المركز المالي والتدفقات والانحرافات'},
 {id:'procurement',name:'المشتريات والعقود',inputs:'الاحتياجات والميزانية وعروض الموردين',operations:'الشراء والتعاقد والتنسيق مع التسعير والمستفيدين',outputs:'العقود والوفورات وتقييم الموردين'},
 {id:'hr',name:'الموارد البشرية',inputs:'الوظائف والمهام والصلاحيات والكفاءات',operations:'التوظيف وتقييم الأداء وتطوير القدرات',outputs:'توزيع الوظائف والأداء وخطط التطوير'},
 {id:'it',name:'تقنية المعلومات والتحول الرقمي',inputs:'طلبات الأنظمة والأصول التقنية والمخاطر',operations:'تشغيل المنصات والأمن والبنية السحابية',outputs:'التوافر والاستجابة والتحول الرقمي'},
 {id:'marketing',name:'التسويق والإعلام',inputs:'الأهداف والجمهور والمحتوى والميزانيات',operations:'إدارة الحملات والمحتوى والظهور المؤسسي',outputs:'نتائج الحملات والتغطية وكفاءة الإنفاق'},
];
export type Entity = OrgNode & {root: string; parentId?: string; kind: 'company'|'department'; functionId?: string};
const companyIds = new Set(['investment','national','national-projects','trading','logistics','industrial','steel-factory','food','development','digital','araak-stores','araak-home','grow-on','araak-ai','academy','university','volunteering','tanmyat','development-council','development-waqf-company','education','consulting']);
export function entities(): Entity[] {
 const result: Entity[]=[];
 function walk(nodes: OrgNode[],root:string,parentId?:string){for(const n of nodes){result.push({...n,root,parentId,kind:companyIds.has(n.id)?'company':'department'});walk(n.children||[],root,n.id);}}
 for(const root of organization) walk([root],root.id);
 for(const company of result.filter(e=>e.kind==='company')) for(const f of functions) result.push({id:`${company.id}::${f.id}`,name:`${company.name} · ${f.name}`,root:company.root,parentId:company.id,kind:'department',functionId:f.id});
 return result;
}
export function resolveEntity(id:string){return entities().find(e=>e.id===id);}
export const actions = ['read','upload','edit','review','approve','direct'] as const;
export type Action = typeof actions[number];
export type Grant = {units:string[];actions:Action[]};
export type ExecutiveMetric = Metric & {dimension?: string; definition?: string; objectiveId?: string};
export type ExecutiveSnapshot = Omit<UnitSnapshot,'metrics'> & {metrics:ExecutiveMetric[]};
export type Revision = {id:string; snapshot:ExecutiveSnapshot; state:'draft'|'reviewed'|'approved'|'returned'; createdAt:string; author:string; reviewer?:string; reviewedAt?:string; note?:string};
export type Directive = {id:string;title:string;owner:string;due:string;status:'open'|'working'|'closed';createdAt:string;author:string};
export type UnitRecord = {version:number; approved?:Revision; pending?:Revision; history:Revision[]; documents:{id:string;name:string;mimeType:string;at:string;author:string}[];directives:Directive[]};
export type Objective = {id:string;title:string;target:string;owner:string};
export type ExecutiveState = {reports?:PerformanceReport[];units:Record<string,UnitRecord>;objectives:Objective[];grants:Record<string,Grant>;audit:{id:string;at:string;actor:string;unitId?:string;action:string}[]};
export const emptyRecord=():UnitRecord=>({version:0,history:[],documents:[],directives:[]});
export function hasPermission(email:string,role:string,grants:Record<string,Grant>,unitId:string,action:Action){
 if(role==='ceo'||role==='admin')return true;
 const grant=grants[email];if(!grant?.actions.includes(action))return false;
 return grant.units.some(scope=>scope===unitId || (unitId.includes('::') && scope===unitId.split('::')[0]) || findOrgPath(unitId.split('::')[0]).some(n=>n.id===scope));
}
export function comparable(a:ExecutiveMetric,b:ExecutiveMetric){return !!a.definition?.trim() && !!a.period?.trim() && !!a.unit?.trim() && a.dimension===b.dimension && a.definition.trim()===b.definition?.trim() && a.period.trim()===b.period?.trim() && a.unit.trim()===b.unit?.trim() && a.direction===b.direction;}
export function score(m:ExecutiveMetric){return achievement(m);}
