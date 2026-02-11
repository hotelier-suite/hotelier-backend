import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { AuditController, AuditService } from './';

describe('AuditController', () => {
  let controller: AuditController;
  const mockService: Record<string, jest.Mock> = {
    create: jest.fn(),
    findAllWithUsers: jest.fn(),
    findOne: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [{ provide: AuditService, useValue: mockService }],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an audit log', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.create({ userId: 1 } as never),
    );
    expect(result).toEqual({ id: 1 });
  });

  it('should find all audit logs', async () => {
    mockService.findAllWithUsers.mockReturnValueOnce(
      of({ data: [], total: 0 }),
    );
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result.total).toBe(0);
  });

  it('should get statistics', async () => {
    mockService.getStatistics.mockReturnValueOnce(of({ total: 5 }));
    const result = await lastValueFrom(controller.getStatistics(30));
    expect(result).toEqual({ total: 5 });
  });

  it('should find one audit log', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toEqual({ id: 1 });
  });
});
