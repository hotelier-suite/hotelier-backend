import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GuestRequestsService } from './guest-requests.service';
import {
  GUEST_REQUESTS_PATTERNS,
  CreateGuestRequestDto,
  GuestRequestDto,
  UpdateGuestRequestDto,
  RequestPriority,
  RequestStatus,
} from '@app/contracts/guest-requests-service';

@Controller()
export class GuestRequestsController {
  constructor(private readonly guestRequestsService: GuestRequestsService) {}

  @MessagePattern(GUEST_REQUESTS_PATTERNS.FIND_ALL)
  findAll(): Promise<GuestRequestDto[]> {
    return this.guestRequestsService.findAll();
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.FIND_BY_ID)
  findOne(@Payload() id: number): Promise<GuestRequestDto> {
    return this.guestRequestsService.findOne(id);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.FIND_BY_STATUS)
  findByStatus(@Payload() status: RequestStatus): Promise<GuestRequestDto[]> {
    return this.guestRequestsService.findByStatus(status);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.FIND_BY_PRIORITY)
  findByPriority(
    @Payload() priority: RequestPriority,
  ): Promise<GuestRequestDto[]> {
    return this.guestRequestsService.findByPriority(priority);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.CREATE)
  create(@Payload() data: CreateGuestRequestDto): Promise<GuestRequestDto> {
    return this.guestRequestsService.create(data);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateGuestRequestDto },
  ): Promise<GuestRequestDto> {
    return this.guestRequestsService.update(payload.id, payload.data);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<GuestRequestDto> {
    return this.guestRequestsService.remove(id);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.COUNT_BY_STATUS)
  countByStatus(@Payload() status: RequestStatus): Promise<number> {
    return this.guestRequestsService.countByStatus(status);
  }

  @MessagePattern(GUEST_REQUESTS_PATTERNS.FIND_RECENT)
  findRecent(@Payload() limit: number): Promise<GuestRequestDto[]> {
    return this.guestRequestsService.findRecent(limit);
  }
}
