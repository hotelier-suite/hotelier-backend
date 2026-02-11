import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { MaintenanceReportsService, MaintenanceReport } from './';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceReportsService', () => {
  let service: MaintenanceReportsService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceReportsService,
        {
          provide: getRepositoryToken(MaintenanceReport),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceReportsService>(MaintenanceReportsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reports ordered by createdAt DESC', async () => {
      mockRepository.find.mockResolvedValueOnce([mockReport]);
      const result = await service.findAll();
      expect(result).toEqual([mockReport]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { createdAt: 'DESC' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a report by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockReport);
      const result = await service.findOne(1);
      expect(result).toEqual(mockReport);
      expect(mockRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save a report', async () => {
      const createDto = {
        type: HousekeepingMaintenanceType.PLUMBING,
        description: 'Leaky faucet',
        reportedBy: 'Maria Garcia',
      };
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.save.mockResolvedValueOnce(mockReport);
      const result = await service.create(createDto);
      expect(result).toEqual(mockReport);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing report', async () => {
      const updateDto = {
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      };
      const updated = {
        ...mockReport,
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      };
      mockRepository.findOne.mockResolvedValueOnce(mockReport);
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
    });

    it('should throw RpcException when report not found for update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(
        service.update(999, {
          status: HousekeepingMaintenanceStatus.COMPLETED,
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove a report', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockReport);
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.remove.mockResolvedValueOnce(mockReport);
      const result = await service.remove(1);
      expect(result).toEqual(mockReport);
    });

    it('should throw RpcException when report not found for remove', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
