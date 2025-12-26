import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @ApiProperty({ type: String, example: '2024-01-01' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ type: String, example: '2024-01-31' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
