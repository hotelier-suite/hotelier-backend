import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { AuditService } from './';
import { AUDIT_SERVICE_CLIENT } from '../constants';
import { AUTH_SERVICE_CLIENT } from '../../auth-service/constants';

describe('AuditService', () => {
  let service: AuditService;
  const mockAuditClient = { send: jest.fn() };
  const mockAuthClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: AUDIT_SERVICE_CLIENT, useValue: mockAuditClient },
        { provide: AUTH_SERVICE_CLIENT, useValue: mockAuthClient },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log an audit entry', async () => {
    mockAuditClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.log({
        userId: 1,
        action: 'CREATE' as never,
        resource: 'ROOM' as never,
        description: 'Created room',
      }),
    );
    expect(result).toEqual({ id: 1 });
  });

  it('should create an audit log', async () => {
    mockAuditClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({ userId: 1 } as never));
    expect(result).toEqual({ id: 1 });
  });

  it('should findAll', async () => {
    mockAuditClient.send.mockReturnValueOnce(
      of({ data: [{ id: 1 }], total: 1 }),
    );
    const result = await lastValueFrom(service.findAll({} as never));
    expect(result.total).toBe(1);
  });

  it('should findAllWithUsers with empty data', async () => {
    mockAuditClient.send.mockReturnValueOnce(of({ data: [], total: 0 }));
    const result = await lastValueFrom(service.findAllWithUsers({} as never));
    expect(result.total).toBe(0);
  });

  it('should findAllWithUsers with user enrichment', async () => {
    mockAuditClient.send.mockReturnValueOnce(
      of({ data: [{ id: 1, userId: 5 }], total: 1 }),
    );
    mockAuthClient.send.mockReturnValueOnce(
      of({ id: 5, name: 'John', email: 'john@test.com' }),
    );
    const result = await lastValueFrom(service.findAllWithUsers({} as never));
    expect(result.total).toBe(1);
    expect(result.data[0]).toHaveProperty('user');
  });

  it('should findAllWithUsers with null user', async () => {
    mockAuditClient.send.mockReturnValueOnce(
      of({ data: [{ id: 1, userId: 999 }], total: 1 }),
    );
    mockAuthClient.send.mockReturnValueOnce(of(null));
    const result = await lastValueFrom(service.findAllWithUsers({} as never));
    expect(result.total).toBe(1);
  });

  it('should findOne', async () => {
    mockAuditClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toEqual({ id: 1 });
  });

  it('should getStatistics', async () => {
    mockAuditClient.send.mockReturnValueOnce(of({ total: 100 }));
    const result = await lastValueFrom(service.getStatistics());
    expect(result).toEqual({ total: 100 });
  });

  it('should cleanOldLogs', async () => {
    mockAuditClient.send.mockReturnValueOnce(of(50));
    const result = await lastValueFrom(service.cleanOldLogs());
    expect(result).toBe(50);
  });
});
