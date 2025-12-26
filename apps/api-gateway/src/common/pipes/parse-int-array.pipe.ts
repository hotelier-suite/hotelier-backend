import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseIntPipe,
} from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform<string, Promise<number[]>> {
  private readonly parseIntPipe = new ParseIntPipe({
    optional: false,
  });

  async transform(value: string, metadata: ArgumentMetadata): Promise<number[]> {
    if (!value || value.trim() === '') {
      return [];
    }

    const parts = value.split(',').map((part) => part.trim());
    const numbers: number[] = [];

    for (const part of parts) {
      const num = await this.parseIntPipe.transform(part, metadata);
      numbers.push(num);
    }

    return numbers;
  }
}
