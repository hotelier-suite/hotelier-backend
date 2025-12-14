import { OmitType } from '@nestjs/swagger';
import { ParkingSpace } from '../entities/parking-space.entity';

export class CreateParkingSpaceDto extends OmitType(ParkingSpace, [
  'id',
  'status',
  'currentVehicle',
  'createdAt',
  'updatedAt',
  'vehicles',
  'incidents',
]) {}
