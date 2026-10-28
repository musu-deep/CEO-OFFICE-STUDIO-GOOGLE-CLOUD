import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { type ExecutiveState, type Action, type Grant, emptyRecord, hasPermission, resolveEntity, dimensions } from '../lib/executiveModel';
import { parseSnapshot } from '../lib/unitWorkspace';
export class ExecutiveStore {
 readonly dir:string;
 private state:ExecutiveState;
 constructor(dir=process.env.EXECUTIVE_DATA_DIR || path.resolve('data/executive')){
  this.dir=dir;fs.mkdirSync(dir,{recursive:true});
  const file=path.join(dir,'state.json');
  this.state=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{units:{},objectives:[],grants:{},audit:[]};
 }
 read(){return structuredClone(this.state);}
 update(fn:(state:ExecutiveState)=>void){const next=this.read();fn(next);const temp=path.join(this.dir,`state-${crypto.randomUUID()}.tmp`);fs.writeFileSync(temp,JSON.stringify(next),{mode:0o600});fs.renameSync(temp,path.join(this.dir,'state.json'));this.state=next;return this.read();}
 can(actor:{email:string;role:string},unitId:string,action:Action){return !!resolveEntity(unitId)&&hasPermission(actor.email,actor.role,this.state.grants,unitId,action);}
 audit(s:ExecutiveState,actor:string,action:string,unitId?:string){s.audit.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),actor,action,unitId});s.audit=s.audit.slice(0,5000);}
 saveDraft(actor:{email:string;role:string},unitId:string,input:any,expected:number,source:string){
  if(!this.can(actor,unitId,'edit')&&!this.can(actor,unitId,'upload'))throw Object.assign(new Error('لا تملك صلاحية رفع بيانات لهذه الجهة.'),{status:403});
  if(!input || !Array.isArray(input.metrics) || input.metrics.length>10 || input.metrics.some((m:any)=>!m || typeof m.label!=='string' || typeof m.value!=='number' || !Number.isFinite(m.value)))throw Object.assign(Error('المؤشرات غير صالحة.'),{status:400});
  const snapshot=parseSnapshot(input,source) as any;
  snapshot.metrics=snapshot.metrics.map((m:any,i:number)=>{const raw=input.metrics[i]||{};return {...m,dimension:dimensions.some(d=>d[0]===raw.dimension)?raw.dimension:undefined,definition:typeof raw.definition==='string'?raw.definition.slice(0,300):undefined,objectiveId:this.state.objectives.some(o=>o.id===raw.objectiveId)?raw.objectiveId:undefined};});
  this.update(s=>{const r=s.units[unitId]||emptyRecord();if(r.version!==expected)throw Object.assign(new Error('تغيرت بيانات الجهة. حدّث الصفحة قبل الحفظ.'),{status:409});if(r.pending)r.history.unshift(r.pending);r.history=r.history.slice(0,100);r.pending={id:crypto.randomUUID(),snapshot,state:'draft',createdAt:new Date().toISOString(),author:actor.email};r.version++;s.units[unitId]=r;this.audit(s,actor.email,'رفع مسودة',unitId);});
 }
 document(data:{name:string;mimeType:string;data:string}){const id=crypto.randomUUID();fs.mkdirSync(path.join(this.dir,'documents'),{recursive:true});fs.writeFileSync(path.join(this.dir,'documents',id),Buffer.from(data.data,'base64'),{mode:0o600});return {id,name:data.name,mimeType:data.mimeType};}
 bytes(id:string){if(!/^[a-f0-9-]{36}$/.test(id))throw Error('invalid document');return fs.readFileSync(path.join(this.dir,'documents',id));}
}
export function validateGrant(input:any):Grant {const allowed=['read','upload','edit','review','approve','direct'];if(!input||!Array.isArray(input.units)||!Array.isArray(input.actions)||input.units.some((v:any)=>typeof v!=='string'||!resolveEntity(v))||input.actions.some((v:any)=>!allowed.includes(v)))throw Object.assign(new Error('صلاحيات غير صالحة.'),{status:400});return {units:[...new Set(input.units)] as string[],actions:[...new Set(input.actions)] as Action[]};}
