import { AsyncLocalStorage } from 'node:async_hooks';
import type { MemoryExecutiveStore } from './storeCore';
export const storageContext = new AsyncLocalStorage<MemoryExecutiveStore>();
let defaultStore:MemoryExecutiveStore|undefined;
export function setDefaultStore(store:MemoryExecutiveStore){defaultStore=store;}
export const executiveStore = new Proxy({} as MemoryExecutiveStore, {
 get(_target,key){const store=storageContext.getStore()||defaultStore;if(!store)throw Error('Storage context unavailable');const value=Reflect.get(store,key);return typeof value==='function'?value.bind(store):value;}
});
