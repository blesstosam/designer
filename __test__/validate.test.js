import { expect, test } from '@jest/globals'
import Ajv from 'ajv'

test('test jsonschema validator', () => {
  const ajv = new Ajv()
  const schema = { type: 'number' }
  const instance = 1
  const validate = ajv.compile(schema)
  const valid = validate(instance)
  expect(valid).toBe(true)
})

test('test custom field', () => {
  const ajv = new Ajv({
    // strict: false
  })
  const schema = {
    type: 'object',
    // custom: 'custom',
    // required: ['id', 'id2'],
    properties: {
      id: {
        type: 'string'
      },
      id2: {
        type: 'string'
      }
    }
  }
  const instance = { id: '1'}
  const validate = ajv.compile(schema)
  const valid = validate(instance)
  expect(valid).toBe(true)
})
