import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { EmployeesService, Employee } from './';

describe('EmployeesService', () => {
  let service: EmployeesService;
  const mockRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockEmployee = {
    id: 1,
    employeeId: 'EMP001',
    name: 'Mary Johnson',
    department: 'HOUSEKEEPING',
    position: 'Supervisor',
    status: 'ACTIVE',
    shift: 'Morning',
    assignedRooms: 15,
    completedRooms: 14,
    currentLocation: 'Floor 2',
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getRepositoryToken(Employee), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees ordered by name', async () => {
      mockRepository.find.mockResolvedValueOnce([mockEmployee]);
      const result = await service.findAll({});
      expect(result).toEqual([mockEmployee]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { name: 'ASC' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockEmployee);
      const result = await service.findOne(1);
      expect(result).toEqual(mockEmployee);
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const dto = {
        employeeId: 'EMP001',
        name: 'Mary Johnson',
        department: 'HOUSEKEEPING' as never,
        position: 'Supervisor',
      };
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockReturnValueOnce(mockEmployee);
      mockRepository.save.mockResolvedValueOnce(mockEmployee);
      const result = await service.create(dto);
      expect(result).toEqual(mockEmployee);
    });

    it('should throw when employeeId already exists', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockEmployee);
      await expect(
        service.create({
          employeeId: 'EMP001',
          name: 'Mary Johnson',
          department: 'HOUSEKEEPING' as never,
          position: 'Supervisor',
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updated = { ...mockEmployee, name: 'Updated' };
      mockRepository.findOne.mockResolvedValueOnce(mockEmployee);
      mockRepository.create.mockReturnValueOnce(mockEmployee);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { name: 'Updated' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockEmployee);
      mockRepository.create.mockReturnValueOnce(mockEmployee);
      mockRepository.remove.mockResolvedValueOnce(mockEmployee);
      const result = await service.remove(1);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('getDepartmentStats', () => {
    it('should return department stats', async () => {
      mockRepository.count.mockResolvedValue(5);
      const result = await service.getDepartmentStats();
      expect(result.length).toBeGreaterThan(0);
      expect(mockRepository.count).toHaveBeenCalled();
    });
  });
});
