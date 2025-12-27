import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class PeriodDto {
  @ApiProperty({
    description: 'Start date of the statistics period',
    type: String,
    example: '2024-12-01',
    format: 'date',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the statistics period',
    type: String,
    example: '2024-12-31',
    format: 'date',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
