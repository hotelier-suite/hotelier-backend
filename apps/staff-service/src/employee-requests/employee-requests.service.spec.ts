import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { EmployeeRequestsService, EmployeeRequest } from './';
import { Employee } from '../employees';
import { EmployeeRequestStatus } from '@app/contracts/staff-service';

describe('EmployeeRequestsService', () => {
  let service: EmployeeRequestsService;
  const mockRequestRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };
  const mockEmployeeRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
  };

  const mockEmployee = {
    id: 1,
    employeeId: 'EMP001',
    name: 'John Doe',
  };

  const mockRequest = {
    id: 1,
    type: 'VACATION',
    reason: 'Family vacation',
    startDate: new Date(2024, 5, 15),
    endDate: new Date(2024, 5, 20),
    days: 5,
    status: EmployeeRequestStatus.PENDING,
    employeeId: 1,
    employee: mockEmployee,
    createdAt: new Date(2024, 5, 10),
    updatedAt: new Date(2024, 5, 10),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeRequestsService,
        {
          provide: getRepositoryToken(EmployeeRequest),
          useValue: mockRequestRepo,
        },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
      ],
    }).compile();

    service = module.get<EmployeeRequestsService>(EmployeeRequestsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([mockRequest]);
      const result = await service.findAll({});
      expect(result).toEqual([mockRequest]);
    });

    it('should filter by employeeId', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([mockRequest]);
      const result = await service.findAll({ employeeId: 1 });
      expect(result).toEqual([mockRequest]);
    });

    it('should filter by status', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([mockRequest]);
      const result = await service.findAll({
        status: EmployeeRequestStatus.PENDING,
      });
      expect(result).toEqual([mockRequest]);
    });

    it('should filter by type', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([mockRequest]);
      const result = await service.findAll({ type: 'VACATION' as never });
      expect(result).toEqual([mockRequest]);
    });

    it('should filter by date range', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });

    it('should filter by startDate only', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
      });
      expect(result).toEqual([]);
    });

    it('should filter by endDate only', async () => {
      mockRequestRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      mockRequestRepo.findOne.mockResolvedValueOnce(mockRequest);
      const result = await service.findOne(1);
      expect(result).toEqual(mockRequest);
    });

    it('should throw RpcException when not found', async () => {
      mockRequestRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a request', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockRequestRepo.create.mockReturnValueOnce(mockRequest);
      mockRequestRepo.save.mockResolvedValueOnce(mockRequest);
      const result = await service.create({
        employeeId: 1,
        type: 'VACATION' as never,
        reason: 'Family vacation',
        startDate: new Date(2024, 5, 15),
        endDate: new Date(2024, 5, 20),
        days: 5,
      });
      expect(result).toEqual(mockRequest);
    });

    it('should throw when employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(null);
      await expect(
        service.create({
          employeeId: 999,
          type: 'VACATION' as never,
          reason: 'Vacation',
          startDate: new Date(2024, 5, 15),
          endDate: new Date(2024, 5, 20),
          days: 5,
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      const updated = { ...mockRequest, approvedBy: 'Manager' };
      mockRequestRepo.findOne.mockResolvedValueOnce(mockRequest);
      mockRequestRepo.create.mockReturnValueOnce(mockRequest);
      mockRequestRepo.merge.mockReturnValueOnce(updated);
      mockRequestRepo.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { approvedBy: 'Manager' });
      expect(result).toEqual(updated);
    });
  });

  describe('approve', () => {
    it('should approve a request', async () => {
      const approved = {
        ...mockRequest,
        status: EmployeeRequestStatus.APPROVED,
        approvedBy: 'Manager',
      };
      mockRequestRepo.findOne.mockResolvedValueOnce(mockRequest);
      mockRequestRepo.create.mockReturnValueOnce(mockRequest);
      mockRequestRepo.merge.mockReturnValueOnce(approved);
      mockRequestRepo.save.mockResolvedValueOnce(approved);
      const result = await service.approve(1, 'Manager');
      expect(result.status).toBe(EmployeeRequestStatus.APPROVED);
      expect(result.approvedBy).toBe('Manager');
    });
  });

  describe('reject', () => {
    it('should reject a request', async () => {
      const rejected = {
        ...mockRequest,
        status: EmployeeRequestStatus.REJECTED,
      };
      mockRequestRepo.findOne.mockResolvedValueOnce(mockRequest);
      mockRequestRepo.create.mockReturnValueOnce(mockRequest);
      mockRequestRepo.merge.mockReturnValueOnce(rejected);
      mockRequestRepo.save.mockResolvedValueOnce(rejected);
      const result = await service.reject(1);
      expect(result.status).toBe(EmployeeRequestStatus.REJECTED);
    });
  });

  describe('remove', () => {
    it('should remove a request', async () => {
      mockRequestRepo.findOne.mockResolvedValueOnce(mockRequest);
      mockRequestRepo.create.mockReturnValueOnce(mockRequest);
      mockRequestRepo.remove.mockResolvedValueOnce(mockRequest);
      const result = await service.remove(1);
      expect(result).toEqual(mockRequest);
    });
  });
});
