import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TotalMetricResultDto {
  @ApiProperty({
    description: 'Total value as string',
    example: '1250.75',
  })
  @IsString()
  total: string;
}
