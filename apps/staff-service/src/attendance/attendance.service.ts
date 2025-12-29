import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  AttendanceDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  FindAttendanceFilterDto,
} from '@app/contracts/staff-service';
import { Attendance } from './entities';
import { Employee } from '../employees';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(data: CreateAttendanceDto): Promise<AttendanceDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${data.employeeId} not found`,
      });
    }

    const entity = this.attendanceRepository.create({
      ...data,
      employee,
    });
    return this.attendanceRepository.save(entity);
  }

  findAll(filters?: FindAttendanceFilterDto): Promise<AttendanceDto[]> {
    const where: FindOptionsWhere<Attendance> = {};

    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    // Single date filter
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.date = Between(startOfDay, endOfDay);
    }
    // Date range filter
    else if (filters?.startDate && filters?.endDate) {
      where.date = Between(filters.startDate, filters.endDate);
    } else if (filters?.startDate) {
      where.date = MoreThanOrEqual(filters.startDate);
    } else if (filters?.endDate) {
      where.date = LessThanOrEqual(filters.endDate);
    }

    return this.attendanceRepository.find({
      where,
      order: { date: 'DESC' },
      relations: { employee: true },
    });
  }

  async findOne(id: number): Promise<AttendanceDto> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: { employee: true },
    });

    if (!attendance) {
      throw new RpcException({
        statusCode: 404,
        message: `Attendance record with id ${id} not found`,
      });
    }

    return attendance;
  }

  async update(id: number, data: UpdateAttendanceDto): Promise<AttendanceDto> {
    const existing = await this.findOne(id);
    const entity = this.attendanceRepository.create(existing);
    const merged = this.attendanceRepository.merge(entity, data);
    return this.attendanceRepository.save(merged);
  }

  async remove(id: number): Promise<AttendanceDto> {
    const attendance = await this.findOne(id);
    const entity = this.attendanceRepository.create(attendance);
    return this.attendanceRepository.remove(entity);
  }

  async checkIn(employeeId: number, time: string): Promise<AttendanceDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${employeeId} not found`,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        date: today,
      },
      relations: { employee: true },
    });

    if (existing) {
      return this.update(existing.id, { checkIn: time });
    }

    return this.create({
      employeeId,
      date: today,
      checkIn: time,
    });
  }

  async checkOut(employeeId: number, time: string): Promise<AttendanceDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${employeeId} not found`,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        date: today,
      },
      relations: { employee: true },
    });

    if (!attendance) {
      throw new RpcException({
        statusCode: 400,
        message: 'No check-in found for today',
      });
    }

    let hoursWorked = 0;

    if (attendance.checkIn) {
      const checkInTime = new Date(`1970-01-01T${attendance.checkIn}:00`);
      const checkOutTime = new Date(`1970-01-01T${time}:00`);

      hoursWorked =
        (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    }

    return this.update(attendance.id, {
      checkOut: time,
      hoursWorked: Math.max(0, hoursWorked),
    });
  }
}
