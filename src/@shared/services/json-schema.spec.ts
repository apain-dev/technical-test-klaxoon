import { Schema, Validator } from 'jsonschema';
import JsonSchemaService from './json-schema.service';

describe('Json schema service', () => {
  let jsonSchemaService: JsonSchemaService;
  const schema: Schema = {
    id: '/testSchema',
    type: 'object',
    properties: {
      a: { type: 'string' },
      b: { type: 'number' },
    },
    required: ['b'],
  };
  beforeAll(() => {
    jsonSchemaService = new JsonSchemaService(new Validator());
  });
  it('should validate schema from data with required properties', () => {
    expect(jsonSchemaService.validate({ b: 5 }, schema).errors.length).toEqual(0);
  });
  it('should validate schema from data with required and optional properties', () => {
    expect(jsonSchemaService.validate({ b: 5, a: 'a' }, schema).errors.length).toEqual(0);
  });
  it('should not validate schema from data because of required properties and return error', () => {
    expect(jsonSchemaService.validate({ a: 'a' }, schema, false, false).errors.length).toEqual(1);
  });
  it('should not validate schema from data because of optional properties and throw error', () => {
    expect(
      () => jsonSchemaService.validate({ a: 5, b: 6 }, schema, false, true).errors.length,
    ).toThrow();
  });
});
