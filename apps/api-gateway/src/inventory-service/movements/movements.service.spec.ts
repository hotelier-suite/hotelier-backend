import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { MovementsService } from './';
import { INVENTORY_SERVICE_CLIENT } from '../constants';

describe('MovementsService (gateway)', () => {
  let service: MovementsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementsService,
        { provide: INVENTORY_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<MovementsService>(MovementsService);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findAll());
    expect(result).toEqual([]);
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });
});
