import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

describe('AuditController', () => {
  let controller: AuditController;
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            getStatistics: jest.fn(),
            cleanOldLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuditController);
    service = module.get(AuditService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = {
        userId: 1,
        action: AuditAction.CREATE,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Created reservation',
      };
      const result = { id: 1, ...dto, createdAt: new Date() };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should delegate to service.findAll with query', async () => {
      const query = { userId: 1, skip: 0, take: 50 };
      const result = { data: [], total: 0 };
      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);

      expect(await controller.findAll(query)).toEqual(result);
      expect(spy).toHaveBeenCalledWith(query);
    });

    it('should return paginated results', async () => {
      const query = { skip: 0, take: 10 };
      const log = {
        id: 1,
        userId: 1,
        action: AuditAction.LOGIN,
        resource: AuditResource.USER,
        resourceId: '1',
        description: 'User logged in',
        createdAt: new Date(),
      };
      const result = { data: [log], total: 1 };
      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);

      const response = await controller.findAll(query);
      expect(response.data).toHaveLength(1);
      expect(response.total).toBe(1);
      expect(spy).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      const result = {
        id: 1,
        userId: 1,
        action: AuditAction.CREATE,
        resource: AuditResource.RESERVATION,
        resourceId: '101',
        description: 'Created reservation',
        createdAt: new Date(),
      };
      const spy = jest.spyOn(service, 'findOne').mockResolvedValueOnce(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('getStatistics', () => {
    it('should delegate to service.getStatistics', async () => {
      const result = {
        period: '30 days',
        totalLogs: 100,
        actionStats: [{ action: 'CREATE', count: 50 }],
        resourceStats: [{ resource: 'RESERVATION', count: 30 }],
        userStats: [{ userId: 1, userName: 'Unknown', count: 40 }],
        dailyActivity: [{ date: new Date(), count: 10 }],
      };
      const spy = jest
        .spyOn(service, 'getStatistics')
        .mockResolvedValueOnce(result);

      expect(await controller.getStatistics(30)).toEqual(result);
      expect(spy).toHaveBeenCalledWith(30);
    });
  });

  describe('cleanOldLogs', () => {
    it('should delegate to service.cleanOldLogs', async () => {
      const spy = jest.spyOn(service, 'cleanOldLogs').mockResolvedValueOnce(15);

      expect(await controller.cleanOldLogs(365)).toBe(15);
      expect(spy).toHaveBeenCalledWith(365);
    });

    it('should return 0 when no logs to clean', async () => {
      const spy = jest.spyOn(service, 'cleanOldLogs').mockResolvedValueOnce(0);

      expect(await controller.cleanOldLogs(30)).toBe(0);
      expect(spy).toHaveBeenCalledWith(30);
    });
  });
});
