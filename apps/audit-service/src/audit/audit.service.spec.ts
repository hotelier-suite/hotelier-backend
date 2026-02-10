import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import { AuditLog } from './entities';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

function createMockQueryBuilder() {
  const qb: Record<string, jest.Mock> = {};
  qb.select = jest.fn().mockReturnValue(qb);
  qb.addSelect = jest.fn().mockReturnValue(qb);
  qb.where = jest.fn().mockReturnValue(qb);
  qb.andWhere = jest.fn().mockReturnValue(qb);
  qb.groupBy = jest.fn().mockReturnValue(qb);
  qb.orderBy = jest.fn().mockReturnValue(qb);
  qb.limit = jest.fn().mockReturnValue(qb);
  qb.skip = jest.fn().mockReturnValue(qb);
  qb.take = jest.fn().mockReturnValue(qb);
  qb.getManyAndCount = jest.fn().mockResolvedValue([[], 0]);
  qb.getRawMany = jest.fn().mockResolvedValue([]);
  return qb;
}

describe('AuditService', () => {
  let service: AuditService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getRepositoryToken(AuditLog), useValue: repo },
      ],
    }).compile();

    service = module.get(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an audit log', async () => {
      const dto = {
        userId: 1,
        action: AuditAction.CREATE,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Created reservation',
      };
      const entity = { ...dto, id: 1, createdAt: new Date() };
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValueOnce(entity);

      const result = await service.create(dto);
      expect(result).toEqual(entity);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
    });

    it('should save audit log with optional fields', async () => {
      const dto = {
        userId: 1,
        action: AuditAction.LOGIN,
        resource: AuditResource.USER,
        description: 'User logged in',
        userAgent: 'Mozilla/5.0',
        details: { ipAddress: '192.168.1.1' },
      };
      const entity = { ...dto, id: 2, createdAt: new Date() };
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValueOnce(entity);

      const result = await service.create(dto);
      expect(result).toEqual(entity);
    });
  });

  describe('findAll', () => {
    it('should return paginated results with default query', async () => {
      const qb = createMockQueryBuilder();
      const logs = [
        {
          id: 1,
          userId: 1,
          action: AuditAction.CREATE,
          resource: AuditResource.RESERVATION,
          description: 'Test',
          createdAt: new Date(),
        },
      ];
      qb.getManyAndCount.mockResolvedValueOnce([logs, 1]);
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});
      expect(result).toEqual({ data: logs, total: 1 });
      expect(qb.orderBy).toHaveBeenCalledWith('auditLog.createdAt', 'DESC');
      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(50);
    });

    it('should filter by userId', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ userId: 5 });
      expect(qb.andWhere).toHaveBeenCalledWith('auditLog.userId = :userId', {
        userId: 5,
      });
    });

    it('should filter by action', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ action: AuditAction.LOGIN });
      expect(qb.andWhere).toHaveBeenCalledWith('auditLog.action = :action', {
        action: AuditAction.LOGIN,
      });
    });

    it('should filter by resource', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ resource: AuditResource.ROOM });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'auditLog.resource = :resource',
        { resource: AuditResource.ROOM },
      );
    });

    it('should filter by resourceId', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ resourceId: '101' });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'auditLog.resourceId = :resourceId',
        { resourceId: '101' },
      );
    });

    it('should filter by date range (both start and end)', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      await service.findAll({ startDate, endDate });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'auditLog.createdAt BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    });

    it('should filter by startDate only', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);
      const startDate = new Date('2024-01-01');

      await service.findAll({ startDate });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'auditLog.createdAt >= :startDate',
        { startDate },
      );
    });

    it('should filter by endDate only', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);
      const endDate = new Date('2024-01-31');

      await service.findAll({ endDate });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'auditLog.createdAt <= :endDate',
        { endDate },
      );
    });

    it('should apply search filter', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ search: 'reservation' });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'auditLog.description ILIKE :search',
        { search: '%reservation%' },
      );
    });

    it('should respect ASC order', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ order: 'ASC' });
      expect(qb.orderBy).toHaveBeenCalledWith('auditLog.createdAt', 'ASC');
    });

    it('should use custom skip and take', async () => {
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ skip: 20, take: 10 });
      expect(qb.skip).toHaveBeenCalledWith(20);
      expect(qb.take).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should return an audit log by id', async () => {
      const log = {
        id: 1,
        userId: 1,
        action: AuditAction.CREATE,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Created reservation',
        createdAt: new Date(),
      };
      repo.findOne.mockResolvedValueOnce(log);

      const result = await service.findOne(1);
      expect(result).toEqual(log);
      expect(repo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics for a given period', async () => {
      repo.count.mockResolvedValueOnce(100);

      const actionQb = createMockQueryBuilder();
      actionQb.getRawMany.mockResolvedValueOnce([
        { action: 'CREATE', count: '60' },
        { action: 'LOGIN', count: '40' },
      ]);

      const resourceQb = createMockQueryBuilder();
      resourceQb.getRawMany.mockResolvedValueOnce([
        { resource: 'RESERVATION', count: '50' },
      ]);

      const userQb = createMockQueryBuilder();
      userQb.getRawMany.mockResolvedValueOnce([
        { userId: '1', userName: 'Unknown', count: '30' },
      ]);

      const dailyQb = createMockQueryBuilder();
      dailyQb.getRawMany.mockResolvedValueOnce([
        { date: '2024-01-15T00:00:00.000Z', count: '10' },
      ]);

      repo.createQueryBuilder
        .mockReturnValueOnce(actionQb)
        .mockReturnValueOnce(resourceQb)
        .mockReturnValueOnce(userQb)
        .mockReturnValueOnce(dailyQb);

      const result = await service.getStatistics(30);

      expect(result.period).toBe('30 days');
      expect(result.totalLogs).toBe(100);
      expect(result.actionStats).toEqual([
        { action: 'CREATE', count: 60 },
        { action: 'LOGIN', count: 40 },
      ]);
      expect(result.resourceStats).toEqual([
        { resource: 'RESERVATION', count: 50 },
      ]);
      expect(result.userStats).toEqual([
        { userId: 1, userName: 'Unknown', count: 30 },
      ]);
      expect(result.dailyActivity).toHaveLength(1);
      expect(result.dailyActivity[0].count).toBe(10);
    });

    it('should use default 30 days when no days provided', async () => {
      repo.count.mockResolvedValueOnce(0);
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getStatistics();
      expect(result.period).toBe('30 days');
      expect(result.totalLogs).toBe(0);
    });

    it('should handle empty statistics', async () => {
      repo.count.mockResolvedValueOnce(0);
      const qb = createMockQueryBuilder();
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getStatistics(7);
      expect(result.period).toBe('7 days');
      expect(result.totalLogs).toBe(0);
      expect(result.actionStats).toEqual([]);
      expect(result.resourceStats).toEqual([]);
      expect(result.userStats).toEqual([]);
      expect(result.dailyActivity).toEqual([]);
    });
  });

  describe('cleanOldLogs', () => {
    it('should delete old logs and return affected count', async () => {
      repo.delete.mockResolvedValueOnce({ affected: 25 });

      const result = await service.cleanOldLogs(365);
      expect(result).toBe(25);
      expect(repo.delete).toHaveBeenCalled();
    });

    it('should return 0 when no logs deleted', async () => {
      repo.delete.mockResolvedValueOnce({ affected: 0 });

      const result = await service.cleanOldLogs(365);
      expect(result).toBe(0);
    });

    it('should return 0 when affected is undefined', async () => {
      repo.delete.mockResolvedValueOnce({});

      const result = await service.cleanOldLogs(365);
      expect(result).toBe(0);
    });

    it('should use default 365 days', async () => {
      repo.delete.mockResolvedValueOnce({ affected: 5 });

      const result = await service.cleanOldLogs();
      expect(result).toBe(5);
    });
  });
});
