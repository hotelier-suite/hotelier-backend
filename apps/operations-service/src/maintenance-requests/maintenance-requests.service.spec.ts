import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { MaintenanceRequestsService, MaintenanceRequest } from './';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceRequestsService', () => {
  let service: MaintenanceRequestsService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceRequestsService,
        {
          provide: getRepositoryToken(MaintenanceRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceRequestsService>(
      MaintenanceRequestsService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all requests ordered by createdAt DESC', async () => {
      mockRepository.find.mockResolvedValueOnce([mockRequest]);
      const result = await service.findAll();
      expect(result).toEqual([mockRequest]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { createdAt: 'DESC' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockRequest);
      const result = await service.findOne(1);
      expect(result).toEqual(mockRequest);
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
    it('should create and save a request', async () => {
      const createDto = {
        roomNumber: '101',
        type: HousekeepingMaintenanceType.PLUMBING,
        description: 'Toilet running',
        reportedBy: 'Guest',
        roomId: 1,
      };
      mockRepository.create.mockReturnValueOnce(mockRequest);
      mockRepository.save.mockResolvedValueOnce(mockRequest);
      const result = await service.create(createDto);
      expect(result).toEqual(mockRequest);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing request', async () => {
      const updateDto = {
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      };
      const updated = {
        ...mockRequest,
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      };
      mockRepository.findOne.mockResolvedValueOnce(mockRequest);
      mockRepository.create.mockReturnValueOnce(mockRequest);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
    });

    it('should throw RpcException when request not found for update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { notes: 'test' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a request', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockRequest);
      mockRepository.create.mockReturnValueOnce(mockRequest);
      mockRepository.remove.mockResolvedValueOnce(mockRequest);
      const result = await service.remove(1);
      expect(result).toEqual(mockRequest);
    });

    it('should throw RpcException when request not found for remove', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
