<script setup lang="ts">
import {computed,watch,ref} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useCatalog} from './stores/catalog'
import type {Mode,Skin} from './types'
const store=useCatalog(),route=useRoute(),router=useRouter(),mobile=ref(false),tourStep=ref<number|null>(null),tourOriginalRole=ref<'admin'|'user'|null>(null)
const tourSteps=[
 {text:'Reuse-first in about a minute. This tour drives the real screens with sample data.',path:'/'},
 {text:'A team checks the catalog before building a new inference integration.',path:'/discovery'},
 {text:'Exact matches can be reused or extended with missing operations.',path:'/discovery'},
 {text:'Changes are recorded as simulated pull requests for the owning team.',path:'/architecture'},
 {text:'Advanced filters support operation IDs, backends, named values and ownership.',path:'/discovery'},
 {text:'Documentation shows ownership, lifecycle, authentication and OpenAPI output.',path:'/docs'},
 {text:'Admins manage reusable TDD templates and placeholders.',path:'/templates'},
 {text:'Architecture maps the demo workflow to production systems and governance.',path:'/architecture'},
 {text:'Metrics update as teams reuse instead of rebuilding. That is the tour.',path:'/'}
]
const links=[{path:'/',title:'Home',icon:'⌂'},{path:'/discovery',title:'API Discovery',icon:'⌕'},{path:'/create',title:'API Creation',icon:'+'},{path:'/docs',title:'API Documentation',icon:'▤'},{path:'/architecture',title:'Architecture',icon:'◇'},{path:'/templates',title:'TDD Templates',icon:'⚙'}]
const currentLinks=computed(()=>links.filter(l=>l.path!=='/templates'||store.settings.role==='admin'))
const skins:Skin[]=['fintech','aurora','midnight','horizon','sunset']
function applyTheme(){const r=document.documentElement;r.dataset.skin=store.settings.skin;r.dataset.theme=store.settings.mode==='auto'?'':store.settings.mode}
watch(()=>[store.settings.skin,store.settings.mode],applyTheme,{immediate:true})
function cycleMode(){const modes:Mode[]=['auto','light','dark'];store.settings.mode=modes[(modes.indexOf(store.settings.mode)+1)%modes.length]}
function reset(){if(window.confirm('Reset the local demo catalog, settings and metrics?')){store.reset();router.push('/')}}
function startTour(){tourOriginalRole.value=store.settings.role;tourStep.value=0;router.push(tourSteps[0].path)}
function nextTour(){if(tourStep.value===null)return;if(tourStep.value>=tourSteps.length-1){tourStep.value=null;if(tourOriginalRole.value)store.settings.role=tourOriginalRole.value;tourOriginalRole.value=null;return}tourStep.value++;if(tourStep.value===6)store.settings.role='admin';if(tourStep.value===7&&tourOriginalRole.value)store.settings.role=tourOriginalRole.value;router.push(tourSteps[tourStep.value].path)}
</script>
<template>
<div class="shell"><aside :class="{open:mobile}" id="side"><div class="side-in">
 <div class="logo"><i>⚡</i><span>Integration API<br>Accelerator</span></div>
 <div class="role"><label>Role</label><select v-model="store.settings.role"><option value="user">Developer</option><option value="admin">Admin (demo)</option></select></div>
 <div class="skin"><span class="sk-l">Design</span><div class="sk-sw"><button v-for="(skin,i) in skins" :key="skin" class="sw" :class="{on:store.settings.skin===skin}" :title="skin" :aria-label="skin+' design'" :style="{'--a':['#0b8a5f','#7c3aed','#22d3ee','#2563eb','#e8590c'][i],'--b':['#14b88a','#0891b2','#a855f7','#0ea5e9','#db2777'][i]}" @click="store.settings.skin=skin"/></div><button class="mode" title="Cycle color mode" @click="cycleMode">{{store.settings.mode==='dark'?'☾':store.settings.mode==='light'?'☀':'◐'}}</button></div>
 <nav aria-label="Main navigation"><RouterLink v-for="l in currentLinks" :key="l.path" :to="l.path" custom v-slot="{navigate,isActive}"><button class="nav-link" :class="{on:isActive}" @click="navigate();mobile=false"><span class="ic">{{l.icon}}</span>{{l.title}}</button></RouterLink></nav>
 <button class="more-btn" @click="mobile=!mobile">☷ Repo & tools</button>
 <div class="side-panel"><div class="side-git"><div class="g-t">Specification repository <span class="g-ok">DEMO</span></div><label class="sr" for="repo">Repo URL</label><input id="repo" v-model="store.settings.repo" placeholder="HTTPS Git URL"/><label class="sr" for="branch">Git branch</label><input id="branch" v-model="store.settings.branch" placeholder="Branch"/><div class="g-e">{{store.prs.length}} simulated pull request(s)</div><div v-for="pr in store.prs.slice(0,3)" :key="pr.id" class="g-f">PR #{{pr.id}} · {{pr.kind}}</div></div><div class="side-foot"><b>Reuse first</b>Check for an existing API before building a new one.<div class="sf-btns"><button class="sf-b" @click="router.push('/discovery')">⌕ Explore APIs</button><button class="sf-b" @click="startTour">▶ Guided demo</button><button class="sf-b" @click="reset">↺ Reset demo data</button></div></div></div>
 </div></aside><main><div class="banner"><strong>Demo mode.</strong> APIs are sample data, AI matching uses local heuristics, and Git commits / PRs are simulated. <RouterLink to="/architecture" class="lnk">See production architecture →</RouterLink></div><RouterView :key="route.path"/></main><div v-if="tourStep!==null" class="tour" role="dialog" aria-label="Guided demo" aria-live="polite"><div class="t-n">Guided demo · {{tourStep+1}} / {{tourSteps.length}}</div><p>{{tourSteps[tourStep].text}}</p><div class="t-b"><button class="btn ghost sm" @click="tourStep=null">Exit</button><button class="btn sm" @click="nextTour">{{tourStep===tourSteps.length-1?'Finish':'Next →'}}</button></div></div></div>
</template>
