import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import type { EmployeeDto } from '../../employees';
import { ShiftStatus, ShiftType } from '..';

export class ShiftDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ type: String, example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @Length(1, 10)
  startTime: string;

  @ApiProperty({ example: '16:00' })
  @IsString()
  @Length(1, 10)
  endTime: string;

  @ApiProperty({ enum: ShiftType, example: ShiftType.MORNING })
  @IsEnum(ShiftType)
  type: ShiftType;

  @ApiProperty({ enum: ShiftStatus, example: ShiftStatus.SCHEDULED })
  @IsEnum(ShiftStatus)
  status: ShiftStatus;

  @ApiProperty({ example: 'Front Desk Agent' })
  @IsString()
  @Length(1, 100)
  position: string;

  @ApiProperty({ example: 'Reception' })
  @IsString()
  @Length(1, 100)
  department: string;

  @ApiProperty({ required: false, example: 'Training new employee' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  employee?: EmployeeDto;
}
