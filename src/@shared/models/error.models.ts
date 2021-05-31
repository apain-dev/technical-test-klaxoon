import { ApiProperty } from '@nestjs/swagger';
import Errors from '../enums/errors.enum';

export class BadRequestResponse {
  @ApiProperty({
    description: 'Code of the error',
    enum: Errors,
  })
  code: Errors;

  @ApiProperty({ description: 'Message of the error' })
  message: string;
}
