import { ArgumentMetadata, Injectable, ParseArrayPipe, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseParamArrayPipe implements PipeTransform<string, Promise<string[]>> {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string[]> {
    return (await new ParseArrayPipe().transform(value, metadata)).map((v: string) => v.trim());
  }
}
