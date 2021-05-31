import { Provider } from '@nestjs/common';
import { Validator } from 'jsonschema';

const jsonSchemaProviders: Provider[] = [
  {
    provide: 'JSON_SCHEMA_VALIDATOR',
    useFactory: () => new Validator(),
  },
];

export default jsonSchemaProviders;
