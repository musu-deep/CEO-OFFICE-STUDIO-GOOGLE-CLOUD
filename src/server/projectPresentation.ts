import seed from './data/farasan-report.json';
import layout from './data/farasan-site-plan.json';
import type {ProjectPayload} from '../lib/projectReports';
// Drawing coordinates and target membership were transcribed from the attached reference.
// They are an attributed presentation overlay, independent of the report's approval/hash.
export function projectPresentation(p:ProjectPayload){
 const reference=p.source.sha256===seed.source.sha256&&p.data.project?.contractNo===seed.data.project.contractNo;
 return {sitePlan:p.data.sitePlan||(reference?layout.sitePlan:null),targetGroups:p.data.targetGroups||(reference?layout.targetGroups:[]),origin:reference?'مخطط وتصنيف مستهدفات من الملف المرجعي المرفق':'مخطط وتصنيف مستهدفات من بيانات المشروع'};
}
