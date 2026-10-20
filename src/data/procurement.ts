export const phases = [
  { id:'p1', from:1, to:20, title:'التشخيص واعتماد التصميم', gate:'تقرير فجوات وقائمة أولويات؛ قرار اعتماد التصميم', tasks:['جرد الموردين والعقود والمخزون','فحص إعدادات Odoo','رسم الوضع الحالي وتوثيق الفجوات','تحديد أولويات التنفيذ وخط أساس الأداء'] },
  { id:'p2', from:21, to:45, title:'البيانات والسياسات', gate:'قاعدة موردين أولية ودليل إجراءات؛ قرار بدء التجربة', tasks:['تنظيف بيانات الموردين ومنع الازدواجية','تصميم طلب الاحتياج وطلب العروض وأمر الشراء','إعداد مصفوفة الصلاحيات والفصل بين الأدوار','اعتماد سياسات المنافسة والاستثناءات'] },
  { id:'p3', from:46, to:75, title:'التجربة والتصحيح', gate:'نتائج تشغيل واقعية؛ قرار التوسع', tasks:['تشغيل تجربة على التجارية ومشروع مختار','اختبار الاستلام والفحص والمطابقة الثلاثية','اختبار الاستحقاق والدفع وفق الجدول','تصحيح أخطاء التجربة وتوثيق نتائجها'] },
  { id:'p4', from:76, to:90, title:'التعميم المنضبط', gate:'مراجعة الامتثال والمخاطر', tasks:['تعميم الإجراءات بعد قرار التوسع','تدريب فرق المشتريات والمالية والمخازن','تشغيل لوحة المؤشرات','تقديم طلبات الاعتماد المؤهلة'] },
  { id:'p5', from:91, to:100, title:'الإقفال والتشغيل المستقر', gate:'اعتماد التشغيل المستقر وخطة التحسين', tasks:['تدقيق الملفات وإقفال الفجوات','إعداد تقرير أثر المائة يوم','إعداد خطة التحسين لمدة 12 شهراً','اعتماد التشغيل المستقر وتسليم المخرجات'] },
];
export const kpis = [
  {id:'suppliers',name:'توثيق الموردين النشطين ذوي الأولوية',target:100,period:'أسبوعي'},
  {id:'files',name:'اكتمال الملفات الأساسية',target:90,period:'أسبوعي'},
  {id:'orders',name:'أوامر الشراء عبر المسار المعتمد',target:95,period:'شهري'},
  {id:'quotes',name:'ثلاثة عروض أو استثناء معتمد',target:90,period:'شهري'},
  {id:'matching',name:'مطابقة المستندات قبل الدفع',target:100,period:'أسبوعي؛ تستثنى الدفعات المقدمة المعتمدة'},
  {id:'inventory',name:'تصنيف المخزون ذي الأولوية',target:100,period:'شهري'},
];
export const cycle = [
 ['طلب الاحتياج','الإدارة الطالبة / مديرها','الصنف، الكمية، المواصفة، الموقع، الموعد، مركز التكلفة؛ لا ينشئ التزاماً تعاقدياً.'],
 ['فحص البدائل','المخازن + المالية + الفني','المخزون والحجوزات والطلبات المفتوحة والميزانية.'],
 ['المنافسة','المشتريات','ثلاثة عروض مؤهلة قابلة للمقارنة أو استثناء موثق مستقل الاعتماد.'],
 ['الترسية','صاحب الصلاحية','التوصية الفنية والتجارية والتكلفة الكلية والاستثناءات.'],
 ['التعاقد وأمر الشراء','المشتريات + الاعتماد','عقد أو اتفاقية عند اللزوم؛ أمر شراء معتمد ينشئ الالتزام التعاقدي.'],
 ['الشحن والاستلام','المخازن + الفني','إشعار توريد ومحضر استلام وفحص كميات وجودة.'],
 ['الفاتورة والاستحقاق','المالية','مطابقة أمر الشراء والاستلام والفاتورة مع معالجة الدفعات المقدمة.'],
 ['طلب الصرف والدفع','المالية','طلب دفع مستقل وتحويل بنكي معتمد وفق جدول الاستحقاقات.'],
 ['الإغلاق والتقييم','المشتريات + المخازن + المالية','إقفال الفروقات وتحديث تقييم المورد.'],
];
export const risks = [
 ['مورد غير مؤهل أو حساب بنكي احتيالي','تأهيل مسبق وتحقق مستقل وفصل صلاحية تعديل الحساب.'],
 ['شراء خارج الميزانية أو تجزئة أوامر','مراجعة مراكز التكلفة وحدود الصلاحيات وتحليل الطلبات المجزأة.'],
 ['دفع دون استلام أو ازدواج فاتورة','مطابقة ثلاثية والتحقق من تكرار الفواتير ومعالجة الدفعات المقدمة.'],
 ['تأخر المواد وتعطل المشاريع','خطة توريد حرجة ومورد بديل وتنبيهات التسليم.'],
 ['تضخم المخزون وتجميد السيولة','تصنيف القيمة والاستهلاك والحركة وربط الطلبات بالتوقعات والذمم.'],
 ['تعارض الصلاحيات','فصل طالب الاحتياج والمشتري والمستلم ومعتمد الدفع.'],
];
export const decisions = ['اعتماد مالك البرنامج ومدير المشروع','تسمية ممثل لكل كيان','تحديد سقوف الصلاحيات وحدود الشراء المباشر','اعتماد نموذج الاستثناء','اختيار مشروع التجربة','تحديد مسؤول Odoo والمالية والمخازن عن التكامل'];
export const deliverables = ['دليل السياسات والإجراءات','سجل الموردين وتصنيفاتهم','نماذج الاحتياج والعروض وأوامر الشراء والمقارنة','مصفوفة التفويض والصلاحيات','سجل العقود','دليل الاستلام والتتبع','لوحة الذمم والمخزون','سجل الاعتمادات','لوحة مؤشرات الأداء','تقرير 100 يوم وخطة 12 شهراً'];
export const entities = ['اراك الوطنية – التجارية','اراك الوطنية – المشاريع','اراك الصناعية','اراك ستورز','كيان آخر معتمد'];
export const activityRules = [
 ['التجارية','الطلب المؤكد أو حد إعادة الطلب، هامش الربح، التحصيل، دوران الصنف.'],
 ['المشاريع','جدول كميات معتمد، الميزانية، برنامج التنفيذ، تسلسل التوريد وموقع المشروع.'],
 ['الصناعية','مواصفات الخام وخطة الإنتاج والهدر وتقلبات الأسعار والطلب المؤكد.'],
 ['اراك ستورز','التنبؤ بالطلب وحد إعادة الطلب والتصريف والمرتجعات وتوفر المنتجات.'],
];
export type Field = { id:string; label:string; type?:'date'|'number'|'textarea'; options?:string[]; required?:boolean };
export const registers: Record<string,{title:string; fields:Field[]}> = {
 suppliers:{title:'الموردون',fields:[{id:'name',label:'اسم المورد',required:true},{id:'number',label:'رقم المورد الموحد',required:true},{id:'entity',label:'الكيان المستفيد',options:entities},{id:'category',label:'المنتجات والخدمات والوكاالت'},{id:'status',label:'التصنيف',options:['تحت التأهيل','مشروط','معتمد','استراتيجي','موقوف']},{id:'legal',label:'المتطلبات القانونية',options:['بانتظار التحقق','مكتملة','نواقص']},{id:'bank',label:'التحقق المستقل من الحساب البنكي',options:['لم يتم','تم التحقق']},{id:'expiry',label:'انتهاء المستندات',type:'date'},{id:'credit',label:'شروط الائتمان'},{id:'review',label:'المراجعة القادمة',type:'date'},{id:'owner',label:'مسؤول المتابعة'},{id:'notes',label:'تقييم الأداء والمخاطر وتعارض المصالح',type:'textarea'}]},
 contracts:{title:'العقود',fields:[{id:'name',label:'عنوان العقد',required:true},{id:'number',label:'رقم العقد',required:true},{id:'supplier',label:'المورد'},{id:'entity',label:'الكيان',options:entities},{id:'value',label:'قيمة العقد بالريال',type:'number'},{id:'start',label:'تاريخ البداية',type:'date'},{id:'expiry',label:'تاريخ الانتهاء',type:'date'},{id:'status',label:'الحالة',options:['مسودة','قيد المراجعة','معتمد','ساري','مغلق','موقوف']},{id:'owner',label:'مسؤول العقد'},{id:'notes',label:'الالتزامات والضمانات ومراجع المستندات',type:'textarea'}]},
 accreditation:{title:'التأهيل والاعتمادات',fields:[{id:'name',label:'الجهة المستهدفة',required:true},{id:'type',label:'نوع الاعتماد'},{id:'entity',label:'الكيان القانوني المؤهل',options:entities},{id:'products',label:'المنتجات أو الخدمات'},{id:'status',label:'الحالة',options:['جهة ذات أولوية','تجهيز الملف','ملف جاهز داخلياً','تم التقديم','نواقص لدى الجهة','اعتماد مكتمل','مرفوض']},{id:'owner',label:'مسؤول المتابعة'},{id:'submitted',label:'تاريخ التقديم',type:'date'},{id:'expiry',label:'تاريخ التجديد',type:'date'},{id:'notes',label:'متطلبات الملف والفرص التجارية الناتجة',type:'textarea'}]},
 purchases:{title:'متابعة دورة الشراء',fields:[{id:'name',label:'الاحتياج أو الصنف',required:true},{id:'number',label:'رقم مرجع الطلب',required:true},{id:'entity',label:'الكيان',options:entities},{id:'cost',label:'مركز التكلفة'},{id:'quantity',label:'الكمية',type:'number'},{id:'due',label:'التسليم المطلوب',type:'date'},{id:'status',label:'مرحلة المتابعة',options:cycle.map(c=>c[0])},{id:'quotes',label:'المنافسة',options:['بانتظار العروض','ثلاثة عروض مؤهلة','استثناء موثق ومعتمد']},{id:'requester',label:'طالب الاحتياج'},{id:'buyer',label:'منفذ الشراء'},{id:'receiver',label:'المستلم'},{id:'approver',label:'معتمد الدفع'},{id:'owner',label:'مسؤول المتابعة'},{id:'notes',label:'المواصفات والموقع ومراجع الاعتماد',type:'textarea'}]},
};
export type Entry = { id:string; [key:string]:string };
export type TaskProgress = { status:string; owner:string; evidence:string };
export type ProcurementState = { version:1; start:string; owner:string; projectManager:string; tasks:Record<string,TaskProgress>; gates:Record<string,TaskProgress>; checks:Record<string,boolean>; metrics:Record<string,{total:string;done:string;date:string}>; cash:{dio:string;dso:string;dpo:string;date:string}; rows:Record<string,Entry[]>; riskNotes:Record<string,TaskProgress> };
export const emptyProcurement = (): ProcurementState => ({version:1,start:'',owner:'',projectManager:'',tasks:{},gates:{},checks:{},metrics:{},cash:{dio:'',dso:'',dpo:'',date:''},rows:{suppliers:[],contracts:[],accreditation:[],purchases:[]},riskNotes:{}});
export function percent(done:string,total:string):number|null { if(done.trim() === '' || total.trim() === '') return null; const d=Number(done), t=Number(total); return Number.isFinite(d)&&Number.isFinite(t)&&t>0&&d>=0&&d<=t ? Math.round(d/t*1000)/10 : null; }
export function cashCycle(dio:string,dso:string,dpo:string):number|null { const v=[dio,dso,dpo]; return v.every(x=>x.trim()!=='' && Number.isFinite(Number(x)) && Number(x)>=0) ? Number((Number(dio)+Number(dso)-Number(dpo)).toFixed(1)) : null; }
export function dayNumber(start:string,today = new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Riyadh'})):number|null {
  const dateValue=(value:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;const n=Date.parse(value+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===value?n:null;};
  const first=dateValue(start), current=dateValue(today);
  return first===null||current===null?null:Math.floor((current-first)/86400000)+1;
}
