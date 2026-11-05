import type {Api,Match} from '../types'
const STOP=new Set(['api','apis','service','services','the','and','for','with','from','need','want','using','into','that','this','our','http','https','com','contoso','internal'])
const SYN:Record<string,string[]>={embedding:['vector','embed','semantic','similarity'],search:['query','lookup','find','retrieve'],summarize:['summary','document','condense'],model:['inference','prediction','llm','chat'],risk:['fraud','credit','score'],customer:['client','consumer','account']}
export const tokens=(s:string)=>s.toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>1&&!STOP.has(t)).map(t=>t.length>4&&t.endsWith('s')?t.slice(0,-1):t)
function expanded(t:string[]){const out=new Set(t);for(const word of t){for(const [key,vs] of Object.entries(SYN)){if(word===key||vs.includes(word)){out.add(key);vs.forEach(v=>out.add(v))}}}return [...out]}
const norm=(s:string)=>s.trim().toLowerCase().replace(/\/+$/,'')
export function matchApi(api:Api,query:string,semantic=false):Match|null {
 const q=query.trim();if(!q)return null
 if(q.startsWith('/')&&norm(q)===norm(api.suffix))return {api,score:100,why:'Exact gateway URL suffix'}
 let host='';let path='';try{const u=new URL(/^https?:\/\//.test(q)?q:`https://${q}`);if(q.includes('.')){host=u.host;path=u.pathname}}catch{}
 if(host){try{const b=new URL(api.backend);if(host===b.host){if(norm(path)===norm(b.pathname))return {api,score:100,why:'Exact backend endpoint'};if(path.startsWith(b.pathname+'/')||b.pathname.startsWith(path+'/'))return {api,score:80,why:'Same host and overlapping path'};return {api,score:50,why:'Same backend host'}}}catch{}}
 const qt=tokens(q),expandedQ=semantic?expanded(qt):qt;if(!qt.length)return null
 const names=tokens(api.name),details=tokens([api.desc,api.suffix,...api.ops.flat()].join(' '));
 const nh=expandedQ.filter(t=>names.some(x=>x===t||x.startsWith(t)||t.startsWith(x))).length
 const dh=expandedQ.filter(t=>details.some(x=>x===t||x.startsWith(t)||t.startsWith(x))).length
 const denominator=Math.max(qt.length,expandedQ.length);const score=Math.min(96,Math.round(nh/denominator*58+dh/denominator*42));
 return score>0?{api,score,why:semantic?'Related business concepts / operation keywords':'Name and description keyword overlap'}:null
}
export function discover(apis:Api[],query:string,semantic=false){return apis.map(a=>matchApi(a,query,semantic)).filter((x):x is Match=>Boolean(x)).sort((a,b)=>b.score-a.score)}
