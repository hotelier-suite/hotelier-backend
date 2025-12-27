import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GUEST_REQUESTS_PATTERNS,
  CreateGuestRequestDto,
  GuestRequestDto,
  UpdateGuestRequestDto,
  RequestPriority,
  GuestRequestStatus,
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

  findAll(): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<
      GuestRequestDto[],
      Record<string, never>
    >(GUEST_REQUESTS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<GuestRequestDto> {
    return this.guestRequestsClient.send<GuestRequestDto, number>(
      GUEST_REQUESTS_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  findByStatus(status: GuestRequestStatus): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<GuestRequestDto[], GuestRequestStatus>(
      GUEST_REQUESTS_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  findByPriority(priority: RequestPriority): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<GuestRequestDto[], RequestPriority>(
      GUEST_REQUESTS_PATTERNS.FIND_BY_PRIORITY,
      priority,
    );
  }

  findPending(): Observable<GuestRequestDto[]> {
    return this.findByStatus(GuestRequestStatus.PENDING).pipe(
      map((requests) =>
        requests.sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return aTime - bTime;
        }),
      ),
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

  findRecent(limit = 5): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<GuestRequestDto[], number>(
      GUEST_REQUESTS_PATTERNS.FIND_RECENT,
      limit,
    );
  }
}
