import {useEffect,useMemo,useRef,useState} from 'react';
const sections:Record<string,string>={tasks:'tasks',boq:'boq',quantities:'qty',finance:'ipc',schedule:'sched',supply:'supply',procurement:'proc',inventory:'store',labor:'labor',work:'site',audit:'audit'};
export const hasOriginalSection=(id:string)=>!!sections[id];
export default function OriginalProjectReport({projectId,version,section,onSection}:{projectId:string;version:number;section:string;onSection:(id:string)=>void}){
 const frame=useRef<HTMLIFrameElement>(null),latest=useRef(section),onNavigate=useRef(onSection);latest.current=section;onNavigate.current=onSection;
 const [height,setHeight]=useState(850),[loading,setLoading]=useState(true),[theme,setTheme]=useState(()=>typeof document!=='undefined'&&document.querySelector('[data-theme]')?.getAttribute('data-theme')==='spring'?'light':'dark');
 useEffect(()=>{const root=frame.current?.closest('[data-theme]');if(!root)return;const update=()=>setTheme(root.getAttribute('data-theme')==='spring'?'light':'dark');update();const observer=new MutationObserver(update);observer.observe(root,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect();},[]);
 const url=useMemo(()=>`/api/project-reports/${encodeURIComponent(projectId)}/original?section=${encodeURIComponent(section)}&theme=${theme}&version=${version}`,[projectId,version,theme]);
 const send=()=>frame.current?.contentWindow?.postMessage({type:'project-reference-section',view:sections[latest.current]},'*');
 useEffect(()=>{send();},[section]);
 useEffect(()=>{setLoading(true);setHeight(850);},[url]);
 useEffect(()=>{const listener=(event:MessageEvent)=>{if(event.source!==frame.current?.contentWindow||!event.data||typeof event.data!=='object')return;if(event.data.type==='project-reference-size'&&typeof event.data.height==='number'&&Number.isFinite(event.data.height))setHeight(Math.max(700,Math.min(24000,event.data.height)));if(event.data.type==='project-reference-view'){const id=Object.keys(sections).find(k=>sections[k]===event.data.view);if(id&&id!==latest.current)onNavigate.current(id);}};window.addEventListener('message',listener);return()=>window.removeEventListener('message',listener);},[]);
 return <section className="pr-original-report"><div className="pr-original-report-caption"><span>تفاصيل الملف الأصلي</span><small>عرض مطابق لجداول الملف وتفاصيلها · للاطلاع</small></div>{loading&&<p role="status" className="pr-muted">جارٍ تحميل تفاصيل التقرير…</p>}<iframe ref={frame} src={url} title="تفاصيل التقرير الأصلي للمشروع المحدد" sandbox="allow-scripts" referrerPolicy="no-referrer" style={{height}} onLoad={()=>{setLoading(false);send();}}/></section>;
}
