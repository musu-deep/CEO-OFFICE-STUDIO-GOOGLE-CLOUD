import crypto from 'node:crypto';
import { MemoryExecutiveStore } from '../server/storeCore';
import type { ExecutiveState } from '../lib/executiveModel';
import type { Account } from '../server/managerAccounts';
import type { D1Database, D1PreparedStatement, R2Bucket } from '@cloudflare/workers-types';

type Row = {kind:string;id:string;value:string};
type Collection = 'unit'|'history'|'directive'|'document'|'objective'|'grant'|'audit'|'report'|'business'|'account'|'settings';
const recordKey=(kind:string,id:string)=>JSON.stringify([kind,id]);
const fail=(message:string,status:number)=>Object.assign(Error(message),{status});

// Split growing collections into individual rows, rather than a single JSON state blob.
export function encodeState(state:ExecutiveState,accounts:Record<string,Account>):Map<string,Row>{
 const rows=new Map<string,Row>();
 const put=(kind:Collection,id:string,value:unknown)=>{
  const json=JSON.stringify(value);
  if(Buffer.byteLength(json)>900_000)throw fail('تجاوز حجم السجل الحد المسموح. قسّم المحتوى إلى سجلات أصغر.',413);
  rows.set(recordKey(kind,id),{kind,id,value:json});
 };
 for(const [id,unit] of Object.entries(state.units)){
  put('unit',id,{...unit,history:[],directives:[],documents:[]});
  for(const [position,value] of unit.history.entries())put('history',`${id}/${value.id}`,{unitId:id,position,value});
  for(const [position,value] of unit.directives.entries())put('directive',`${id}/${value.id}`,{unitId:id,position,value});
  for(const [position,value] of unit.documents.entries())put('document',`${id}/${value.id}`,{unitId:id,position,value});
 }
 for(const [position,value] of state.objectives.entries())put('objective',value.id,{position,value});
 for(const [id,value] of Object.entries(state.grants))put('grant',id,value);
 for(const [position,value] of state.audit.entries())put('audit',value.id,{position:0,value});
 for(const [position,value] of (state.reports||[]).entries())put('report',value.id,{position:0,value});
 for(const [unitId,records] of Object.entries(state.businessRecords||{}))for(const [position,value] of records.entries())put('business',`${unitId}/${value.id}`,{unitId,position:0,value});
 if(state.platformSettings)put('settings','platform',state.platformSettings);
 for(const [id,value] of Object.entries(accounts))put('account',id,value);
 return rows;
}
export function decodeState(rows:Row[]){
 const state:ExecutiveState={units:{},objectives:[],grants:{},audit:[],reports:[],businessRecords:{}};
 const accounts:Record<string,Account>={};
 for(const row of rows){const value=JSON.parse(row.value);if(row.kind==='unit')state.units[row.id]=value;else if(row.kind==='grant')state.grants[row.id]=value;else if(row.kind==='account')accounts[row.id]=value;else if(row.kind==='settings')state.platformSettings=value;}
 const ordered=rows.filter(r=>!['unit','grant','account','settings'].includes(r.kind)).map(r=>({...r,parsed:JSON.parse(r.value)})).sort((a,b)=>a.parsed.position-b.parsed.position||String(b.parsed.value.at||b.parsed.value.createdAt||'').localeCompare(String(a.parsed.value.at||a.parsed.value.createdAt||'')));
 for(const {kind,parsed:{unitId,value}} of ordered){
  if(kind==='history'||kind==='directive'||kind==='document'){
   const unit=state.units[unitId];if(!unit)throw Error('Inconsistent unit record');
   const key=kind==='history'?'history':kind==='directive'?'directives':'documents';(unit[key] as unknown[]).push(value);
  }else if(kind==='objective')state.objectives.push(value);
  else if(kind==='audit')state.audit.push(value);
  else if(kind==='report')state.reports!.push(value);
  else if(kind==='business')(state.businessRecords![unitId]||=[]).push(value);
 }
 return {state,accounts};
}
export class CloudflareStore extends MemoryExecutiveStore {
 accounts:Record<string,Account>;
 private removed=new Set<string>();
 private staged=new Map<string,{name:string;mimeType:string;bytes:Buffer}>();
 private constructor(private db:D1Database,private bucket:R2Bucket,private revision:number,private original:Map<string,Row>,state:ExecutiveState,accounts:Record<string,Account>){super(state);this.accounts=accounts;}
 static async open(db:D1Database,bucket:R2Bucket){
  // D1 batch gives a consistent snapshot of revision + records.
  const result=await db.batch([db.prepare('SELECT version FROM app_revision WHERE id=1'),db.prepare('SELECT kind,id,value FROM app_records')]);
  const revision=(result[0].results[0] as {version:number}|undefined)?.version;
  if(revision===undefined)throw fail('قاعدة البيانات غير مهيأة.',503);
  const rows=result[1].results as Row[];
  const {state,accounts}=decodeState(rows);
  return new CloudflareStore(db,bucket,revision,new Map(rows.map(row=>[recordKey(row.kind,row.id),row])),state,accounts);
 }
 document(data:{name:string;mimeType:string;data:string}){
  const id=crypto.randomUUID();this.staged.set(id,{name:data.name,mimeType:data.mimeType,bytes:Buffer.from(data.data,'base64')});
  return {id,name:data.name,mimeType:data.mimeType};
 }
 removeDocument(id:string){this.removed.add(id);}
 discardDocument(id:string){this.staged.delete(id);}
 async bytes(id:string){
  if(!/^[a-f0-9-]{36}$/.test(id))throw fail('المستند غير موجود.',404);
  const object=await this.bucket.get(`documents/${id}`);
  if(!object)throw fail('المستند غير موجود.',404);
  return Buffer.from(await object.arrayBuffer());
 }
 async commit(){
  const next=encodeState(this.read(),this.accounts);
  const changes:D1PreparedStatement[]=[];
  for(const [key,row] of next)if(this.original.get(key)?.value!==row.value)changes.push(this.db.prepare('INSERT INTO app_records(kind,id,value) VALUES(?,?,?) ON CONFLICT(kind,id) DO UPDATE SET value=excluded.value').bind(row.kind,row.id,row.value));
  for(const [key,row] of this.original)if(!next.has(key))changes.push(this.db.prepare('DELETE FROM app_records WHERE kind=? AND id=?').bind(row.kind,row.id));
  if(!changes.length)return;
  const uploaded:string[]=[];
  try{
   for(const [id,file] of this.staged){await this.bucket.put(`documents/${id}`,file.bytes,{httpMetadata:{contentType:file.mimeType},customMetadata:{name:file.name}});uploaded.push(id);}
   // A NOT NULL violation aborts the ENTIRE D1 batch when another request wrote first.
   // Account approval + permissions + audit always commit together, never partially.
   const guard=this.db.prepare('UPDATE app_revision SET version=CASE WHEN version=? THEN version+1 ELSE NULL END WHERE id=1').bind(this.revision);
   await this.db.batch([guard,...changes]);
   // Delete bytes only after metadata removal commits; failed cleanup leaves an inaccessible orphan.
   await Promise.all([...this.removed].map(async id=>{try{await this.bucket.delete(`documents/${id}`);}catch{console.warn('Deferred document cleanup failed');}}));
  }catch(error){
   await Promise.allSettled(uploaded.map(id=>this.bucket.delete(`documents/${id}`)));
   if(String(error).includes('NOT NULL constraint failed: app_revision.version'))throw fail('تغيرت البيانات أثناء الحفظ. حدّث الصفحة وأعد المحاولة.',409);
   throw error;
  }
 }
}
