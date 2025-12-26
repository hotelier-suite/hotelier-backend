import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities';
import {
  AuditLogDto,
  CreateAuditLogDto,
  AuditLogQueryDto,
  AuditStatisticsDto,
  AuditResource,
  AuditAction,
} from '@app/contracts/audit-service';

// Query result interfaces
interface ActionSummaryResult {
  action: string;
  count: string;
}

interface ResourceSummaryResult {
  resource: string;
  count: string;
}

interface UserSummaryResult {
  userId: string;
  userName: string;
  count: string;
}

interface DateSummaryResult {
  date: string;
  count: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(data: CreateAuditLogDto): Promise<AuditLogDto> {
    const auditLog = this.auditLogRepository.create(data);
    const saved = await this.auditLogRepository.save(auditLog);
    return this.toAuditLogDto(saved);
  }

  async findAll(
    query: AuditLogQueryDto,
  ): Promise<{ data: AuditLogDto[]; total: number }> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select([
        'auditLog.id',
        'auditLog.userId',
        'auditLog.action',
        'auditLog.resource',
        'auditLog.resourceId',
        'auditLog.description',
        'auditLog.details',
        'auditLog.userAgent',
        'auditLog.createdAt',
      ]);

    // Apply filters
    if (query.userId) {
      queryBuilder.andWhere('auditLog.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.action) {
      queryBuilder.andWhere('auditLog.action = :action', {
        action: query.action,
      });
    }

    if (query.resource) {
      queryBuilder.andWhere('auditLog.resource = :resource', {
        resource: query.resource,
      });
    }

    if (query.resourceId) {
      queryBuilder.andWhere('auditLog.resourceId = :resourceId', {
        resourceId: query.resourceId,
      });
    }

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere(
        'auditLog.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: query.startDate,
          endDate: query.endDate,
        },
      );
    } else if (query.startDate) {
      queryBuilder.andWhere('auditLog.createdAt >= :startDate', {
        startDate: query.startDate,
      });
    } else if (query.endDate) {
      queryBuilder.andWhere('auditLog.createdAt <= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.search) {
      queryBuilder.andWhere('auditLog.description ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    // Apply ordering and pagination
    const order: 'ASC' | 'DESC' = query.order === 'ASC' ? 'ASC' : 'DESC';

    queryBuilder
      .orderBy('auditLog.createdAt', order)
      .skip(query.skip || 0)
      .take(query.take || 50);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((log) => this.toAuditLogDto(log)),
      total,
    };
  }

  async findOne(id: number): Promise<AuditLogDto> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
    });
    if (!auditLog) {
      throw new NotFoundException(`Audit log with id ${id} not found`);
    }
    return this.toAuditLogDto(auditLog);
  }

  async findByUser(
    userId: number,
    limit: number = 100,
  ): Promise<AuditLogDto[]> {
    const logs = await this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return logs.map((log) => this.toAuditLogDto(log));
  }

  async findByResource(
    resource: AuditResource,
    resourceId: string,
  ): Promise<AuditLogDto[]> {
    const logs = await this.auditLogRepository.find({
      where: { resource, resourceId },
      order: { createdAt: 'DESC' },
    });
    return logs.map((log) => this.toAuditLogDto(log));
  }

  async findByAction(action: string): Promise<AuditLogDto[]> {
    const logs = await this.auditLogRepository.find({
      where: { action: action as AuditAction },
      order: { createdAt: 'DESC' },
    });
    return logs.map((log) => this.toAuditLogDto(log));
  }

  async getStatistics(days: number = 30): Promise<AuditStatisticsDto> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total logs in period
    const totalLogs = await this.auditLogRepository.count({
      where: {
        createdAt: Between(startDate, new Date()),
      },
    });

    // Get logs by action
    const actionStats = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :startDate', { startDate })
      .groupBy('auditLog.action')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany<ActionSummaryResult>();

    // Get logs by resource
    const resourceStats = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :startDate', { startDate })
      .groupBy('auditLog.resource')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany<ResourceSummaryResult>();

    // Get top users
    const userStats = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.userId', 'userId')
      .addSelect("'Unknown'", 'userName')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :startDate', { startDate })
      .groupBy('auditLog.userId')
      .orderBy('COUNT(*)', 'DESC')
      .limit(10)
      .getRawMany<UserSummaryResult>();

    // Get daily activity
    const dailyActivity = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select("DATE_TRUNC('day', auditLog.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('day', auditLog.createdAt)")
      .orderBy("DATE_TRUNC('day', auditLog.createdAt)", 'ASC')
      .getRawMany<DateSummaryResult>();

    return {
      period: `${days} days`,
      totalLogs,
      actionStats: actionStats.map((stat) => ({
        action: stat.action,
        count: parseInt(stat.count, 10),
      })),
      resourceStats: resourceStats.map((stat) => ({
        resource: stat.resource,
        count: parseInt(stat.count, 10),
      })),
      userStats: userStats.map((stat) => ({
        userId: parseInt(stat.userId, 10),
        userName: stat.userName,
        count: parseInt(stat.count, 10),
      })),
      dailyActivity: dailyActivity.map((stat) => ({
        date: stat.date,
        count: parseInt(stat.count, 10),
      })),
    };
  }

  async cleanOldLogs(olderThanDays: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.auditLogRepository.delete({
      createdAt: Between(new Date('1970-01-01'), cutoffDate),
    });

    return result.affected || 0;
  }

  private toAuditLogDto(auditLog: AuditLog): AuditLogDto {
    return {
      id: auditLog.id,
      userId: auditLog.userId,
      action: auditLog.action,
      resource: auditLog.resource,
      resourceId: auditLog.resourceId,
      userAgent: auditLog.userAgent,
      details: auditLog.details,
      description: auditLog.description,
      createdAt: auditLog.createdAt,
    };
  }
}
