import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StreamableFile } from '@nestjs/common';
import { InvoicesController } from './';
import { InvoicesService } from './invoices.service';

describe('InvoicesController (gateway)', () => {
  let controller: InvoicesController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    markAsPaid: jest.fn(),
    generatePdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [{ provide: InvoicesService, useValue: mockService }],
    }).compile();
    controller = module.get<InvoicesController>(InvoicesController);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should markAsPaid', async () => {
    mockService.markAsPaid.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.markAsPaid(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should download PDF', async () => {
    mockService.generatePdf.mockReturnValueOnce(
      of({
        buffer: Buffer.from('pdf').toString('base64'),
        filename: 'invoice.pdf',
      }),
    );
    const result = await lastValueFrom(controller.download(1));
    expect(result).toBeInstanceOf(StreamableFile);
  });
});
