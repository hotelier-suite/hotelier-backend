import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { InvoicesService } from './';
import { BILLING_SERVICE_CLIENT } from '../constants';

describe('InvoicesService (gateway)', () => {
  let service: InvoicesService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: BILLING_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<InvoicesService>(InvoicesService);
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

  it('should markAsPaid', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.markAsPaid(1));
    expect(result).toHaveProperty('id');
  });

  it('should generatePdf', async () => {
    mockClient.send.mockReturnValueOnce(
      of({ buffer: '', filename: 'test.pdf' }),
    );
    const result = await lastValueFrom(service.generatePdf(1));
    expect(result).toHaveProperty('filename');
  });
});
