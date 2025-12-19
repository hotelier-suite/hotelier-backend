import { OmitType } from '@nestjs/swagger';
import { RecreationalFacility } from '../entities/recreational-facility.entity';

export class CreateRecreationalFacilityDto extends OmitType(
  RecreationalFacility,
  ['id', 'status', 'createdAt', 'updatedAt', 'bookings'],
) {}
