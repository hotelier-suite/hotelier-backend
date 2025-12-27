import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date of the reporting period',
    type: String,
    example: '2024-01-01',
    format: 'date',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the reporting period',
    type: String,
    example: '2024-01-31',
    format: 'date',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
