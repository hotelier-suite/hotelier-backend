import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { EventsService } from './';
import { EVENTS_SERVICE_CLIENT } from '../constants';

describe('EventsService (gateway)', () => {
  let service: EventsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: EVENTS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<EventsService>(EventsService);
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
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.create({ name: 'test' } as never),
    );
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.update(1, { name: 'updated' } as never),
    );
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toHaveProperty('id');
  });
});
