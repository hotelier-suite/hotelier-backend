import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import type { EmployeeDto } from '../../employees';
import { EmployeeRequestStatus, EmployeeRequestType } from '../enums';

export class EmployeeRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the employee request',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Type of employee request (vacation, sick leave, etc.)',
    enum: EmployeeRequestType,
    example: EmployeeRequestType.VACATION,
  })
  @IsEnum(EmployeeRequestType)
  type: EmployeeRequestType;

  @ApiProperty({
    description: 'Reason or justification for the request',
    example: 'Family vacation',
  })
  @IsString()
  @Length(1, 500)
  reason: string;

  @ApiProperty({
    description: 'Start date of the requested leave period',
    type: String,
    format: 'date',
    example: '2024-01-15',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the requested leave period',
    type: String,
    format: 'date',
    example: '2024-01-20',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Total number of days requested',
    example: 5,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  days: number;

  @ApiProperty({
    description: 'Current status of the request',
    enum: EmployeeRequestStatus,
    example: EmployeeRequestStatus.PENDING,
  })
  @IsEnum(EmployeeRequestStatus)
  status: EmployeeRequestStatus;

  @ApiProperty({
    description: 'Name of the manager who approved or rejected the request',
    required: false,
    example: 'Manager Smith',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  approvedBy?: string;

  @ApiProperty({
    description: 'Timestamp when the request was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the request was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the employee who submitted the request',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({
    description: 'Related employee details',
    required: false,
  })
  @IsOptional()
  employee?: EmployeeDto;
}
