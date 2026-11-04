import type {ExecutiveState} from '../lib/executiveModel';
import {dashboardCounterIds,type DashboardCounterId,type DashboardCounter,type DashboardCounterItem} from '../lib/dashboardCounters';
const definitions:Record<DashboardCounterId,{label:string;description:string;emptyMessage:string}>={
 records:{label:'سجلات تشغيلية محفوظة',description:'عدد سجلات الشركات والإدارات المحفوظة، ومنها فرص الاستثمار. لا يشمل نسخ التعديل التي تنتظر موافقة النشر.',emptyMessage:'لم تُحفظ سجلات تشغيلية في الجهات بعد.'},
 reports:{label:'تقارير أداء واردة',description:'جميع تقارير الأداء المرسلة إلى المكتب، سواء بانتظار المراجعة أو تمت مراجعتها أو أُعيدت للاستكمال. المرفقات ليست تقارير إضافية.',emptyMessage:'لم تُرسل تقارير أداء إلى المكتب بعد.'},
 'reports-submitted':{label:'تقارير بانتظار المراجعة',description:'تقارير الأداء التي حالتها «وارد للمراجعة» فقط. لا تشمل مسودات مؤشرات الأداء أو التقارير التي تمت مراجعتها.',emptyMessage:'لا توجد تقارير أداء بانتظار المراجعة حاليًا.'},
 'reports-reviewed':{label:'تقارير تمت مراجعتها',description:'تقارير الأداء التي سُجلت مراجعتها. مراجعة التقرير لا تعني اعتماد مؤشرات مستخرجة منه تلقائيًا.',emptyMessage:'لم تُسجّل مراجعة أي تقرير أداء بعد.'},
 'pending-records':{label:'مشاركات بانتظار النشر',description:'طلبات نشر السجلات التشغيلية أو تعديلها التي تتطلب موافقة الإدارة، دون الطلبات المعادة للاستكمال. لا تشمل تقارير الأداء.',emptyMessage:'لا توجد مشاركات تشغيلية بانتظار موافقة النشر.'},
 'open-tasks':{label:'تكليفات مفتوحة',description:'التكليفات المسجلة التي حالتها مفتوحة أو جارٍ العمل. رفع تقرير لا ينشئ تكليفًا تلقائيًا.',emptyMessage:'لا توجد تكليفات مفتوحة أو جارٍ العمل في سجلات المنصة.'},
 'overdue-tasks':{label:'تكليفات متأخرة',description:'تكليفات غير مغلقة تجاوز تاريخ استحقاقها اليوم بحسب توقيت الرياض. لا يُعد التكليف المستحق اليوم متأخرًا.',emptyMessage:'لا توجد تكليفات مفتوحة تجاوزت تاريخ الاستحقاق.'},
 'approved-units':{label:'جهات بمؤشرات معتمدة',description:'عدد الجهات التي لديها نسخة مؤشرات أداء معتمدة. لا يُحتسب مجرد تسجيل فرصة أو رفع تقرير أو مراجعته اعتمادًا للمؤشرات.',emptyMessage:'لم تُعتمد نسخة مؤشرات أداء لأي جهة بعد، حتى إن كانت هناك سجلات أو تقارير مرفوعة.'},
 'pending-metrics':{label:'ملفات مؤشرات قيد الإجراء',description:'ملفات مؤشرات الأداء بحالة مسودة أو تمت مراجعتها وتنتظر الاعتماد. لا تشمل التقارير المرفوعة أو الملفات المعادة للاستكمال.',emptyMessage:'لا توجد مسودات مؤشرات بانتظار المراجعة أو الاعتماد. التقارير الواردة تظهر في عداد مستقل.'},
 objectives:{label:'أهداف خطة مسجلة',description:'الأهداف التي أُضيفت إلى سجل الخطة الاستراتيجية. لا ينشئ رفع تقرير أو فرصة استثمار هدفًا تلقائيًا.',emptyMessage:'لم تُضف أهداف إلى سجل الخطة الاستراتيجية بعد.'},
 decisions:{label:'مقترحات قرار في مؤشرات معتمدة',description:'المقترحات المدرجة في آخر نسخة مؤشرات معتمدة لكل جهة؛ ليست عدد القرارات المنفذة أو العبارات الواردة في ملفات التقارير.',emptyMessage:'لا توجد مقترحات قرار ضمن نسخ المؤشرات المعتمدة حتى الآن.'}
};
const riyadhToday=(now:Date)=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);return ['year','month','day'].map(t=>parts.find(p=>p.type===t)!.value).join('-');};
export function dashboardCounterItems(state:ExecutiveState,id:DashboardCounterId,now=new Date()):DashboardCounterItem[]{
 const reports=state.reports||[],units=Object.entries(state.units);
 const reportNames={submitted:'وارد للمراجعة',reviewed:'تمت المراجعة',returned:'معاد للاستكمال'};
 if(['reports','reports-submitted','reports-reviewed'].includes(id))return reports.filter(r=>id==='reports'||r.status===(id==='reports-submitted'?'submitted':'reviewed')).map(r=>({id:r.id,unitId:r.unitId,title:r.title,kind:'report',details:`${reportNames[r.status]} · الفترة: ${r.period} · ${r.attachments.length} مرفقات`}));
 if(id==='records')return Object.values(state.businessRecords||{}).flat().map(r=>({id:r.id,unitId:r.unitId,title:r.title,kind:'record',details:'سجل تشغيلي محفوظ في الجهة'}));
 if(id==='pending-records')return (state.platformSettings?.pendingRecords||[]).filter(p=>p.status!=='returned').map(p=>({id:p.record.id,unitId:p.record.unitId,title:p.record.title,kind:'record',details:'طلب نشر أو تعديل ينتظر موافقة الإدارة'}));
 if(id==='open-tasks'||id==='overdue-tasks'){const today=riyadhToday(now);return units.flatMap(([unitId,r])=>r.directives.filter(d=>d.status!=='closed'&&(id==='open-tasks'||(/^\d{4}-\d{2}-\d{2}$/.test(d.due)&&d.due<today))).map(d=>({id:d.id,unitId,title:d.title,kind:'task',details:`المسؤول: ${d.owner} · الاستحقاق: ${d.due}`})));}
 if(id==='approved-units')return units.filter(([,r])=>r.approved).map(([unitId,r])=>({id:unitId,unitId,title:r.approved!.snapshot.summary||'نسخة مؤشرات معتمدة',kind:'unit',details:`اعتمدها: ${r.approved!.reviewer||'مكتب الرئيس التنفيذي'} · ${r.approved!.snapshot.metrics.length} مؤشرات`}));
 if(id==='pending-metrics')return units.filter(([,r])=>r.pending&&r.pending.state!=='returned').map(([unitId,r])=>({id:r.pending!.id,unitId,title:r.pending!.snapshot.summary||'ملف مؤشرات أداء',kind:'unit',details:r.pending!.state==='reviewed'?'تمت المراجعة وبانتظار الاعتماد':'مسودة مؤشرات بانتظار المراجعة'}));
 if(id==='objectives')return state.objectives.map(o=>({id:o.id,title:o.title,kind:'objective',details:`المستهدف: ${o.target} · المسؤول: ${o.owner}`}));
 if(id==='decisions')return units.flatMap(([unitId,r])=>(r.approved?.snapshot.decisions||[]).map((title,i)=>({id:`${unitId}/${r.approved!.id}/${i}`,unitId,title,kind:'decision',details:'مقترح وارد في نسخة المؤشرات المعتمدة للجهة'})));
 return [];
}
export function dashboardCounters(state:ExecutiveState,now=new Date()):DashboardCounter[]{return dashboardCounterIds.map(id=>({id,...definitions[id],value:dashboardCounterItems(state,id,now).length}));}
