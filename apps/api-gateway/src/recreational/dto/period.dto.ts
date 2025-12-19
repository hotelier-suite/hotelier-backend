import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PeriodDto {
  @ApiProperty({
    description: 'Start date of the statistics period',
    example: '2024-12-01',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the statistics period',
    example: '2024-12-31',
  })
  @IsString()
  endDate: string;
}
