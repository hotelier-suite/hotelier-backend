import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsSelect } from 'typeorm';
import { AuditLog } from './entities';
import {
  AuditLogDto,
  CreateAuditLogDto,
  AuditLogQueryDto,
  AuditStatisticsDto,
  AuditResource,
  AuditAction,
  ActionSummaryResult,
  ResourceSummaryResult,
  UserSummaryResult,
  DateSummaryResult,
} from '@app/contracts/audit-service';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  private readonly auditLogReadSelect: FindOptionsSelect<AuditLog> = {
    id: true,
    userId: true,
    action: true,
    resource: true,
    resourceId: true,
    userAgent: true,
    details: true,
    description: true,
    createdAt: true,
  };

  async create(data: CreateAuditLogDto): Promise<AuditLogDto> {
    const auditLog = this.auditLogRepository.create(data);
    const saved = await this.auditLogRepository.save(auditLog);

    const loaded = await this.auditLogRepository.findOne({
      where: { id: saved.id },
      select: this.auditLogReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load audit log with id ${saved.id} after creation`,
      });
    }

    return loaded;
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

    const order: 'ASC' | 'DESC' = query.order === 'ASC' ? 'ASC' : 'DESC';

    queryBuilder
      .orderBy('auditLog.createdAt', order)
      .skip(query.skip || 0)
      .take(query.take || 50);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<AuditLogDto> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
      select: this.auditLogReadSelect,
    });

    if (!auditLog) {
      throw new RpcException({
        statusCode: 404,
        message: `Audit log with id ${id} not found`,
      });
    }

    return auditLog;
  }

  findByUser(userId: number, limit: number = 100): Promise<AuditLogDto[]> {
    return this.auditLogRepository.find({
      where: { userId },
      select: this.auditLogReadSelect,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  findByResource(
    resource: AuditResource,
    resourceId: string,
  ): Promise<AuditLogDto[]> {
    return this.auditLogRepository.find({
      where: { resource, resourceId },
      select: this.auditLogReadSelect,
      order: { createdAt: 'DESC' },
    });
  }

  findByAction(action: string): Promise<AuditLogDto[]> {
    return this.auditLogRepository.find({
      where: { action: action as AuditAction },
      select: this.auditLogReadSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async getStatistics(days: number = 30): Promise<AuditStatisticsDto> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalLogs = await this.auditLogRepository.count({
      where: {
        createdAt: Between(startDate, new Date()),
      },
    });

    const actionStats = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :startDate', { startDate })
      .groupBy('auditLog.action')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany<ActionSummaryResult>();

    const resourceStats = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :startDate', { startDate })
      .groupBy('auditLog.resource')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany<ResourceSummaryResult>();

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
        date: new Date(stat.date),
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
}
