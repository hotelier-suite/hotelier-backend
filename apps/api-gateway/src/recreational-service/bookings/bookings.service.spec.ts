import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { BookingsService } from './';
import { RECREATIONAL_SERVICE_CLIENT } from '../constants';

describe('BookingsService (gateway)', () => {
  let service: BookingsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: RECREATIONAL_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<BookingsService>(BookingsService);
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
    expect(result).toHaveProperty('id', 1);
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

  it('should cancel', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.cancel(1, 'reason'));
    expect(result).toHaveProperty('id');
  });

  it('should checkIn', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.checkIn(1));
    expect(result).toHaveProperty('id');
  });

  it('should checkOut', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.checkOut(1));
    expect(result).toHaveProperty('id');
  });

  it('should getStatistics', async () => {
    mockClient.send.mockReturnValueOnce(of({ total: 10 }));
    const result = await lastValueFrom(
      service.getStatistics(new Date(), new Date()),
    );
    expect(result).toHaveProperty('total');
  });
});
