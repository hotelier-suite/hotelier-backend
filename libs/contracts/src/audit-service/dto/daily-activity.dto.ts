import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, Min } from 'class-validator';

export class DailyActivityDto {
  @ApiProperty({
    description: 'Date',
    type: String,
    example: '2024-01-15T00:00:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Count of activities',
    example: 42,
  })
  @IsInt()
  @Min(0)
  count: number;
}
