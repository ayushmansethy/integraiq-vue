<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {useRoute} from 'vue-router'
import {useCatalog} from '../stores/catalog'
import ApiOperations from '../components/ApiOperations.vue'
import {generateOpenApi,specFilename} from '../services/openapi'
import {tddMarkdown} from '../services/templates'
import {download,slug} from '../utils/common'
const s=useCatalog(),route=useRoute(),query=ref(''),selected=ref(String(route.query.id||s.apis[0]?.id||'')),templateId=ref('standard')
watch(()=>route.query.id,id=>{if(id)selected.value=String(id)})
const choices=computed(()=>s.apis.filter(a=>(a.name+' '+a.team+' '+a.desc).toLowerCase().includes(query.value.toLowerCase())))
const api=computed(()=>s.apis.find(a=>a.id===selected.value)||s.apis[0]);const template=computed(()=>s.templates.find(t=>t.id===templateId.value)||s.templates[0])
const yaml=computed(()=>api.value?generateOpenApi(api.value):'')
const tdd=computed(()=>api.value&&template.value?tddMarkdown(api.value,template.value):'')
async function copy(){try{await navigator.clipboard.writeText(yaml.value)}catch{window.alert('Clipboard unavailable — use Download YAML instead')}}
</script>
<template><h1>API Documentation</h1><p class="sub">Explore registered APIs, review operations and export reusable contracts or design documents.</p><div class="duo"><div class="card"><h2>Catalog</h2><input v-model="query" class="dsearch" placeholder="Filter APIs by name or owning team"/><div id="picks" class="stack"><button v-for="a in choices" :key="a.id" class="card pick" :class="{on:selected===a.id}" @click="selected=a.id"><b>{{a.name}}</b> <span class="ver">{{a.version}}</span><div class="small mu">{{a.team}} · {{a.ops.length}} operations</div></button><div v-if="!choices.length" class="empty">No APIs found</div></div></div><div v-if="api"><div class="card"><div class="toolbar"><h2 style="margin:0">{{api.name}}</h2><span class="tag" :class="'st-'+api.status">{{api.status}}</span></div><p>{{api.desc}}</p><table><tbody><tr><th>Version</th><td>{{api.version}}</td></tr><tr><th>Backend</th><td><code>{{api.backend}}</code></td></tr><tr><th>Gateway suffix</th><td><code>{{api.suffix}}</code></td></tr><tr><th>Team</th><td>{{api.team}}</td></tr><tr><th>Authentication</th><td>{{api.auth==='oauth'?'OAuth 2.0 bearer':'Subscription key'}}</td></tr><tr><th>Spec path</th><td><code>{{api.specFile||'Not committed'}}</code></td></tr></tbody></table><h3 style="margin-top:18px">Operations</h3><ApiOperations :model-value="api.ops" readonly/><div class="actions"><button class="btn" @click="download(specFilename(api),yaml,'application/yaml')">Download OpenAPI</button><button class="btn ghost sm" @click="copy">Copy YAML</button></div></div><div class="card live"><h2>OpenAPI YAML</h2><pre>{{yaml}}</pre></div><div class="card"><h2>Technical Design Document</h2><label>Template</label><select v-model="templateId"><option v-for="t in s.templates.filter(t=>t.enabled)" :key="t.id" :value="t.id">{{t.name}}</option></select><pre>{{tdd}}</pre><div class="actions"><button class="btn" @click="download(`TDD-${slug(api.name)}.md`,tdd,'text/markdown')">Download TDD (.md)</button></div><p class="small mu">[TBD] indicates details that must be completed and approved before production use.</p></div></div></div></template>
