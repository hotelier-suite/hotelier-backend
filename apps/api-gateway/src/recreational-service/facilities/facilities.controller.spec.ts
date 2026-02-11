import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { FacilitiesController } from './';
import { FacilitiesService } from './facilities.service';

describe('FacilitiesController (gateway)', () => {
  let controller: FacilitiesController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAvailability: jest.fn(),
    getMultipleAvailability: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilitiesController],
      providers: [{ provide: FacilitiesService, useValue: mockService }],
    }).compile();
    controller = module.get<FacilitiesController>(FacilitiesController);
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

  it('should getMultipleAvailability', async () => {
    mockService.getMultipleAvailability.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      controller.getMultipleAvailability([1, 2], new Date()),
    );
    expect(result).toEqual([]);
  });

  it('should getAvailability', async () => {
    mockService.getAvailability.mockReturnValueOnce(of({ available: true }));
    const result = await lastValueFrom(
      controller.getAvailability(1, new Date()),
    );
    expect(result).toHaveProperty('available');
  });
});
