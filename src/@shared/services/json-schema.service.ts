import {
  BadRequestException,
  Inject,
  Injectable
} from '@nestjs/common';
import {
  Schema,
  ValidationError,
  Validator,
  ValidatorResult
} from 'jsonschema';
import Errors from '../enums/errors.enum';

export type ParsedValidationResult = { errors: any } & Partial<ValidatorResult>;

@Injectable()
class JsonSchemaService {
  constructor(@Inject('JSON_SCHEMA_VALIDATOR') private validator: Validator) {
  }

  /**
   *
   * @param data data to be parsed
   * @param schema schema to use
   * @param parseError remove instance field (In case you want to hide it, move it to false)
   * @description Parse data and verify conformity from schema
   */
  validate(data: any, schema: Schema, parseError = true,
   throwIfError = true): ParsedValidationResult {
    const bodyValidation: ParsedValidationResult = this.validator.validate(data, schema);
    if (parseError) {
      bodyValidation.errors = this.parseErrors(bodyValidation);
    }
    if (throwIfError && bodyValidation?.errors?.length) {
      throw new BadRequestException({
        message: 'Validation failed',
        code: Errors.E_DATA_VALIDATION_FAILED,
        metadata: bodyValidation.errors,
      });
    }
    return bodyValidation;
  }

  private parseErrors(validatorResult: ParsedValidationResult): ParsedValidationResult[] {
    return validatorResult.errors.map((error: ValidationError) => {
      delete error.instance;
      return error;
    });
  }
}

export default JsonSchemaService;
