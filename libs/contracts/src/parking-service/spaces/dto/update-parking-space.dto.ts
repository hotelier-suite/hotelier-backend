import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CreateParkingSpaceDto } from './create-parking-space.dto';
import { SpaceStatus } from '../enums/space-status.enum';

export class UpdateParkingSpaceDto extends PartialType(CreateParkingSpaceDto) {
  @ApiProperty({ required: false, enum: SpaceStatus })
  @IsOptional()
  @IsEnum(SpaceStatus)
  status?: SpaceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  currentVehicle?: string;
}
