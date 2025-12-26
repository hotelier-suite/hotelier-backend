import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from './date-range.dto';

export class ReportParametersDto {
  @ApiProperty({
    description: 'Type of report being generated',
    example: 'occupancy',
  })
  @IsString()
  reportType: string;

  @ApiProperty({
    description: 'Date range for the report',
    type: DateRangeDto,
  })
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange: DateRangeDto;

  @ApiProperty({
    description: 'Include detailed breakdown in the report',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeDetails?: boolean;

  @ApiProperty({
    description: 'Filter by specific department',
    example: 'HOUSEKEEPING',
    required: false,
  })
  @IsOptional()
  @IsString()
  departmentFilter?: string;

  @ApiProperty({
    description: 'Filter by customer segment',
    example: 'VIP',
    required: false,
  })
  @IsOptional()
  @IsString()
  segmentFilter?: string;
}
