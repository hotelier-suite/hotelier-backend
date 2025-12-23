import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class ReportParametersDto {
  @ApiProperty({
    description: 'Type of report being generated',
    example: 'occupancy',
  })
  @IsString()
  reportType: string;

  @ApiProperty({
    description: 'Date range for the report',
    example: { startDate: '2024-01-01', endDate: '2024-01-31' },
  })
  @IsObject()
  dateRange: {
    startDate: Date;
    endDate: Date;
  };

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
