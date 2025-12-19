import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GUEST_REQUESTS_PATTERNS } from '@app/contracts/guest-requests-service/guest-requests/guest-requests.patterns';
import { CreateGuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/create-guest-request.dto';
import { GuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/guest-request.dto';
import { UpdateGuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/update-guest-request.dto';
import { RequestPriority } from '@app/contracts/guest-requests-service/guest-requests/enums/request-priority.enum';
import { RequestStatus } from '@app/contracts/guest-requests-service/guest-requests/enums/request-status.enum';
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

  findByStatus(status: RequestStatus): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<GuestRequestDto[], RequestStatus>(
      GUEST_REQUESTS_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  getRequestsByPriority(
    priority: RequestPriority,
  ): Observable<GuestRequestDto[]> {
    return this.guestRequestsClient.send<GuestRequestDto[], RequestPriority>(
      GUEST_REQUESTS_PATTERNS.FIND_BY_PRIORITY,
      priority,
    );
  }

  getPendingRequests(): Observable<GuestRequestDto[]> {
    return this.findByStatus(RequestStatus.PENDING).pipe(
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

  delete(id: number): Observable<GuestRequestDto> {
    return this.remove(id);
  }

  markAsCompleted(id: number): Observable<GuestRequestDto> {
    return this.update(id, {
      status: RequestStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  assignTo(id: number, assignedTo: string): Observable<GuestRequestDto> {
    return this.update(id, {
      assignedTo,
      status: RequestStatus.IN_PROGRESS,
    });
  }

  countByStatus(status: RequestStatus): Observable<number> {
    return this.guestRequestsClient.send<number, RequestStatus>(
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
