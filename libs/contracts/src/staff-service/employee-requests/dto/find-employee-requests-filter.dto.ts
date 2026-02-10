import { IsOptional, IsEnum, IsDate, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EmployeeRequestStatus } from '../enums/request-status.enum';
import { EmployeeRequestType } from '../enums/request-type.enum';

export class FindEmployeeRequestsFilterDto {
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
    description: 'Filter by request status',
    enum: EmployeeRequestStatus,
    example: EmployeeRequestStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(EmployeeRequestStatus)
  status?: EmployeeRequestStatus;

  @ApiPropertyOptional({
    description: 'Filter by request type',
    enum: EmployeeRequestType,
    example: EmployeeRequestType.VACATION,
  })
  @IsOptional()
  @IsEnum(EmployeeRequestType)
  type?: EmployeeRequestType;

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
}
