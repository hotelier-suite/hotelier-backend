import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { CleaningAssignmentsService, CleaningAssignment } from './';
import { CleaningStatus } from '@app/contracts/operations-service';

describe('CleaningAssignmentsService', () => {
  let service: CleaningAssignmentsService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockAssignment = {
    id: 1,
    assignedDate: new Date(2024, 5, 15),
    status: CleaningStatus.PENDING,
    notes: 'Morning shift cleaning',
    employeeId: 1,
    roomId: 1,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningAssignmentsService,
        {
          provide: getRepositoryToken(CleaningAssignment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CleaningAssignmentsService>(
      CleaningAssignmentsService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all assignments ordered by assignedDate DESC', async () => {
      mockRepository.find.mockResolvedValueOnce([mockAssignment]);
      const result = await service.findAll();
      expect(result).toEqual([mockAssignment]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { assignedDate: 'DESC' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an assignment by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockAssignment);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAssignment);
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
    it('should create and save an assignment', async () => {
      const createDto = { roomId: 1, employeeId: 1, notes: 'Test' };
      mockRepository.create.mockReturnValueOnce(mockAssignment);
      mockRepository.save.mockResolvedValueOnce(mockAssignment);
      const result = await service.create(createDto);
      expect(result).toEqual(mockAssignment);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAssignment);
    });
  });

  describe('update', () => {
    it('should update an existing assignment', async () => {
      const updateDto = { notes: 'Updated' };
      const updated = { ...mockAssignment, notes: 'Updated' };
      mockRepository.findOne.mockResolvedValueOnce(mockAssignment);
      mockRepository.create.mockReturnValueOnce(mockAssignment);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, updateDto);
      expect(result).toEqual(updated);
    });

    it('should throw RpcException when assignment not found for update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { notes: 'test' })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an assignment', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockAssignment);
      mockRepository.create.mockReturnValueOnce(mockAssignment);
      mockRepository.remove.mockResolvedValueOnce(mockAssignment);
      const result = await service.remove(1);
      expect(result).toEqual(mockAssignment);
    });

    it('should throw RpcException when assignment not found for remove', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });
});
