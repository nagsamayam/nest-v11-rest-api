import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FieldError } from '../../../common/errors/app.exception';
import z from 'zod';

export function toFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.map(String).join('.') || '$',
    message: issue.message,
    code: issue.code,
  }));
}

@Injectable()
export class ZodValidationPipe<S extends z.ZodType> implements PipeTransform<
  unknown,
  z.output<S>
> {
  constructor(private readonly schema: S) {}

  transform(value: unknown, metadata: ArgumentMetadata): z.output<S> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: toFieldErrors(result.error),
      });
    }

    return result.data;
  }
}
