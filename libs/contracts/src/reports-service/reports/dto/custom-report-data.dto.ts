import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CustomReportDataDto {
  @ApiProperty({
    description: 'Custom report title',
    example: 'Monthly Performance Summary',
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Custom report description',
    example: 'A comprehensive overview of hotel performance metrics',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({
    description: 'Custom report content in JSON string format',
    example: '{"metric1": 100, "metric2": 200}',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Report format type',
    example: 'json',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  format?: string;
}
