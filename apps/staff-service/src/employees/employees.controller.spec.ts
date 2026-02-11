import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController, EmployeesService } from './';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDepartmentStats: jest.fn(),
  };

  const mockEmployee = {
    id: 1,
    employeeId: 'EMP001',
    name: 'Mary Johnson',
    department: 'HOUSEKEEPING',
    position: 'Supervisor',
    status: 'ACTIVE',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [{ provide: EmployeesService, useValue: mockService }],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      mockService.findAll.mockResolvedValueOnce([mockEmployee]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockEmployee]);
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      mockService.findOne.mockResolvedValueOnce(mockEmployee);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('getDepartmentStats', () => {
    it('should return department stats', async () => {
      const stats = [
        { department: 'HOUSEKEEPING', activeCount: 5, totalCount: 7 },
      ];
      mockService.getDepartmentStats.mockResolvedValueOnce(stats);
      const result = await controller.getDepartmentStats();
      expect(result).toEqual(stats);
    });
  });

  describe('create', () => {
    it('should create an employee', async () => {
      mockService.create.mockResolvedValueOnce(mockEmployee);
      const result = await controller.create({
        employeeId: 'EMP001',
        name: 'Mary Johnson',
        department: 'HOUSEKEEPING' as never,
        position: 'Supervisor',
      });
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      mockService.update.mockResolvedValueOnce(mockEmployee);
      const result = await controller.update({
        id: 1,
        data: { name: 'Updated' },
      });
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      mockService.remove.mockResolvedValueOnce(mockEmployee);
      const result = await controller.remove(1);
      expect(result).toEqual(mockEmployee);
    });
  });
});
