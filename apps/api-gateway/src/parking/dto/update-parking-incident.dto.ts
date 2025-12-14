import { PartialType } from '@nestjs/swagger';
import { CreateParkingIncidentDto } from './create-parking-incident.dto';
import { ParkingIncident } from '../entities/parking-incident.entity';

export class UpdateParkingIncidentDto extends PartialType(
  CreateParkingIncidentDto,
) {
  status?: ParkingIncident['status'];
  resolution?: ParkingIncident['resolution'];
  resolvedAt?: ParkingIncident['resolvedAt'];
}
