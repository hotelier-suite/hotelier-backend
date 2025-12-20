import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { RequestType } from '../enums/request-type.enum';

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
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the request (YYYY-MM-DD)',
    example: '2024-01-20',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Number of days requested',
    example: 5,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  days: number;
}
