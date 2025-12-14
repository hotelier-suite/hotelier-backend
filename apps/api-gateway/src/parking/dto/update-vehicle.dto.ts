import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  status?: Vehicle['status'];
  exitTime?: Vehicle['exitTime'];
}
