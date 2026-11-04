export type ProjectPayload={data:Record<string,any>;snapshot:{at:string;by:string;s:Record<string,any>};source:{name:string;at:string;by:string;sha256?:string}};
export type ProjectReport=ProjectPayload&{id:string;unitId:string;name:string;version:number;state:'reference'|'draft'|'submitted'|'reviewed'|'approved'|'returned';contentHash:string;submittedBy?:string;reviewedBy?:string;events:{at:string;actor:string;action:string;note:string;hash:string}[]};
export const projectStates={reference:'نسخة مرجعية — غير معتمدة',draft:'مسودة',submitted:'بانتظار المراجعة',reviewed:'تمت المراجعة',approved:'معتمد في المنصة',returned:'معاد للتصحيح'};
export const dataSections=['project','activities','overallProgress','types','boq','ipcs','unitProgress','qtyTables','schedule3','catalog','quotes','sitePlan','targetGroups'] as const;
export const snapshotSections=['wos','contr','cqt','sup','tasks','nipc','links','grns','mirs','audit','pos','catp','prices'] as const;
export function projectInsights(report:ProjectPayload){
 const d=report.data,p=d.project||{},ipc=(d.ipcs||[]).at(-1),activities=d.activities||[];
 const sum=(rows:any[],key:string)=>rows.reduce((n,r)=>n+(typeof r[key]==='number'?r[key]:0),0);
 const weights=sum(activities,'w'),contribution=sum(activities,'overall');
 const warnings:string[]=[];
 if(activities.length&&Math.abs(weights-1)>.001)warnings.push(`مجموع أوزان الأنشطة ${(weights*100).toFixed(2)}%؛ يلزم تفسير الفرق عن 100%.`);
 if(typeof d.overallProgress==='number'&&activities.length&&Math.abs(contribution-d.overallProgress)>.001)warnings.push('الإنجاز الإجمالي لا يطابق مجموع مساهمات الأنشطة؛ راجع منهجية الأوزان.');
 if(p.revisedCompletion&&report.source.at&&p.revisedCompletion<report.source.at.slice(0,10)&&d.overallProgress<1)warnings.push('موعد الإنجاز المعدل أسبق من تاريخ النسخة والإنجاز أقل من 100%؛ يلزم جدول زمني محدث.');
 if(p.perfBondValid&&p.perfBondValid<report.source.at.slice(0,10))warnings.push('تاريخ صلاحية ضمان الأداء يسبق تاريخ النسخة؛ يلزم التحقق من التجديد.');
 if(ipc?.mainTotal&&typeof p.revisedValue==='number'&&Math.abs(ipc.mainTotal.price-p.revisedValue)>1)warnings.push('قيمة نطاق أعمال المستخلص تختلف عن قيمة العقد المعدلة؛ لا تستخدم الفرق كربح أو وفر دون تسوية النطاق والضريبة.');
 if(!d.overallProgress&&d.overallProgress!==0)warnings.push('لا توجد نسبة إنجاز موثقة لهذا المشروع.');
 return {weights,contribution,warnings,units:(d.unitProgress||[]).length,buildings:sum(d.types||[],'nb'),ipc,certified:ipc?.lines?.total?.[2],payable:ipc?.payable};
}
