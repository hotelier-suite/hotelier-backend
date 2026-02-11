import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { ShiftsService, Shift } from './';
import { Employee } from '../employees';
import { NotificationsService } from '../notifications-service';

describe('ShiftsService', () => {
  let service: ShiftsService;

  const mockQb: Record<string, jest.Mock> = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockShiftRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQb),
  };

  const mockEmployeeRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };

  const mockEmployee = {
    id: 1,
    employeeId: 'EMP001',
    name: 'Mary Johnson',
    department: 'HOUSEKEEPING',
    position: 'Supervisor',
  };

  const mockShift = {
    id: 1,
    date: new Date(2024, 5, 17),
    startTime: '08:00',
    endTime: '16:00',
    type: 'MORNING',
    status: 'SCHEDULED',
    position: 'Supervisor',
    department: 'Housekeeping',
    employeeId: 1,
    employee: mockEmployee,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        { provide: getRepositoryToken(Shift), useValue: mockShiftRepo },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<ShiftsService>(ShiftsService);
    jest.clearAllMocks();
    mockQb.where.mockReturnThis();
    mockQb.andWhere.mockReturnThis();
    mockShiftRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockNotificationsService.create.mockReturnValue({ subscribe: jest.fn() });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all shifts', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([mockShift]);
      const result = await service.findAll({});
      expect(result).toEqual([mockShift]);
    });

    it('should filter by employeeId', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([mockShift]);
      const result = await service.findAll({ employeeId: 1 });
      expect(result).toEqual([mockShift]);
    });

    it('should filter by status', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([mockShift]);
      const result = await service.findAll({ status: 'SCHEDULED' as never });
      expect(result).toEqual([mockShift]);
    });

    it('should filter by single date', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([mockShift]);
      const result = await service.findAll({ date: new Date(2024, 5, 17) });
      expect(result).toEqual([mockShift]);
    });

    it('should filter by date range', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });

    it('should filter by startDate only', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
      });
      expect(result).toEqual([]);
    });

    it('should filter by endDate only', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });

    it('should return all shifts with no filters', async () => {
      mockShiftRepo.find.mockResolvedValueOnce([mockShift]);
      const result = await service.findAll();
      expect(result).toEqual([mockShift]);
    });
  });

  describe('findOne', () => {
    it('should return a shift by id', async () => {
      mockShiftRepo.findOne.mockResolvedValueOnce(mockShift);
      const result = await service.findOne(1);
      expect(result).toEqual(mockShift);
    });

    it('should throw RpcException when not found', async () => {
      mockShiftRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a shift', async () => {
      const dto = {
        date: new Date(2024, 5, 17),
        startTime: '08:00',
        endTime: '16:00',
        type: 'MORNING' as never,
        status: 'SCHEDULED' as never,
        position: 'Supervisor',
        department: 'Housekeeping',
        employeeId: 1,
      };
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockQb.getOne.mockResolvedValueOnce(null); // no conflict
      mockShiftRepo.create.mockReturnValueOnce(mockShift);
      mockShiftRepo.save.mockResolvedValueOnce(mockShift);

      const result = await service.create(dto);
      expect(result).toEqual(mockShift);
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });

    it('should throw when employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(null);
      await expect(
        service.create({
          date: new Date(2024, 5, 17),
          startTime: '08:00',
          endTime: '16:00',
          type: 'MORNING' as never,
          status: 'SCHEDULED' as never,
          position: 'Supervisor',
          department: 'Housekeeping',
          employeeId: 999,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when shift conflict exists', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockQb.getOne.mockResolvedValueOnce(mockShift); // conflict found

      await expect(
        service.create({
          date: new Date(2024, 5, 17),
          startTime: '08:00',
          endTime: '16:00',
          type: 'MORNING' as never,
          status: 'SCHEDULED' as never,
          position: 'Supervisor',
          department: 'Housekeeping',
          employeeId: 1,
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a shift', async () => {
      const updated = { ...mockShift, startTime: '09:00' };
      mockShiftRepo.findOne.mockResolvedValueOnce(mockShift);
      mockShiftRepo.create.mockReturnValueOnce(mockShift);
      mockShiftRepo.merge.mockReturnValueOnce(updated);
      mockShiftRepo.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { startTime: '09:00' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a shift', async () => {
      mockShiftRepo.findOne.mockResolvedValueOnce(mockShift);
      mockShiftRepo.create.mockReturnValueOnce(mockShift);
      mockShiftRepo.remove.mockResolvedValueOnce(mockShift);
      const result = await service.remove(1);
      expect(result).toEqual(mockShift);
    });
  });
});
