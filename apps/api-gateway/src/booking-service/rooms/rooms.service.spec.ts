import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { RoomsService } from './';
import { BOOKING_SERVICE_CLIENT } from '../constants';

describe('RoomsService (gateway)', () => {
  let service: RoomsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: BOOKING_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<RoomsService>(RoomsService);
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

  it('should setAvailability', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.setAvailability(1, true));
    expect(result).toHaveProperty('id');
  });
});
