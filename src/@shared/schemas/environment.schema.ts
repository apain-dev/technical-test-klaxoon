import { Schema } from 'jsonschema';

const envSchema: Schema = {
  id: '/Env',
  type: 'object',
  properties: {
    PORT: { type: 'string' },
    MONGO_DATABASE: { type: 'string' },
    URL: { type: 'string' },
  },
  required: ['PORT', 'MONGO_DATABASE', 'URL'],
};

export default envSchema;
