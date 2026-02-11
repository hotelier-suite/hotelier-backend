import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController, MaintenanceService } from './';
import {
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from '@app/contracts/operations-service';

describe('MaintenanceController', () => {
  let controller: MaintenanceController;
  let service: MaintenanceService;

  const mockRequest = {
    id: 1,
    title: 'Fix AC in room 205',
    description: 'AC not working properly',
    type: MaintenanceType.CORRECTIVE,
    priority: MaintenancePriority.HIGH,
    status: MaintenanceStatus.SCHEDULED,
    location: 'Room 205',
    equipment: 'Air Conditioning Unit',
    estimatedDuration: 2.5,
    estimatedCost: 150.0,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [{ provide: MaintenanceService, useValue: mockService }],
    }).compile();

    controller = module.get<MaintenanceController>(MaintenanceController);
    service = module.get<MaintenanceService>(MaintenanceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all maintenance requests', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockRequest]);
      const result = await controller.findAll();
      expect(result).toEqual([mockRequest]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single maintenance request', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockRequest);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockRequest);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a maintenance request', async () => {
      const createDto = {
        title: 'Fix AC',
        type: MaintenanceType.CORRECTIVE,
        priority: MaintenancePriority.HIGH,
        location: 'Room 205',
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockRequest);
      const result = await controller.create(createDto);
      expect(result).toEqual(mockRequest);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a maintenance request', async () => {
      const updateDto = { status: MaintenanceStatus.IN_PROGRESS };
      const updated = { ...mockRequest, status: MaintenanceStatus.IN_PROGRESS };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a maintenance request', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockRequest);
      const result = await controller.remove(1);
      expect(result).toEqual(mockRequest);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
