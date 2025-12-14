import { PartialType } from '@nestjs/swagger';
import { CreateGuestRequestDto } from './create-guest-request.dto';
import { GuestRequest } from '../entities/guest-request.entity';

export class UpdateGuestRequestDto extends PartialType(CreateGuestRequestDto) {
  completedAt?: GuestRequest['completedAt'];
}
