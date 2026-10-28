import { type Entity,type UnitRecord,type Objective,type Action } from '../lib/executiveModel';
export type ExecutiveResponse={entities:Entity[];units:Record<string,UnitRecord>;objectives:Objective[];permissions:Record<string,Action[]>;manage:boolean;storage:{shared:boolean;persistentConfigured:boolean};providerConfigured:boolean};
export async function executiveRequest<T=any>(path:string,body?:unknown):Promise<T>{
 const r=await fetch(`/api/executive${path}`,{headers:{'Content-Type':'application/json'},...(body!==undefined?{method:'POST',body:JSON.stringify(body)}:{})});
 const data=await r.json();if(!r.ok)throw Error(data.error||'تعذر تحميل البيانات المشتركة.');return data;
}
