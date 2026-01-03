
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe<T> implements PipeTransform<string, T> {
  transform(value: string): T {
    return JSON.parse(value) as T;
  }
}
