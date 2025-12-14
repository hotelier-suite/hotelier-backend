import { OmitType } from '@nestjs/swagger';
import { Guest } from '../../reservations/entities/guest.entity';

export class CreateGuestDto extends OmitType(Guest, [
  'id',
  'createdAt',
  'updatedAt',
  'reservations',
]) {}
