import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { EmployeeRequestStatus } from '..';

export class UpdateEmployeeRequestDto {
  @ApiProperty({
    description: 'Status of the request',
    enum: EmployeeRequestStatus,
    example: EmployeeRequestStatus.APPROVED,
    required: false,
  })
  @IsOptional()
  @IsEnum(EmployeeRequestStatus)
  status?: EmployeeRequestStatus;

  @ApiProperty({
    description: 'Name of person who approved/rejected the request',
    example: 'Manager Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  approvedBy?: string;
}
