import { OmitType } from '@nestjs/swagger';
import { GuestRequest } from '../entities/guest-request.entity';

export class CreateGuestRequestDto extends OmitType(GuestRequest, [
  'id',
  'completedAt',
  'createdAt',
  'updatedAt',
]) {}
