import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CreateParkingIncidentDto } from './create-parking-incident.dto';
import { IncidentStatus } from '../enums';

export class UpdateParkingIncidentDto extends PartialType(
  CreateParkingIncidentDto,
) {
  @ApiProperty({
    description: 'Current status of the incident',
    required: false,
    enum: IncidentStatus,
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({
    description: 'Description of how the incident was resolved',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  resolution?: string;

  @ApiProperty({
    description: 'Timestamp when the incident was resolved',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  resolvedAt?: Date;
}
