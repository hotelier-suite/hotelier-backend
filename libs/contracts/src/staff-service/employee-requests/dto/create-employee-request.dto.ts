import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { RequestType } from '..';

export class CreateEmployeeRequestDto {
  @ApiProperty({
    description: 'Employee ID making the request',
    example: 1,
  })
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({
    description: 'Type of request',
    enum: RequestType,
    example: RequestType.VACATION,
  })
  @IsEnum(RequestType)
  type: RequestType;

  @ApiProperty({
    description: 'Reason for the request',
    example: 'Family vacation',
  })
  @IsString()
  @Length(1, 500)
  reason: string;

  @ApiProperty({
    description: 'Start date of the request (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the request (YYYY-MM-DD)',
    example: '2024-01-20',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Number of days requested',
    example: 5,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  days: number;
}
