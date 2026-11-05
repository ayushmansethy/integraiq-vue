export const slug = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export const specPath = (name:string,version:string)=>`apis/${slug(name)}/${version}/openapi.yaml`
export function download(name:string, text:string,type='text/plain') { const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000) }
export const isHttpUrl=(s:string)=>{try {return ['http:','https:'].includes(new URL(s).protocol)}catch{return false}}
