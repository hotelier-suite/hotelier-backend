import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AUDIT_SERVICE_CLIENT } from '../constants';
import {
  AUDIT_PATTERNS,
  AuditLogDto,
  CreateAuditLogDto,
  AuditLogQueryDto,
  AuditStatisticsDto,
  AuditLogParams,
  AuditLogWithUserDto,
  PaginatedAuditLogDto,
} from '@app/contracts/audit-service';
import { AUTH_SERVICE_CLIENT } from '../../auth-service/constants';
import { USERS_PATTERNS, UserResponseDto } from '@app/contracts/auth-service';

@Injectable()
export class AuditService {
  constructor(
    @Inject(AUDIT_SERVICE_CLIENT)
    private readonly auditClient: ClientProxy,
    @Inject(AUTH_SERVICE_CLIENT)
    private readonly authClient: ClientProxy,
  ) {}

  log(params: AuditLogParams): Observable<AuditLogDto> {
    const dto: CreateAuditLogDto = {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      description: params.description,
      resourceId: params.resourceId,
      details: params.details,
      userAgent: params.userAgent,
    };
    return this.auditClient.send<AuditLogDto, CreateAuditLogDto>(
      AUDIT_PATTERNS.LOG_CREATE,
      dto,
    );
  }

  create(data: CreateAuditLogDto): Observable<AuditLogDto> {
    return this.auditClient.send<AuditLogDto, CreateAuditLogDto>(
      AUDIT_PATTERNS.LOG_CREATE,
      data,
    );
  }

  findAll(
    query: AuditLogQueryDto,
  ): Observable<{ data: AuditLogDto[]; total: number }> {
    return this.auditClient.send<
      { data: AuditLogDto[]; total: number },
      AuditLogQueryDto
    >(AUDIT_PATTERNS.LOG_FIND_ALL, query);
  }

  findAllWithUsers(query: AuditLogQueryDto): Observable<PaginatedAuditLogDto> {
    return this.findAll(query).pipe(
      switchMap((result) => {
        const userIds = [...new Set(result.data.map((log) => log.userId))];

        if (userIds.length === 0) {
          return of({
            data: result.data as AuditLogWithUserDto[],
            total: result.total,
          });
        }

        const userRequests$ = userIds.map((userId) =>
          this.authClient
            .send<UserResponseDto, number>(USERS_PATTERNS.FIND_ONE, userId)
            .pipe(catchError(() => of(null))),
        );

        return forkJoin(userRequests$).pipe(
          map((users) => {
            const userMap = new Map<
              number,
              { id: number; name: string; email: string }
            >();
            users.forEach((user, index) => {
              if (user) {
                userMap.set(userIds[index], {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                });
              }
            });

            const enrichedData: AuditLogWithUserDto[] = result.data.map(
              (log) => ({
                ...log,
                user: userMap.get(log.userId),
              }),
            );

            return { data: enrichedData, total: result.total };
          }),
        );
      }),
    );
  }

  findOne(id: number): Observable<AuditLogDto> {
    return this.auditClient.send<AuditLogDto, number>(
      AUDIT_PATTERNS.LOG_FIND_ONE,
      id,
    );
  }

  getStatistics(days: number = 30): Observable<AuditStatisticsDto> {
    return this.auditClient.send<AuditStatisticsDto, number>(
      AUDIT_PATTERNS.LOG_GET_STATISTICS,
      days,
    );
  }

  cleanOldLogs(olderThanDays: number = 365): Observable<number> {
    return this.auditClient.send<number, number>(
      AUDIT_PATTERNS.LOG_CLEAN_OLD,
      olderThanDays,
    );
  }
}
