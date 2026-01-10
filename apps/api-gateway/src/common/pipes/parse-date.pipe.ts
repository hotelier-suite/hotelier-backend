import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseDatePipe implements PipeTransform<string, Date | undefined> {
  constructor(
    private readonly options?: { format?: string; optional?: boolean },
  ) {}

  transform(value: string): Date | undefined {
    if (!value) {
      if (this.options?.optional) {
        return undefined;
      }
      throw new BadRequestException('Date value is required');
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date string');
    }

    return date;
  }

  static create(options?: { format?: string; optional?: boolean }) {
    return new ParseDatePipe(options);
  }
}
