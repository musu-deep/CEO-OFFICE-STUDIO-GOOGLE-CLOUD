import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import { createApplication } from './src/server/app';
import { ExecutiveStore } from './src/server/executiveStore';
import { setDefaultStore } from './src/server/storeContext';
import { ManagerAccounts, type Account } from './src/server/managerAccounts';

async function startServer(){
 const store=new ExecutiveStore();setDefaultStore(store);
 const file=path.join(store.dir,'manager-accounts.json');
 let accounts:Record<string,Account>=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
 const managers=new ManagerAccounts({read:()=>structuredClone(accounts),write:next=>{const temp=`${file}.${crypto.randomUUID()}.tmp`;fs.writeFileSync(temp,JSON.stringify(next),{mode:0o600});fs.renameSync(temp,file);accounts=next;}});
 let authUsers:Record<string,any>={};
 try{authUsers=Object.fromEntries(Object.entries(JSON.parse(process.env.ARAAK_AUTH_USERS||'{}')).map(([email,a])=>[email.trim().toLowerCase(),a]));}catch{console.error('ARAAK_AUTH_USERS must be valid JSON.');}
 const app=createApplication({sessionSecret:process.env.SESSION_SECRET||'',authUsers,managers});
 if(process.env.NODE_ENV!=='production'){
  const vite=await createViteServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);
 }else{
  const distPath=path.join(process.cwd(),'dist');app.use(express.static(distPath));app.get('*',(_req,res)=>res.sendFile(path.join(distPath,'index.html')));
 }
 app.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('CEO Digital Office Server ready'));
}
startServer();
