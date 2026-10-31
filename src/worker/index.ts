import { httpServerHandler } from 'cloudflare:node';
import { env } from 'cloudflare:workers';
import crypto from 'node:crypto';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { createApplication } from '../server/app';
import { ManagerAccounts } from '../server/managerAccounts';
import { storageContext } from '../server/storeContext';
import { CloudflareStore } from './storage';

type Bindings={DB:D1Database;BUCKET:R2Bucket;ASSETS:{fetch(request:Request):Promise<Response>};SESSION_SECRET?:string;ARAAK_AUTH_USERS?:string;GEMINI_API_KEY?:string;GEMINI_MODEL?:string};
const bindings=env as unknown as Bindings;
let authUsers:Record<string,any>={};
try{
 authUsers=Object.fromEntries(Object.entries(JSON.parse(bindings.ARAAK_AUTH_USERS||'{}')).filter(([,a]:any)=>a&&typeof a.password==='string'&&['ceo','admin','head'].includes(a.role)).map(([email,a])=>[email.trim().toLowerCase(),a]));
}catch{console.error('Invalid bootstrap account configuration');}
const currentStore=()=>storageContext.getStore() as CloudflareStore;
const managers=new ManagerAccounts({read:()=>structuredClone(currentStore().accounts),write:accounts=>{currentStore().accounts=structuredClone(accounts);}});
const app=createApplication({sessionSecret:bindings.SESSION_SECRET||'',authUsers,managers,clientIp:req=>String(req.headers['cf-connecting-ip']||'unknown')});
app.use('/api',(_req,res)=>res.status(404).json({error:'الخدمة غير موجودة.'}));
app.use((error:any,_req:any,res:any,_next:any)=>{
 const status=error.status||500;
 res.status(status).json({error:status===413?'حجم الطلب يتجاوز الحد المسموح.':status===400?'طلب غير صالح.':'تعذر تنفيذ الطلب. أعد المحاولة.'});
});
app.listen(3000);
const server=httpServerHandler({port:3000});
const json=(status:number,error:string)=>Response.json({error},{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});

async function rateLimit(request:Request,path:string){
 if(request.method!=='POST'||!['/api/auth/login','/api/auth/register'].includes(path))return true;
 const now=Date.now(),duration=path.endsWith('/login')?15*60_000:60*60_000,limit=path.endsWith('/login')?10:60;
 // Shared across isolates/redeploys; do not log or retain raw client IP addresses.
 const ip=request.headers.get('CF-Connecting-IP')||'local';
 const key=crypto.createHash('sha256').update(`${bindings.SESSION_SECRET}:${path}:${ip}`).digest('hex');
 const result=await bindings.DB.batch([
  bindings.DB.prepare('DELETE FROM auth_rate_limits WHERE expires_at<?').bind(now),
  bindings.DB.prepare(`INSERT INTO auth_rate_limits(key,attempts,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires_at<? THEN 1 ELSE attempts+1 END,expires_at=CASE WHEN expires_at<? THEN excluded.expires_at ELSE expires_at END RETURNING attempts`).bind(key,now+duration,now,now)
 ]);
 return Number((result[1].results[0] as any)?.attempts)<=limit;
}

export default {
 async fetch(request:Request,_env:Bindings,ctx:unknown):Promise<Response>{
  const url=new URL(request.url),path=url.pathname.replace(/\/+$/,'').toLowerCase();
  if(!path.startsWith('/api/')&&!['/health','/ready'].includes(path))return bindings.ASSETS.fetch(request);
  if(path==='/health')return Response.json({status:'ok',service:'araak-ceo-office',runtime:'cloudflare-workers'});
  if(!['GET','HEAD','OPTIONS'].includes(request.method)){
   const origin=request.headers.get('Origin');
   if((origin&&origin!==url.origin)||request.headers.get('Sec-Fetch-Site')==='cross-site')return json(403,'مصدر الطلب غير مسموح.');
   if(Number(request.headers.get('Content-Length')||0)>29*1024*1024)return json(413,'حجم الطلب يتجاوز الحد المسموح.');
  }
  if(!bindings.DB||!bindings.BUCKET)return json(503,'إعداد التخزين الدائم غير مكتمل.');
  try{
   if(!await rateLimit(request,path))return json(429,'تجاوزت عدد المحاولات. حاول لاحقًا.');
   const store=await CloudflareStore.open(bindings.DB,bindings.BUCKET);
   return await storageContext.run(store,async()=>{
    const result=await server.fetch(request,_env,ctx);
    // Finish the route and make durable writes BEFORE returning a success response.
    const body=await result.arrayBuffer();
    if(result.status<400)await store.commit();
    const headers=new Headers(result.headers);headers.set('Cache-Control','no-store');
    return new Response(result.status===204?null:body,{status:result.status,statusText:result.statusText,headers});
   });
  }catch(error:any){
   console.error('Worker request failed',{path,status:error.status||503});
   return json(error.status||503,error.status?error.message:'تعذر الاتصال بالتخزين الدائم. أعد المحاولة.');
  }
 }
};
