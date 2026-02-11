import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { GuestRequestsService } from './';
import { GUEST_REQUESTS_SERVICE_CLIENT } from '../constants';

describe('GuestRequestsService (gateway)', () => {
  let service: GuestRequestsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestRequestsService,
        { provide: GUEST_REQUESTS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<GuestRequestsService>(GuestRequestsService);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should findAll', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should markAsCompleted', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1, status: 'COMPLETED' }));
    const result = await lastValueFrom(service.markAsCompleted(1));
    expect(result).toHaveProperty('id');
  });

  it('should assignTo', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1, assignedTo: 'John' }));
    const result = await lastValueFrom(service.assignTo(1, 'John'));
    expect(result).toHaveProperty('assignedTo');
  });

  it('should countByStatus', async () => {
    mockClient.send.mockReturnValueOnce(of(5));
    const result = await lastValueFrom(
      service.countByStatus('PENDING' as never),
    );
    expect(result).toBe(5);
  });
});
