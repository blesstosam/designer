import { expect, test } from '@jest/globals';
import Ajv from "ajv"

test('test jsonschema validator', () => {
  const ajv = new Ajv()
  const schema = { type: 'number' };
  const instance = 1;
  const validate = ajv.compile(schema)
  const valid = validate(instance)
  expect(valid).toBe(true);
});

