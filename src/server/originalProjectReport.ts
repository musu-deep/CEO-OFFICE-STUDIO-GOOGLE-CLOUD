import template from './data/original-project-renderer.json';
import seed from './data/farasan-report.json';
import {snapshotSections,type ProjectPayload} from '../lib/projectReports';
export const originalSections:Record<string,string>={tasks:'tasks',boq:'boq',quantities:'qty',finance:'ipc',schedule:'sched',supply:'supply',procurement:'proc',inventory:'store',labor:'labor',work:'site',audit:'audit'};
export function originalReportAvailable(p:ProjectPayload){return p.source.sha256===seed.source.sha256&&p.data.project?.contractNo===seed.data.project.contractNo&&['types','boq','ipcs','activities','unitProgress','qtyTables','catalog','quotes'].every(k=>Array.isArray(p.data[k])&&p.data[k].length>0)&&!!p.data.schedule3&&Array.isArray(p.data.schedule3.rows);}
const literal=(v:unknown)=>JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
export function originalReportHTML(p:ProjectPayload,section:string,theme:'light'|'dark'){
 if(!originalReportAvailable(p)||!originalSections[section])throw Object.assign(Error('العرض الأصلي غير متاح لهذا المشروع أو القسم.'),{status:404});
 const snap={at:p.snapshot.at||p.source.at,by:p.snapshot.by||p.source.by,s:Object.fromEntries(snapshotSections.filter(k=>p.snapshot.s[k]!==undefined).map(k=>[k,p.snapshot.s[k]]))};
 let script=template.script.replace('__PROJECT_DATA__',()=>literal(p.data)).replace('__PROJECT_SNAPSHOT__',()=>literal(snap));
 script=script.replace("const h0=(location.hash||'').slice(1)",`const h0=${literal(originalSections[section])}`);
 const bridge=`
const allowedViews=${literal(Object.values(originalSections))};
const sendSize=()=>{const el=document.getElementById('view');parent.postMessage({type:'project-reference-size',height:Math.ceil(el.getBoundingClientRect().height)+36},'*')};
const originalGo=go;go=function(v){if(!allowedViews.includes(v))return;originalGo(v);parent.postMessage({type:'project-reference-view',view:v},'*');sendSize()};
addEventListener('message',event=>{if(event.source!==parent||event.data?.type!=='project-reference-section'||!allowedViews.includes(event.data.view))return;if(S.view!==event.data.view){S.view=event.data.view;render()}sendSize()});
new ResizeObserver(()=>requestAnimationFrame(sendSize)).observe(document.getElementById('view'));sendSize();
`;
 const css=`${template.css}
html,body{margin:0;min-height:0}body{background:var(--surface);color:var(--ink)}.app{display:block;min-height:0}.side,.top,.brandbar,#offBar{display:none!important}.content{padding:15px;min-height:0}.btn[disabled],button[onclick*="wipe("]{display:none!important}
:root[data-theme="light"]{--ink:#0b1014;--muted:#29333b;--line:#c4ced3;--bg:#f4f7f6;--surface:#fff;--surface-2:#f0f4f5;color-scheme:light}:root[data-theme="light"] td,:root[data-theme="light"] th,:root[data-theme="light"] input,:root[data-theme="light"] select{color:#10161b}:root[data-theme="light"] .src,:root[data-theme="light"] .muted{color:#29333b}
`;
 return `<!doctype html><html lang="ar" dir="rtl" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>تفاصيل التقرير الأصلي</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&amp;family=Noto+Kufi+Arabic:wght@600;700&amp;display=swap"><style>${css}</style></head><body>${template.body}<script>${script}\n${bridge}</script></body></html>`;
}
export const originalReportCSP="sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; img-src data:; font-src data: https://fonts.gstatic.com; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'self'";
