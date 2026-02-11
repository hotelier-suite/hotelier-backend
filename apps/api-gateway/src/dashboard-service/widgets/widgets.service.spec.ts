import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { WidgetsService } from './';
import { DASHBOARD_SERVICE_CLIENT } from '../constants';

describe('WidgetsService (gateway)', () => {
  let service: WidgetsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetsService,
        { provide: DASHBOARD_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<WidgetsService>(WidgetsService);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.create({ name: 'test' } as never),
    );
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
