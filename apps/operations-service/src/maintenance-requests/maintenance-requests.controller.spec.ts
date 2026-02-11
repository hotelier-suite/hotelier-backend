import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceRequestsController, MaintenanceRequestsService } from './';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceRequestsController', () => {
  let controller: MaintenanceRequestsController;
  let service: MaintenanceRequestsService;

  const mockRequest = {
    id: 1,
    roomNumber: '101',
    type: HousekeepingMaintenanceType.PLUMBING,
    description: 'Toilet running constantly',
    priority: TaskPriority.HIGH,
    status: HousekeepingMaintenanceStatus.PENDING,
    reportedBy: 'Guest',
    reportDate: new Date(2024, 5, 15),
    roomId: 1,
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
      controllers: [MaintenanceRequestsController],
      providers: [
        { provide: MaintenanceRequestsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<MaintenanceRequestsController>(
      MaintenanceRequestsController,
    );
    service = module.get<MaintenanceRequestsService>(
      MaintenanceRequestsService,
    );
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
        roomNumber: '101',
        type: HousekeepingMaintenanceType.PLUMBING,
        description: 'Toilet running',
        reportedBy: 'Guest',
        roomId: 1,
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
      const updateDto = { status: HousekeepingMaintenanceStatus.IN_PROGRESS };
      const updated = {
        ...mockRequest,
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      };
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
