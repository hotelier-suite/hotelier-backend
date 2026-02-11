import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { CleaningTasksService, CleaningTask } from './';
import { CleaningStatus } from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('CleaningTasksService', () => {
  let service: CleaningTasksService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockTask = {
    id: 1,
    roomNumber: '101',
    status: CleaningStatus.PENDING,
    assignedEmployee: 'Maria Garcia',
    notes: 'Standard cleaning',
    priority: TaskPriority.NORMAL,
    roomId: 1,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningTasksService,
        {
          provide: getRepositoryToken(CleaningTask),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CleaningTasksService>(CleaningTasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks ordered by createdAt DESC', async () => {
      mockRepository.find.mockResolvedValueOnce([mockTask]);
      const result = await service.findAll();
      expect(result).toEqual([mockTask]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { createdAt: 'DESC' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockTask);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
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
    it('should create and save a task', async () => {
      const createDto = {
        roomNumber: '101',
        roomId: 1,
        priority: TaskPriority.NORMAL,
      };
      mockRepository.create.mockReturnValueOnce(mockTask);
      mockRepository.save.mockResolvedValueOnce(mockTask);
      const result = await service.create(createDto);
      expect(result).toEqual(mockTask);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const updateDto = { notes: 'Updated notes' };
      const updated = { ...mockTask, notes: 'Updated notes' };
      mockRepository.findOne.mockResolvedValueOnce(mockTask);
      mockRepository.create.mockReturnValueOnce(mockTask);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
    });

    it('should throw RpcException when task not found for update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { notes: 'test' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockTask);
      mockRepository.create.mockReturnValueOnce(mockTask);
      mockRepository.remove.mockResolvedValueOnce(mockTask);
      const result = await service.remove(1);
      expect(result).toEqual(mockTask);
    });

    it('should throw RpcException when task not found for remove', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
