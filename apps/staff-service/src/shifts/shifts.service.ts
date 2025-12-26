import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  ShiftDto,
  CreateShiftDto,
  UpdateShiftDto,
  ShiftStatus,
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

  findAll(): Promise<ShiftDto[]> {
    return this.shiftRepository.find({
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

  findByEmployee(employeeId: number): Promise<ShiftDto[]> {
    return this.shiftRepository.find({
      where: { employeeId },
      order: { date: 'DESC' },
      relations: { employee: true },
    });
  }

  findByDate(date: Date): Promise<ShiftDto[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.shiftRepository.find({
      where: { date: Between(startOfDay, endOfDay) },
      order: { startTime: 'ASC' },
      relations: { employee: true },
    });
  }

  findByDateRange(startDate: Date, endDate: Date): Promise<ShiftDto[]> {
    return this.shiftRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: { employee: true },
      order: { date: 'DESC' },
    });
  }

  findByStatus(status: ShiftStatus): Promise<ShiftDto[]> {
    return this.shiftRepository.find({
      where: { status },
      order: { date: 'ASC' },
      relations: { employee: true },
    });
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

    const created = await this.shiftRepository.save(data);

    const loaded = await this.shiftRepository.findOne({
      where: { id: created.id },
      relations: { employee: true },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load shift with id ${created.id} after creation`,
      });
    }

    this.notificationsService
      .create({
        title: 'New Shift Assigned',
        message: `A shift has been assigned for ${loaded.date.toLocaleDateString()} from ${loaded.startTime} to ${loaded.endTime}`,
        type: NotificationType.INFO,
        refId: loaded.employeeId,
        refType: 'employee',
        userId: null,
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return loaded;
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
