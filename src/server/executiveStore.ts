import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { MemoryExecutiveStore } from './storeCore';
import type { ExecutiveState } from '../lib/executiveModel';
export { validateGrant } from './storeCore';
export class ExecutiveStore extends MemoryExecutiveStore {
 readonly dir:string;
 readonly persistent:boolean;
 constructor(dir=process.env.EXECUTIVE_DATA_DIR || path.resolve('data/executive')) {
  fs.mkdirSync(dir,{recursive:true});
  const file=path.join(dir,'state.json');
  super(fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):undefined);
  this.dir=dir;
  this.persistent=process.env.NODE_ENV!=='production'||!!process.env.EXECUTIVE_DATA_DIR;
 }
 update(fn:(state:ExecutiveState)=>void){const next=this.read();fn(next);const temp=path.join(this.dir,`state-${crypto.randomUUID()}.tmp`);fs.writeFileSync(temp,JSON.stringify(next),{mode:0o600});fs.renameSync(temp,path.join(this.dir,'state.json'));this.state=next;return this.read();}
 document(data:{name:string;mimeType:string;data:string}){const id=crypto.randomUUID();fs.mkdirSync(path.join(this.dir,'documents'),{recursive:true});fs.writeFileSync(path.join(this.dir,'documents',id),Buffer.from(data.data,'base64'),{mode:0o600});return {id,name:data.name,mimeType:data.mimeType};}
 bytes(id:string){if(!/^[a-f0-9-]{36}$/.test(id))throw Error('invalid document');return fs.readFileSync(path.join(this.dir,'documents',id));}
 discardDocument(id:string){if(/^[a-f0-9-]{36}$/.test(id))fs.rmSync(path.join(this.dir,'documents',id),{force:true});}
}
