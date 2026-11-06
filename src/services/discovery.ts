import type {Api,Match} from '../types'
const STOP=new Set(['api','apis','service','services','the','and','for','with','from','need','want','using','into','that','this','our','http','https','com','contoso','internal'])
const SYN:Record<string,string[]>={embedding:['vector','embed','semantic','similarity','vectorize'],search:['query','lookup','find','retrieve'],summarize:['summary','document','condense','shorten'],document:['file','content','text','report'],model:['inference','prediction','llm','chat'],prompt:['template','instruction','completion'],risk:['fraud','credit','score'],customer:['client','consumer','account'],address:['location','shipping','postal']}
export const tokens=(s:string)=>s.toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>1&&!STOP.has(t)).map(t=>t.length>4&&t.endsWith('s')?t.slice(0,-1):t)
function expanded(t:string[]){const out=new Set(t);for(const word of t){for(const [key,vs] of Object.entries(SYN)){if(word===key||vs.includes(word)){out.add(key);vs.forEach(v=>out.add(v))}}}return [...out]}
export const aiTokens=(s:string)=>tokens(s.replace(/\b(retrieve|fetch|find|get)\b/gi,'read').replace(/\b(generate|create|build)\b/gi,'make'))
export interface AiMatch {api:Api;score:number;matched:string[];gaps:string[];why:string}
export function localAiScore(api:Api,query:string):AiMatch {
 const base=aiTokens(query), all=expanded(base), doc=aiTokens([api.name,api.desc,api.suffix,...api.ops.flat()].join(' '));
 if(!base.length)return {api,score:0,matched:[],gaps:[],why:'No requirement terms were identified'}
 const matched=all.filter(t=>doc.includes(t)), direct=base.filter(t=>doc.includes(t));
 const desc=aiTokens(api.desc+' '+api.ops.map(o=>o[2]).join(' ')), descHits=all.filter(t=>desc.includes(t)).length;
 let score=Math.round(Math.min(96,direct.length/base.length*72+matched.length/Math.max(1,all.length)*34)); score=Math.min(98,score+Math.min(12,descHits*2));
 const gaps=base.filter(t=>!doc.includes(t)&&!all.some(x=>doc.includes(x)&&SYN[x]?.includes(t))).slice(0,5);
 return {api,score,matched:[...new Set(matched)].slice(0,8),gaps,why:matched.length?`Related concepts found: ${[...new Set(matched)].slice(0,8).join(', ')}.`:'Some general relevance was found in the API description.'}
}
export function aiDiscover(apis:Api[],query:string){return apis.map(a=>localAiScore(a,query)).filter(m=>m.score>=12).sort((a,b)=>b.score-a.score).slice(0,5)}
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
