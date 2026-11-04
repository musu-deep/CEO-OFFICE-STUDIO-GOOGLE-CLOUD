import type {ProjectPayload,ProjectReport} from './projectReports';
export type PublishedProject={payload:ProjectPayload;version:number;at:string;by:string;hash:string;attachments:ProjectAttachment[]};
export type ProjectAttachment={id:string;name:string;mimeType:string;size:number;at:string;author:string};
export function executiveProject(p:ProjectReport):ProjectReport|null{
 if(!p.published)return p.state==='reference'||p.state==='approved'?p:null;
 const pub=p.published;const {published,...base}=p;
 return {...base,...pub.payload,name:pub.payload.data.project.title,events:p.events.filter(e=>e.at<=pub.at),version:pub.version,state:'approved',contentHash:pub.hash,attachments:pub.attachments};
}
export const payloadOf=(p:ProjectReport):ProjectPayload=>({data:p.data,snapshot:p.snapshot,source:p.source});
