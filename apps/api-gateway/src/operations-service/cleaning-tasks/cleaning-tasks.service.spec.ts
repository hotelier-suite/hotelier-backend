import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { CleaningTasksService } from './';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';

describe('CleaningTasksService (gateway)', () => {
  let service: CleaningTasksService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningTasksService,
        { provide: OPERATIONS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<CleaningTasksService>(CleaningTasksService);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findAll());
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toEqual({ id: 1 });
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toEqual({ id: 1 });
  });

  it('should update', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.update(1, {} as never));
    expect(result).toEqual({ id: 1 });
  });

  it('should remove', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toEqual({ id: 1 });
  });
});
