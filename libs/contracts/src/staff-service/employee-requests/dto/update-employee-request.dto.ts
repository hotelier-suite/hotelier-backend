import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { RequestStatus } from '../enums/request-status.enum';

export class UpdateEmployeeRequestDto {
  @ApiProperty({
    description: 'Status of the request',
    enum: RequestStatus,
    example: RequestStatus.APPROVED,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

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
