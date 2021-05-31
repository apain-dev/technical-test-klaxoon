import { Module } from '@nestjs/common';
import jsonSchemaProviders from '../providers/json-schema.provider';
import JsonSchemaService from '../services/json-schema.service';

@Module({
  providers: [...jsonSchemaProviders, JsonSchemaService],
  exports: [JsonSchemaService],
})
class JsonSchemaModule {
}

export default JsonSchemaModule;
