import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { ReservationsController } from './';
import { ReservationsService } from './reservations.service';

describe('ReservationsController (gateway)', () => {
  let controller: ReservationsController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getAvailability: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkout: jest.fn(),
    getReservationsWithBillingDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: mockService }],
    }).compile();
    controller = module.get<ReservationsController>(ReservationsController);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should createSelf', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const req = { user: { id: 5 } } as never;
    const result = await lastValueFrom(controller.createSelf({} as never, req));
    expect(result).toHaveProperty('id');
  });

  it('should createSelf without user', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const req = {} as never;
    const result = await lastValueFrom(controller.createSelf({} as never, req));
    expect(result).toHaveProperty('id');
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should getReservationsWithBillingDetails', async () => {
    mockService.getReservationsWithBillingDetails.mockResolvedValueOnce([]);
    const result = await controller.getReservationsWithBillingDetails();
    expect(result).toEqual([]);
  });

  it('should getAvailability', async () => {
    mockService.getAvailability.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      controller.getAvailability(new Date(), new Date()),
    );
    expect(result).toEqual([]);
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

  it('should checkout', async () => {
    mockService.checkout.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.checkout(1));
    expect(result).toHaveProperty('id');
  });
});
