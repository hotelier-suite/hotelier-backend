import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import {
  AttendanceDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  AttendanceStatus,
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

    const created = await this.attendanceRepository.save(data);

    const loaded = await this.attendanceRepository.findOne({
      where: { id: created.id },
      relations: { employee: true },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load attendance record with id ${created.id} after creation`,
      });
    }

    return loaded;
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
    await this.findOne(id);

    await this.attendanceRepository.update(id, data);

    return this.findOne(id);
  }

  async remove(id: number): Promise<AttendanceDto> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.delete(id);
    return attendance;
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
      status: AttendanceStatus.PRESENT,
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
