import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { AttendanceService, Attendance } from './';
import { Employee } from '../employees';

describe('AttendanceService', () => {
  let service: AttendanceService;
  const mockAttendanceRepo: Record<string, jest.Mock> = {
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
    name: 'Mary Johnson',
  };

  const mockAttendance = {
    id: 1,
    date: new Date(2024, 5, 15),
    checkIn: '08:00',
    checkOut: '16:00',
    status: 'PRESENT',
    hoursWorked: 8,
    overtimeHours: 0,
    employeeId: 1,
    employee: mockEmployee,
    createdAt: new Date(2024, 5, 15),
    updatedAt: new Date(2024, 5, 15),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockAttendanceRepo,
        },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all attendance records', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([mockAttendance]);
      const result = await service.findAll({});
      expect(result).toEqual([mockAttendance]);
    });

    it('should filter by employeeId', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([mockAttendance]);
      const result = await service.findAll({ employeeId: 1 });
      expect(result).toEqual([mockAttendance]);
    });

    it('should filter by status', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([mockAttendance]);
      const result = await service.findAll({ status: 'PRESENT' as never });
      expect(result).toEqual([mockAttendance]);
    });

    it('should filter by single date', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([mockAttendance]);
      const result = await service.findAll({ date: new Date(2024, 5, 15) });
      expect(result).toEqual([mockAttendance]);
    });

    it('should filter by date range', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });

    it('should filter by startDate only', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        startDate: new Date(2024, 5, 1),
      });
      expect(result).toEqual([]);
    });

    it('should filter by endDate only', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({
        endDate: new Date(2024, 5, 30),
      });
      expect(result).toEqual([]);
    });

    it('should return all with no filters', async () => {
      mockAttendanceRepo.find.mockResolvedValueOnce([mockAttendance]);
      const result = await service.findAll();
      expect(result).toEqual([mockAttendance]);
    });
  });

  describe('findOne', () => {
    it('should return an attendance record by id', async () => {
      mockAttendanceRepo.findOne.mockResolvedValueOnce(mockAttendance);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAttendance);
    });

    it('should throw RpcException when not found', async () => {
      mockAttendanceRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create an attendance record', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.create.mockReturnValueOnce(mockAttendance);
      mockAttendanceRepo.save.mockResolvedValueOnce(mockAttendance);
      const result = await service.create({
        employeeId: 1,
        date: new Date(2024, 5, 15),
        checkIn: '08:00',
      });
      expect(result).toEqual(mockAttendance);
    });

    it('should throw when employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(null);
      await expect(
        service.create({
          employeeId: 999,
          date: new Date(2024, 5, 15),
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update an attendance record', async () => {
      const updated = { ...mockAttendance, checkOut: '17:00' };
      mockAttendanceRepo.findOne.mockResolvedValueOnce(mockAttendance);
      mockAttendanceRepo.create.mockReturnValueOnce(mockAttendance);
      mockAttendanceRepo.merge.mockReturnValueOnce(updated);
      mockAttendanceRepo.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { checkOut: '17:00' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove an attendance record', async () => {
      mockAttendanceRepo.findOne.mockResolvedValueOnce(mockAttendance);
      mockAttendanceRepo.create.mockReturnValueOnce(mockAttendance);
      mockAttendanceRepo.remove.mockResolvedValueOnce(mockAttendance);
      const result = await service.remove(1);
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('checkIn', () => {
    it('should create new attendance on check-in if none exists', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.findOne.mockResolvedValueOnce(null); // no existing
      // create path
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.create.mockReturnValueOnce(mockAttendance);
      mockAttendanceRepo.save.mockResolvedValueOnce(mockAttendance);

      const result = await service.checkIn(1, '08:00');
      expect(result).toEqual(mockAttendance);
    });

    it('should update existing attendance on check-in', async () => {
      const existing = { ...mockAttendance, id: 5, checkIn: '07:00' };
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.findOne
        .mockResolvedValueOnce(existing) // existing today
        .mockResolvedValueOnce(existing); // findOne in update
      mockAttendanceRepo.create.mockReturnValueOnce(existing);
      mockAttendanceRepo.merge.mockReturnValueOnce({
        ...existing,
        checkIn: '08:00',
      });
      mockAttendanceRepo.save.mockResolvedValueOnce({
        ...existing,
        checkIn: '08:00',
      });

      const result = await service.checkIn(1, '08:00');
      expect(result.checkIn).toBe('08:00');
    });

    it('should throw when employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.checkIn(999, '08:00')).rejects.toThrow(RpcException);
    });
  });

  describe('checkOut', () => {
    it('should check out and calculate hours worked', async () => {
      const todayAttendance = {
        ...mockAttendance,
        checkIn: '08:00',
        checkOut: undefined,
      };
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.findOne
        .mockResolvedValueOnce(todayAttendance) // today's record
        .mockResolvedValueOnce(todayAttendance); // findOne in update
      mockAttendanceRepo.create.mockReturnValueOnce(todayAttendance);
      mockAttendanceRepo.merge.mockReturnValueOnce({
        ...todayAttendance,
        checkOut: '16:00',
        hoursWorked: 8,
      });
      mockAttendanceRepo.save.mockResolvedValueOnce({
        ...todayAttendance,
        checkOut: '16:00',
        hoursWorked: 8,
      });

      const result = await service.checkOut(1, '16:00');
      expect(result.checkOut).toBe('16:00');
    });

    it('should throw when employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.checkOut(999, '16:00')).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw when no check-in found today', async () => {
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.findOne.mockResolvedValueOnce(null); // no today record
      await expect(service.checkOut(1, '16:00')).rejects.toThrow(RpcException);
    });

    it('should handle missing checkIn time', async () => {
      const todayAttendance = {
        ...mockAttendance,
        checkIn: undefined,
        checkOut: undefined,
      };
      mockEmployeeRepo.findOne.mockResolvedValueOnce(mockEmployee);
      mockAttendanceRepo.findOne
        .mockResolvedValueOnce(todayAttendance)
        .mockResolvedValueOnce(todayAttendance);
      mockAttendanceRepo.create.mockReturnValueOnce(todayAttendance);
      mockAttendanceRepo.merge.mockReturnValueOnce({
        ...todayAttendance,
        checkOut: '16:00',
        hoursWorked: 0,
      });
      mockAttendanceRepo.save.mockResolvedValueOnce({
        ...todayAttendance,
        checkOut: '16:00',
        hoursWorked: 0,
      });

      const result = await service.checkOut(1, '16:00');
      expect(result.checkOut).toBe('16:00');
    });
  });
});
