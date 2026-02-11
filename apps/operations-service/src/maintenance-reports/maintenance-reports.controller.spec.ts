import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceReportsController, MaintenanceReportsService } from './';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceReportsController', () => {
  let controller: MaintenanceReportsController;
  let service: MaintenanceReportsService;

  const mockReport = {
    id: 1,
    reportNumber: 'MR-001',
    type: HousekeepingMaintenanceType.PLUMBING,
    description: 'Leaky faucet in bathroom',
    priority: TaskPriority.HIGH,
    status: HousekeepingMaintenanceStatus.PENDING,
    reportedBy: 'Maria Garcia',
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
      controllers: [MaintenanceReportsController],
      providers: [
        { provide: MaintenanceReportsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<MaintenanceReportsController>(
      MaintenanceReportsController,
    );
    service = module.get<MaintenanceReportsService>(MaintenanceReportsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all maintenance reports', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockReport]);
      const result = await controller.findAll();
      expect(result).toEqual([mockReport]);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single maintenance report', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockReport);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a maintenance report', async () => {
      const createDto = {
        type: HousekeepingMaintenanceType.PLUMBING,
        description: 'Leaky faucet',
        reportedBy: 'Maria Garcia',
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.create(createDto);
      expect(result).toEqual(mockReport);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a maintenance report', async () => {
      const updateDto = { status: HousekeepingMaintenanceStatus.IN_PROGRESS };
      const updated = {
        ...mockReport,
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a maintenance report', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.remove(1);
      expect(result).toEqual(mockReport);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
