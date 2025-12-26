import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AUDIT_SERVICE_CLIENT } from '../constants';
import {
  AUDIT_PATTERNS,
  AuditLogDto,
  CreateAuditLogDto,
  AuditLogQueryDto,
  AuditStatisticsDto,
  AuditResource,
  AuditAction,
} from '@app/contracts/audit-service';

export interface AuditLogParams {
  userId: number;
  action: AuditAction;
  resource: AuditResource;
  description: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @Inject(AUDIT_SERVICE_CLIENT)
    private readonly auditClient: ClientProxy,
  ) {}

  /**
   * Create a new audit log entry via RabbitMQ
   */
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

  /**
   * Create audit log from DTO
   */
  create(data: CreateAuditLogDto): Observable<AuditLogDto> {
    return this.auditClient.send<AuditLogDto, CreateAuditLogDto>(
      AUDIT_PATTERNS.LOG_CREATE,
      data,
    );
  }

  /**
   * Get audit logs with filtering and pagination
   */
  findAll(
    query: AuditLogQueryDto,
  ): Observable<{ data: AuditLogDto[]; total: number }> {
    return this.auditClient.send<
      { data: AuditLogDto[]; total: number },
      AuditLogQueryDto
    >(AUDIT_PATTERNS.LOG_FIND_ALL, query);
  }

  /**
   * Get audit log by ID
   */
  findOne(id: number): Observable<AuditLogDto> {
    return this.auditClient.send<AuditLogDto, number>(
      AUDIT_PATTERNS.LOG_FIND_ONE,
      id,
    );
  }

  /**
   * Get audit logs for a specific resource
   */
  findByResource(
    resource: AuditResource,
    resourceId: string,
  ): Observable<AuditLogDto[]> {
    return this.auditClient.send<
      AuditLogDto[],
      { resource: AuditResource; resourceId: string }
    >(AUDIT_PATTERNS.LOG_FIND_BY_RESOURCE, { resource, resourceId });
  }

  /**
   * Get audit logs for a specific user
   */
  findByUser(userId: number, limit: number = 100): Observable<AuditLogDto[]> {
    return this.auditClient.send<
      AuditLogDto[],
      { userId: number; limit?: number }
    >(AUDIT_PATTERNS.LOG_FIND_BY_USER, { userId, limit });
  }

  /**
   * Get audit logs by action
   */
  findByAction(action: string): Observable<AuditLogDto[]> {
    return this.auditClient.send<AuditLogDto[], string>(
      AUDIT_PATTERNS.LOG_FIND_BY_ACTION,
      action,
    );
  }

  /**
   * Get audit statistics
   */
  getStatistics(days: number = 30): Observable<AuditStatisticsDto> {
    return this.auditClient.send<AuditStatisticsDto, number>(
      AUDIT_PATTERNS.LOG_GET_STATISTICS,
      days,
    );
  }

  /**
   * Clean old audit logs (for maintenance)
   */
  cleanOldLogs(olderThanDays: number = 365): Observable<number> {
    return this.auditClient.send<number, number>(
      AUDIT_PATTERNS.LOG_CLEAN_OLD,
      olderThanDays,
    );
  }
}
