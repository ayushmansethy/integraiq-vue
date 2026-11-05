export type Method = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'
export type Operation = [Method,string,string,string?]
export type ApiStatus = 'active'|'beta'|'deprecated'
export type Auth = 'oauth'|'key'
export interface Api {id:string; name:string; version:string; backend:string; suffix:string; team:string; contact:string; vault:string; codeRepo:string; status:ApiStatus; auth:Auth; desc:string; ops:Operation[]; origin:string; consumers:number; successor?:string; specFile?:string; tdd?:Record<string,string>}
export interface Metrics {searches:number;reuse:number;created:number;createdDespite:number;opsAdded:number}
export interface PullRequest {id:number;title:string;apiId:string;kind:string;date:string;branch:string}
export interface Template {id:string;name:string;desc:string;content:string;builtIn:boolean;enabled:boolean}
export type Skin = 'fintech'|'aurora'|'midnight'|'horizon'|'sunset'
export type Mode = 'auto'|'light'|'dark'
export interface Settings {repo:string;branch:string;skin:Skin;mode:Mode;role:'admin'|'user';devDays:number}
export interface Match {api:Api;score:number;why:string}
