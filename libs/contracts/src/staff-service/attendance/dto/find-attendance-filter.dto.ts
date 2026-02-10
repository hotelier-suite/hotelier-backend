import { IsOptional, IsEnum, IsDate, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class FindAttendanceFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by employee ID',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  employeeId?: number;

  @ApiPropertyOptional({
    description: 'Filter by specific date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({
    description: 'Filter by start date for date range (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter by end date for date range (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter by attendance status',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}
