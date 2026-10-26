import { organization, type OrgNode } from '../data/organization';
import type { Metric, UnitSnapshot } from './unitWorkspace';
export const DEMO_INTERVAL = 120000;
export const orgUnits = (nodes: OrgNode[] = organization, root = ''): { id: string; name: string; root: string; planned: boolean }[] => nodes.flatMap(n => [{ id: n.id, name: n.name, root: root || n.id, planned: !!n.planned }, ...orgUnits(n.children || [], root || n.id)]);
export type FeedEvent = { id: string; unitId: string; title: string; detail: string; at: string; severity: 'normal' | 'warning' | 'critical'; decision: string | null };
export type ExecutiveFeed = { mode: 'demo'; generatedAt: string; scenarioAt: string; nextEventAt: string; units: (ReturnType<typeof orgUnits>[number] & { snapshot: UnitSnapshot })[]; events: FeedEvent[] };
const source = 'محاكاة تشغيلية · بيانات تجريبية غير فعلية';
const num = (s: string) => [...s].reduce((a,c) => (a*31+c.charCodeAt(0))>>>0,7);
export function buildExecutiveFeed(now = Date.now()): ExecutiveFeed {
  const tick = Math.floor(now / DEMO_INTERVAL);
  const scenarioAt = new Date(tick * DEMO_INTERVAL).toISOString();
  const period = new Date(now).toLocaleDateString('ar-SA', { timeZone:'Asia/Riyadh', month:'long', year:'numeric' });
  const units = orgUnits().map(u => {
    const seed = num(u.id), phase = (tick + seed)%9;
    const metric = (label: string, value: number, unit: string, target: number, direction: 'up'|'down' = 'up'): Metric => ({label,value,unit,target,direction,source,period:`سيناريو تجريبي · ${period}`,series:[0,1,2,3,4,5].map((p)=>({label:`فترة ${p+1}`,value:Math.round(value*(0.75+p*0.05))}))});
    const commercial = /trading|stores|home|showroom|wholesale|branches/.test(u.id);
    const factory = /industrial|factory|food/.test(u.id);
    const metrics = u.planned ? [metric('اكتمال خطة التأسيس',45+seed%30,'٪',100)] : commercial ? [metric('المبيعات',120000+seed%180000+phase*1000,'ريال',300000),metric('هامش الربح',18+seed%12,'٪',28),metric('التحصيل',76+phase,'٪',95),metric('دوران المخزون',3+seed%4,'مرة',6)] : factory ? [metric('الإنتاج',180+seed%100+phase,'طن',300),metric('استغلال الطاقة',70+phase,'٪',90),metric('الهدر',3+seed%5,'٪',3,'down'),metric('التسليم في الموعد',85+phase,'٪',98)] : u.id==='hr' ? [metric('إنجاز أهداف العاملين',75+phase,'٪',95),metric('الاستقرار الوظيفي',90+seed%8,'٪',98),metric('ساعات التأهيل',120+phase*5,'ساعة',180),metric('الشواغر',3+seed%5,'وظيفة',2,'down')] : u.id==='finance' ? [metric('السيولة المتاحة',800000+phase*10000,'ريال',1000000),metric('التحصيل',80+phase,'٪',95),metric('الالتزام بالميزانية',90+seed%8,'٪',100),metric('الذمم المتأخرة',180000+phase*1000,'ريال',100000,'down')] : [metric('إنجاز الخطة',65+seed%20+phase,'٪',95),metric('الإغلاق في الموعد',78+phase,'٪',95),metric('الالتزام بالميزانية',88+seed%10,'٪',100),metric('ملاحظات مفتوحة',3+seed%8,'ملاحظة',3,'down')];
    const needsAttention = seed%4===0;
    return {...u,snapshot:{summary:`${u.name}: ${u.planned?'متابعة جاهزية التأسيس':'متابعة تنفيذ الخطة والأداء'} ضمن سيناريو تجريبي. الأرقام افتراضية ولا تمثل نتائج المجموعة.`,metrics,risks:needsAttention?['تأخر افتراضي في إغلاق بند من الخطة يستدعي المتابعة.']:[],decisions:needsAttention?['مقترح تجريبي: مراجعة سبب التأخر وتحديد موعد للإغلاق.']:[],updatedAt:scenarioAt,source} satisfies UnitSnapshot};
  });
  // Stable IDs and timestamps across clients; a new simulated event appears every two minutes.
  const events: FeedEvent[] = Array.from({length:units.length},(_,i)=>{
    const slot=tick-i, u=units[((slot%units.length)+units.length)%units.length];
    const severity: FeedEvent['severity'] = slot%11===0?'critical':slot%4===0?'warning':'normal';
    return {id:`demo-${slot}-${u.id}`,unitId:u.id,at:new Date(slot*DEMO_INTERVAL).toISOString(),severity,title:u.planned?'تحديث جاهزية التأسيس':severity==='normal'?'تحديث مؤشرات الأداء':severity==='critical'?'تعثر يتطلب مراجعة تنفيذية':'انحراف عن المستهدف',detail:`${u.name} · ${severity==='normal'?'تسجيل تحديث دوري للخطة والمؤشرات':'تسجيل ملاحظة على تنفيذ الخطة للمتابعة'} · حدث تجريبي`,decision:severity==='critical'?'مقترح تجريبي: طلب خطة تصحيح وتحديد مسؤول المتابعة.':null};
  });
  return {mode:'demo',generatedAt:new Date(now).toISOString(),scenarioAt,nextEventAt:new Date((tick+1)*DEMO_INTERVAL).toISOString(),units,events};
}
