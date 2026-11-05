import {describe,it,expect} from 'vitest'
import {seedApis} from '../data/seed'
import {discover} from './discovery'
import {generateOpenApi,validateOperations} from './openapi'
describe('catalog discovery',()=>{
 it('recognizes an exact backend URL',()=>{const r=discover(seedApis(),'https://ml.internal.contoso.com/inference');expect(r[0]?.api.name).toBe('Model Inference API');expect(r[0]?.score).toBe(100)})
 it('finds embeddings by business term',()=>{const r=discover(seedApis(),'generate vector embeddings',true);expect(r.some(x=>x.api.name==='Embeddings API')).toBe(true)})
 it('generates a valid-looking OpenAPI contract',()=>{const spec=generateOpenApi(seedApis()[0]);expect(spec).toContain('openapi: 3.0.3');expect(spec).toContain('bearerAuth:');expect(spec).toContain('operationId:')})
 it('rejects duplicate operations',()=>{expect(validateOperations([['GET','/x','one'],['GET','/x','two']]).some(e=>e.includes('Duplicate'))).toBe(true)})
})
