import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { BookingsController } from './';
import { BookingsService } from './bookings.service';

describe('BookingsController (gateway)', () => {
  let controller: BookingsController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    cancel: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockService }],
    }).compile();
    controller = module.get<BookingsController>(BookingsController);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should getStatistics', async () => {
    mockService.getStatistics.mockReturnValueOnce(of({ total: 5 }));
    const result = await lastValueFrom(
      controller.getStatistics(new Date(), new Date()),
    );
    expect(result).toHaveProperty('total');
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should cancel', async () => {
    mockService.cancel.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.cancel(1, 'reason'));
    expect(result).toHaveProperty('id');
  });

  it('should checkIn', async () => {
    mockService.checkIn.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.checkIn(1));
    expect(result).toHaveProperty('id');
  });

  it('should checkOut', async () => {
    mockService.checkOut.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.checkOut(1));
    expect(result).toHaveProperty('id');
  });
});
