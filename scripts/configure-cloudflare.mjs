import fs from 'node:fs';
const id=process.env.CLOUDFLARE_D1_DATABASE_ID;
if(!id||!/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(id)||id==='00000000-0000-0000-0000-000000000000'){
 throw Error('Set CLOUDFLARE_D1_DATABASE_ID to the ID returned by wrangler d1 create.');
}
const filename=new URL('../wrangler.jsonc',import.meta.url),config=JSON.parse(fs.readFileSync(filename,'utf8'));
config.d1_databases[0].database_id=id;
fs.writeFileSync(filename,JSON.stringify(config,null,2)+'\n');
console.log('Cloudflare D1 binding configured.');
