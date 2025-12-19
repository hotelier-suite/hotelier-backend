import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceStatus } from './enums/attendance-status.enum';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async create(data: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceRepository.save(data);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Attendance | null> {
    return this.attendanceRepository.findOne({
      where: { id },
    });
  }

  async findByEmployee(employeeId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { employeeId },
      order: { date: 'DESC' },
    });
  }

  async findByDate(date: Date): Promise<Attendance[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.attendanceRepository.find({
      where: {
        date: Between(startOfDay, endOfDay),
      },
      order: { date: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async findByStatus(status: AttendanceStatus): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { status },
      order: { date: 'DESC' },
    });
  }

  async update(id: number, data: UpdateAttendanceDto): Promise<Attendance> {
    await this.attendanceRepository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Attendance with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with id ${id} not found`);
    }
    await this.attendanceRepository.remove(attendance);
    return attendance;
  }

  async checkIn(employeeId: number, time: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        date: today,
      },
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

  async checkOut(employeeId: number, time: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        date: today,
      },
    });

    if (!attendance) {
      throw new BadRequestException('No check-in found for today');
    }

    // Calculate hours worked
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
