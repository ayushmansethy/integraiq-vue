import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import {seedApis} from '../data/seed'
import type {Api,Metrics,PullRequest,Settings,Template} from '../types'
const KEY='integraiq-vue-v1'
const defaults=()=>({apis:seedApis(),metrics:{searches:0,reuse:0,created:0,createdDespite:0,opsAdded:0} as Metrics,prs:[] as PullRequest[],settings:{repo:'https://github.com/contoso-ai/api-specs',branch:'main',skin:'fintech',mode:'auto',role:'user',devDays:5} as Settings,templates:[{id:'standard',name:'Standard API TDD',desc:'Architecture, operations, security and deployment',builtIn:true,enabled:true,content:'# {{api.name}} — {{api.version}}\n\n## Overview\n{{api.description}}\n\n## Integration architecture\nConsumer → Azure API Management → {{api.backend}}\n\n## Operations\n{{api.operations}}\n\n## Security\n{{api.auth}}\n\n## Deployment and monitoring\n[TBD: environments, policies, SLAs, alerts]\n\n## Approvals\n[TBD: reviewers]'}, {id:'quick',name:'API Quick Reference',desc:'Consumer handover overview',builtIn:true,enabled:true,content:'# {{api.name}}\n\n{{api.description}}\n\nGateway: {{api.suffix}}\n\n## Operations\n{{api.operations}}\n\nAuth: {{api.auth}}'}] as Template[]})
function load(){const base=defaults();try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&Array.isArray(s.apis)&&s.settings&&s.metrics)return {...base,...s}}catch{}return base}
export const useCatalog=defineStore('catalog',()=>{
 const initial=load(),apis=ref<Api[]>(initial.apis),metrics=ref<Metrics>(initial.metrics),prs=ref<PullRequest[]>(initial.prs),settings=ref<Settings>(initial.settings),templates=ref<Template[]>(initial.templates)
 watch([apis,metrics,prs,settings,templates],()=>localStorage.setItem(KEY,JSON.stringify({apis:apis.value,metrics:metrics.value,prs:prs.value,settings:settings.value,templates:templates.value})),{deep:true})
 const operationCount=computed(()=>apis.value.reduce((n,a)=>n+a.ops.length,0))
 function addApi(api:Api){apis.value.push(api);metrics.value.created++;return createPR(api,'create')}
 function updateApi(api:Api){const i=apis.value.findIndex(a=>a.id===api.id);if(i>=0)apis.value[i]=structuredClone(api);return createPR(api,'update')}
 function createPR(api:Api,kind:string){const id=101+prs.value.length,sha=crypto.randomUUID().replace(/-/g,'').slice(0,8),file=api.specFile||`apis/${api.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}/${api.version}/openapi.yaml`,pr={id,title:`${kind==='update'?'Update':'Add'} ${api.name} ${api.version}`,apiId:api.id,kind,date:new Date().toISOString(),branch:`${kind}/${api.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${api.version}`,file,sha,reviewers:`${api.team} + API governance`};prs.value.unshift(pr);return pr}
 function recordReuse(){metrics.value.reuse++}
 function reset(){const d=defaults();apis.value=d.apis;metrics.value=d.metrics;prs.value=d.prs;settings.value=d.settings;templates.value=d.templates}
 return {apis,metrics,prs,settings,templates,operationCount,addApi,updateApi,createPR,recordReuse,reset}
})
