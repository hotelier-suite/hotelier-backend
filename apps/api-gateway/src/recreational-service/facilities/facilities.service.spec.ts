import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { FacilitiesService } from './';
import { RECREATIONAL_SERVICE_CLIENT } from '../constants';

describe('FacilitiesService (gateway)', () => {
  let service: FacilitiesService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacilitiesService,
        { provide: RECREATIONAL_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<FacilitiesService>(FacilitiesService);
    jest.clearAllMocks();
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

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
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

  it('should getAvailability', async () => {
    mockClient.send.mockReturnValueOnce(of({ available: true }));
    const result = await lastValueFrom(service.getAvailability(1, new Date()));
    expect(result).toHaveProperty('available');
  });

  it('should getMultipleAvailability', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      service.getMultipleAvailability([1, 2], new Date()),
    );
    expect(result).toEqual([]);
  });
});
