import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { AuditAction } from './enums/audit-action.enum';
import { AuditResource } from './enums/audit-resource.enum';
import { Between } from 'typeorm';

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

export interface AuditLogParams {
  userId: number;
  action: AuditAction;
  resource: AuditResource;
  description: string;
  resourceId?: string;
  details?: Record<string, any>;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create a new audit log entry
   */
  async log(params: AuditLogParams): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      description: params.description,
      resourceId: params.resourceId,
      details: params.details,
      userAgent: params.userAgent,
    });

    return this.auditLogRepository.save(auditLog);
  }

  /**
   * Create audit log from DTO
   */
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(auditLog);
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async findAll(
    query: AuditLogQueryDto,
  ): Promise<{ data: AuditLog[]; total: number }> {
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

    return { data, total };
  }

  /**
   * Get audit log by ID
   */
  async findOne(id: number): Promise<AuditLog | null> {
    return this.auditLogRepository.findOne({
      where: { id },
    });
  }

  /**
   * Get audit logs for a specific resource
   */
  async findByResource(
    resource: AuditResource,
    resourceId: string,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { resource, resourceId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async findByUser(userId: number, limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get audit statistics
   */
  async getStatistics(days: number = 30): Promise<any> {
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
        userId: stat.userId,
        userName: stat.userName,
        count: parseInt(stat.count, 10),
      })),
      dailyActivity: dailyActivity.map((stat) => ({
        date: stat.date,
        count: parseInt(stat.count, 10),
      })),
    };
  }

  /**
   * Clean old audit logs (for maintenance)
   */
  async cleanOldLogs(olderThanDays: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.auditLogRepository.delete({
      createdAt: Between(new Date('1970-01-01'), cutoffDate),
    });

    return result.affected || 0;
  }
}
