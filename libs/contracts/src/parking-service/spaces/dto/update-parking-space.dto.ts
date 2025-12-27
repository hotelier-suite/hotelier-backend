import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CreateParkingSpaceDto } from './create-parking-space.dto';
import { SpaceStatus } from '../enums';

export class UpdateParkingSpaceDto extends PartialType(CreateParkingSpaceDto) {
  @ApiProperty({
    description: 'Current availability status of the parking space',
    required: false,
    enum: SpaceStatus,
  })
  @IsOptional()
  @IsEnum(SpaceStatus)
  status?: SpaceStatus;

  @ApiProperty({
    description: 'License plate of the vehicle currently occupying this space',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  currentVehicle?: string;
}
