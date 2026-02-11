import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController, AttendanceService } from './';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
  };

  const mockAttendance = {
    id: 1,
    date: new Date(2024, 5, 15),
    checkIn: '08:00',
    checkOut: '16:00',
    status: 'PRESENT',
    hoursWorked: 8,
    employeeId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [{ provide: AttendanceService, useValue: mockService }],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all attendance records', async () => {
      mockService.findAll.mockResolvedValueOnce([mockAttendance]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockAttendance]);
    });
  });

  describe('findOne', () => {
    it('should return an attendance record by id', async () => {
      mockService.findOne.mockResolvedValueOnce(mockAttendance);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('create', () => {
    it('should create an attendance record', async () => {
      mockService.create.mockResolvedValueOnce(mockAttendance);
      const result = await controller.create({
        employeeId: 1,
        date: new Date(2024, 5, 15),
        checkIn: '08:00',
      });
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('update', () => {
    it('should update an attendance record', async () => {
      mockService.update.mockResolvedValueOnce(mockAttendance);
      const result = await controller.update({
        id: 1,
        data: { checkOut: '17:00' },
      });
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('remove', () => {
    it('should remove an attendance record', async () => {
      mockService.remove.mockResolvedValueOnce(mockAttendance);
      const result = await controller.remove(1);
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('checkIn', () => {
    it('should check in an employee', async () => {
      mockService.checkIn.mockResolvedValueOnce(mockAttendance);
      const result = await controller.checkIn({
        employeeId: 1,
        time: '08:00',
      });
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('checkOut', () => {
    it('should check out an employee', async () => {
      mockService.checkOut.mockResolvedValueOnce(mockAttendance);
      const result = await controller.checkOut({
        employeeId: 1,
        time: '16:00',
      });
      expect(result).toEqual(mockAttendance);
    });
  });
});
