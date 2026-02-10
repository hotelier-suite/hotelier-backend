import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  GUEST_REQUESTS_PATTERNS,
  CreateGuestRequestDto,
  GuestRequestDto,
  UpdateGuestRequestDto,
  GuestRequestStatus,
  FindGuestRequestsFilterDto,
} from '@app/contracts/guest-requests-service';
import { GUEST_REQUESTS_SERVICE_CLIENT } from '../constants';

@Injectable()
export class GuestRequestsService {
  constructor(
    @Inject(GUEST_REQUESTS_SERVICE_CLIENT)
    private readonly guestRequestsClient: ClientProxy,
  ) {}

  create(data: CreateGuestRequestDto): Observable<GuestRequestDto> {
    return this.guestRequestsClient.send<
      GuestRequestDto,
      CreateGuestRequestDto
    >(GUEST_REQUESTS_PATTERNS.CREATE, data);
  }

  findAll(filters: FindGuestRequestsFilterDto): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<
      GuestRequestDto[],
      FindGuestRequestsFilterDto
    >(GUEST_REQUESTS_PATTERNS.FIND_ALL, filters);
  }

  findOne(id: number): Observable<GuestRequestDto> {
    return this.guestRequestsClient.send<GuestRequestDto, number>(
      GUEST_REQUESTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  update(id: number, data: UpdateGuestRequestDto): Observable<GuestRequestDto> {
    return this.guestRequestsClient.send<
      GuestRequestDto,
      { id: number; data: UpdateGuestRequestDto }
    >(GUEST_REQUESTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<GuestRequestDto> {
    return this.guestRequestsClient.send<GuestRequestDto, number>(
      GUEST_REQUESTS_PATTERNS.DELETE,
      id,
    );
  }

  markAsCompleted(id: number): Observable<GuestRequestDto> {
    return this.update(id, {
      status: GuestRequestStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  assignTo(id: number, assignedTo: string): Observable<GuestRequestDto> {
    return this.update(id, {
      assignedTo,
      status: GuestRequestStatus.IN_PROGRESS,
    });
  }

  countByStatus(status: GuestRequestStatus): Observable<number> {
    return this.guestRequestsClient.send<number, GuestRequestStatus>(
      GUEST_REQUESTS_PATTERNS.COUNT_BY_STATUS,
      status,
    );
  }
}
