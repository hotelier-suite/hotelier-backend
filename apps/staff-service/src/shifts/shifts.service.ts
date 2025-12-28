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
  ShiftDto,
  CreateShiftDto,
  UpdateShiftDto,
  FindShiftsFilterDto,
} from '@app/contracts/staff-service';
import { Shift } from './entities';
import { Employee } from '../employees';
import { NotificationsService } from '../notifications-service';
import { NotificationType } from '@app/contracts/notifications-service';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll(filters?: FindShiftsFilterDto): Promise<ShiftDto[]> {
    const where: FindOptionsWhere<Shift> = {};

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

    return this.shiftRepository.find({
      where,
      order: { date: 'DESC' },
      relations: { employee: true },
    });
  }

  async findOne(id: number): Promise<ShiftDto> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: { employee: true },
    });

    if (!shift) {
      throw new RpcException({
        statusCode: 404,
        message: `Shift with id ${id} not found`,
      });
    }

    return shift;
  }

  async create(data: CreateShiftDto): Promise<ShiftDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${data.employeeId} not found`,
      });
    }

    await this.checkShiftConflicts(
      data.employeeId,
      data.date,
      data.startTime,
      data.endTime,
    );

    const created = await this.shiftRepository.save({
      ...data,
      employee,
    });

    this.notificationsService
      .create({
        title: 'New Shift Assigned',
        message: `A shift has been assigned for ${created.date.toLocaleDateString()} from ${created.startTime} to ${created.endTime}`,
        type: NotificationType.INFO,
        refId: created.employeeId,
        refType: 'employee',
        userId: null,
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return created;
  }

  async update(id: number, data: UpdateShiftDto): Promise<ShiftDto> {
    await this.findOne(id);

    await this.shiftRepository.update(id, data);

    return this.findOne(id);
  }

  async remove(id: number): Promise<ShiftDto> {
    const shift = await this.findOne(id);
    await this.shiftRepository.delete(id);
    return shift;
  }

  private async checkShiftConflicts(
    employeeId: number,
    date: Date,
    startTime: string,
    endTime: string,
    excludeShiftId?: number,
  ): Promise<void> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const query = this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.employeeId = :employeeId', { employeeId })
      .andWhere('shift.date BETWEEN :dayStart AND :dayEnd', {
        dayStart,
        dayEnd,
      })
      .andWhere(
        `(
        (shift.startTime <= :startTime AND shift.endTime > :startTime) OR
        (shift.startTime < :endTime AND shift.endTime >= :endTime) OR
        (shift.startTime >= :startTime AND shift.endTime <= :endTime)
      )`,
        { startTime, endTime },
      );

    if (excludeShiftId) {
      query.andWhere('shift.id != :excludeShiftId', { excludeShiftId });
    }

    const conflictingShift = await query.getOne();

    if (conflictingShift) {
      throw new RpcException({
        statusCode: 409,
        message: `Employee already has a shift scheduled from ${conflictingShift.startTime} to ${conflictingShift.endTime} on this date`,
      });
    }
  }
}
