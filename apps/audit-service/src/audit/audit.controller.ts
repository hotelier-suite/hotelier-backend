import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import {
  AUDIT_PATTERNS,
  AuditLogDto,
  CreateAuditLogDto,
  AuditLogQueryDto,
  AuditStatisticsDto,
} from '@app/contracts/audit-service';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @MessagePattern(AUDIT_PATTERNS.LOG_CREATE)
  create(@Payload() data: CreateAuditLogDto): Promise<AuditLogDto> {
    return this.auditService.create(data);
  }

  @MessagePattern(AUDIT_PATTERNS.LOG_FIND_ALL)
  findAll(
    @Payload() query: AuditLogQueryDto,
  ): Promise<{ data: AuditLogDto[]; total: number }> {
    return this.auditService.findAll(query);
  }

  @MessagePattern(AUDIT_PATTERNS.LOG_FIND_ONE)
  findOne(@Payload() id: number): Promise<AuditLogDto> {
    return this.auditService.findOne(id);
  }

  @MessagePattern(AUDIT_PATTERNS.LOG_GET_STATISTICS)
  getStatistics(@Payload() days: number): Promise<AuditStatisticsDto> {
    return this.auditService.getStatistics(days);
  }

  @MessagePattern(AUDIT_PATTERNS.LOG_CLEAN_OLD)
  cleanOldLogs(@Payload() olderThanDays: number): Promise<number> {
    return this.auditService.cleanOldLogs(olderThanDays);
  }
}
