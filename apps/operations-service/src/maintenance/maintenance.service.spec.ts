import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { MaintenanceService, GeneralMaintenanceRequest } from './';
import {
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from '@app/contracts/operations-service';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getRepositoryToken(GeneralMaintenanceRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
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
        title: 'Fix AC',
        type: MaintenanceType.CORRECTIVE,
        priority: MaintenancePriority.HIGH,
        location: 'Room 205',
      };
      mockRepository.create.mockReturnValueOnce(mockRequest);
      mockRepository.save.mockResolvedValueOnce(mockRequest);
      const result = await service.create(createDto);
      expect(result).toEqual(mockRequest);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('update', () => {
    it('should update an existing request', async () => {
      const updateDto = { description: 'Updated desc' };
      const updated = { ...mockRequest, description: 'Updated desc' };
      mockRepository.findOne.mockResolvedValueOnce(mockRequest);
      mockRepository.create.mockReturnValueOnce(mockRequest);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
    });

    it('should set startedAt when status changes to IN_PROGRESS', async () => {
      const existingWithoutStarted = { ...mockRequest, startedAt: undefined };
      const updateDto = { status: MaintenanceStatus.IN_PROGRESS };
      mockRepository.findOne.mockResolvedValueOnce(existingWithoutStarted);
      mockRepository.create.mockReturnValueOnce(existingWithoutStarted);
      mockRepository.merge.mockReturnValueOnce({
        ...existingWithoutStarted,
        status: MaintenanceStatus.IN_PROGRESS,
      });
      mockRepository.save.mockResolvedValueOnce({
        ...existingWithoutStarted,
        status: MaintenanceStatus.IN_PROGRESS,
      });
      await service.update(1, updateDto);
      expect(updateDto).toHaveProperty('startedAt');
    });

    it('should not overwrite startedAt if already set', async () => {
      const existingStarted = new Date(2024, 5, 10);
      const existingWithStarted = {
        ...mockRequest,
        startedAt: existingStarted,
      };
      const updateDto = { status: MaintenanceStatus.IN_PROGRESS };
      mockRepository.findOne.mockResolvedValueOnce(existingWithStarted);
      mockRepository.create.mockReturnValueOnce(existingWithStarted);
      mockRepository.merge.mockReturnValueOnce(existingWithStarted);
      mockRepository.save.mockResolvedValueOnce(existingWithStarted);
      await service.update(1, updateDto);
      expect(updateDto).not.toHaveProperty('startedAt');
    });

    it('should set completedAt when status changes to COMPLETED', async () => {
      const existingWithoutCompleted = {
        ...mockRequest,
        completedAt: undefined,
        status: MaintenanceStatus.IN_PROGRESS,
      };
      const updateDto = { status: MaintenanceStatus.COMPLETED };
      mockRepository.findOne.mockResolvedValueOnce(existingWithoutCompleted);
      mockRepository.create.mockReturnValueOnce(existingWithoutCompleted);
      mockRepository.merge.mockReturnValueOnce({
        ...existingWithoutCompleted,
        status: MaintenanceStatus.COMPLETED,
      });
      mockRepository.save.mockResolvedValueOnce({
        ...existingWithoutCompleted,
        status: MaintenanceStatus.COMPLETED,
      });
      await service.update(1, updateDto);
      expect(updateDto).toHaveProperty('completedAt');
    });

    it('should not overwrite completedAt if already set', async () => {
      const completedDate = new Date(2024, 5, 12);
      const existingWithCompleted = {
        ...mockRequest,
        completedAt: completedDate,
      };
      const updateDto = { status: MaintenanceStatus.COMPLETED };
      mockRepository.findOne.mockResolvedValueOnce(existingWithCompleted);
      mockRepository.create.mockReturnValueOnce(existingWithCompleted);
      mockRepository.merge.mockReturnValueOnce(existingWithCompleted);
      mockRepository.save.mockResolvedValueOnce(existingWithCompleted);
      await service.update(1, updateDto);
      expect(updateDto).not.toHaveProperty('completedAt');
    });

    it('should throw RpcException when request not found for update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(
        service.update(999, { description: 'test' }),
      ).rejects.toThrow(RpcException);
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
