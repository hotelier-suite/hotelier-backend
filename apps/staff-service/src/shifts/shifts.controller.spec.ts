import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsController, ShiftsService } from './';

describe('ShiftsController', () => {
  let controller: ShiftsController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockShift = {
    id: 1,
    date: new Date(2024, 5, 15),
    startTime: '08:00',
    endTime: '16:00',
    type: 'MORNING',
    status: 'SCHEDULED',
    position: 'Supervisor',
    department: 'Housekeeping',
    employeeId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
      providers: [{ provide: ShiftsService, useValue: mockService }],
    }).compile();

    controller = module.get<ShiftsController>(ShiftsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all shifts', async () => {
      mockService.findAll.mockResolvedValueOnce([mockShift]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockShift]);
    });
  });

  describe('findOne', () => {
    it('should return a shift by id', async () => {
      mockService.findOne.mockResolvedValueOnce(mockShift);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockShift);
    });
  });

  describe('create', () => {
    it('should create a shift', async () => {
      mockService.create.mockResolvedValueOnce(mockShift);
      const result = await controller.create({
        date: new Date(2024, 5, 15),
        startTime: '08:00',
        endTime: '16:00',
        type: 'MORNING' as never,
        status: 'SCHEDULED' as never,
        position: 'Supervisor',
        department: 'Housekeeping',
        employeeId: 1,
      });
      expect(result).toEqual(mockShift);
    });
  });

  describe('update', () => {
    it('should update a shift', async () => {
      mockService.update.mockResolvedValueOnce(mockShift);
      const result = await controller.update({
        id: 1,
        data: { startTime: '09:00' },
      });
      expect(result).toEqual(mockShift);
    });
  });

  describe('remove', () => {
    it('should remove a shift', async () => {
      mockService.remove.mockResolvedValueOnce(mockShift);
      const result = await controller.remove(1);
      expect(result).toEqual(mockShift);
    });
  });
});
