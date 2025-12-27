import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ShiftStatus, ShiftType } from '..';

export class CreateShiftDto {
  @ApiProperty({ type: String, format: 'date', example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: '08:00', format: 'time' })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({ example: '16:00', format: 'time' })
  @IsMilitaryTime()
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

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  employeeId: number;
}
