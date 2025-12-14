import { OmitType } from '@nestjs/swagger';
import { Vehicle } from '../entities/vehicle.entity';

export class CreateVehicleDto extends OmitType(Vehicle, [
  'id',
  'entryTime',
  'exitTime',
  'status',
  'createdAt',
  'updatedAt',
  'space',
  'incidents',
]) {}
