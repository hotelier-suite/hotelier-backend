import { OmitType } from '@nestjs/swagger';
import { ParkingIncident } from '../entities/parking-incident.entity';

export class CreateParkingIncidentDto extends OmitType(ParkingIncident, [
  'id',
  'reportDate',
  'status',
  'priority',
  'resolution',
  'resolvedAt',
  'createdAt',
  'updatedAt',
  'vehicle',
  'space',
]) {}
