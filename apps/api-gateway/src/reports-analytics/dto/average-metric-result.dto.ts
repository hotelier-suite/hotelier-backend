import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AverageMetricResultDto {
  @ApiProperty({
    description: 'Average value as string',
    example: '78.5',
  })
  @IsString()
  average: string;
}
