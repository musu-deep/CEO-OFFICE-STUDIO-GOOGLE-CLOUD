declare module 'cloudflare:node' {
 export function httpServerHandler(options:{port:number}):{fetch(request:Request,env:unknown,ctx:unknown):Promise<Response>};
}
declare module 'cloudflare:workers' { export const env:unknown; }
