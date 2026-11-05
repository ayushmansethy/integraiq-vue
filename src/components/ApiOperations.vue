<script setup lang="ts">
import type {Operation,Method} from '../types'
const props=defineProps<{modelValue:Operation[];readonly?:boolean}>(),emit=defineEmits<{(e:'update:modelValue',value:Operation[]):void}>()
const methods:Method[]=['GET','POST','PUT','PATCH','DELETE']
function update(i:number,j:number,v:string){const next=props.modelValue.map(o=>[...o] as Operation);(next[i] as unknown as string[])[j]=v;emit('update:modelValue',next)}
function remove(i:number){emit('update:modelValue',props.modelValue.filter((_,n)=>n!==i))}
function add(){emit('update:modelValue',[...props.modelValue,['GET','/health','Service health']])}
</script>
<template><div class="stack"><div v-for="(op,i) in modelValue" :key="i" class="opline"><template v-if="!readonly"><select :value="op[0]" @change="update(i,0,($event.target as HTMLSelectElement).value)"><option v-for="m in methods" :key="m">{{m}}</option></select><input :value="op[1]" placeholder="/resource/{id}" @input="update(i,1,($event.target as HTMLInputElement).value)"/><input :value="op[2]" placeholder="Operation summary" @input="update(i,2,($event.target as HTMLInputElement).value)"/><input :value="op[3]||''" placeholder="Optional operationId" @input="update(i,3,($event.target as HTMLInputElement).value)"/><button class="btn ghost sm" @click="remove(i)">Remove</button></template><template v-else><span class="m" :class="op[0]">{{op[0]}}</span><code>{{op[1]}}</code><span>{{op[2]}}</span><code>{{op[3]}}</code></template></div><button v-if="!readonly" class="btn ghost sm" style="justify-self:start" @click="add">+ Add operation</button></div></template>
