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
import type { EmployeeDto } from '../../employees/dto/employee.dto';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';

export class EmployeeRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ enum: RequestType, example: RequestType.VACATION })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({ example: 'Family vacation' })
  @IsString()
  @Length(1, 500)
  reason: string;

  @ApiProperty({ type: String, example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ type: String, example: '2024-01-20' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: 5, minimum: 1 })
  @IsNumber()
  @Min(1)
  days: number;

  @ApiProperty({ enum: RequestStatus, example: RequestStatus.PENDING })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty({ required: false, example: 'Manager Smith' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  approvedBy?: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  employee?: EmployeeDto;
}
