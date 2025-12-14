import { OmitType } from '@nestjs/swagger';
import { Venue } from '../entities/venue.entity';

export class CreateVenueDto extends OmitType(Venue, [
  'id',
  'createdAt',
  'updatedAt',
  'events',
]) {}
