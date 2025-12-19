import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftStatus } from './enums/shift-status.enum';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';
import { NotificationType } from '@app/contracts/notifications-service/notifications/enums/notification-type.enum';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(): Promise<Shift[]> {
    return this.shiftRepository.find({
      order: { date: 'DESC' },
      relations: { employee: true },
    });
  }

  async findOne(id: number): Promise<Shift | null> {
    return this.shiftRepository.findOne({
      where: { id },
      relations: { employee: true },
    });
  }

  async findByEmployee(employeeId: number): Promise<Shift[]> {
    return this.shiftRepository.find({
      where: { employeeId },
      order: { date: 'DESC' },
      relations: { employee: true },
    });
  }

  async findByDate(date: Date): Promise<Shift[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.shiftRepository.find({
      where: {
        date: Between(startOfDay, endOfDay),
      },
      order: { startTime: 'ASC' },
      relations: { employee: true },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Shift[]> {
    return this.shiftRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: { employee: true },
      order: { date: 'DESC' },
    });
  }

  async findByStatus(status: ShiftStatus): Promise<Shift[]> {
    return this.shiftRepository.find({
      where: { status },
      order: { date: 'ASC' },
      relations: { employee: true },
    });
  }

  async create(data: CreateShiftDto): Promise<Shift> {
    // Check for shift conflicts
    await this.checkShiftConflicts(
      data.employeeId,
      data.date,
      data.startTime,
      data.endTime,
    );

    const shift = await this.shiftRepository.save(data);

    // Send notification for new shift assignment
    this.notificationsService
      .create({
        title: 'New Shift Assigned',
        message: `A shift has been assigned for ${shift.date.toLocaleDateString()} from ${shift.startTime} to ${shift.endTime}`,
        type: NotificationType.INFO,
        refId: shift.employeeId,
        refType: 'employee',
      })
      .subscribe({
        error: (error) => {
          console.error('Error sending shift notification:', error);
        },
      });

    return shift;
  }

  async update(id: number, data: UpdateShiftDto): Promise<Shift> {
    const existingShift = await this.findOne(id);
    if (!existingShift) {
      throw new NotFoundException(`Shift with id ${id} not found`);
    }

    await this.shiftRepository.update(id, data);
    const updated = await this.findOne(id);
    return updated!;
  }

  async remove(id: number): Promise<Shift> {
    const shift = await this.findOne(id);
    if (!shift) {
      throw new NotFoundException(`Shift with id ${id} not found`);
    }
    await this.shiftRepository.remove(shift);
    return shift;
  }

  async findByDepartment(department: string): Promise<Shift[]> {
    return this.shiftRepository.find({
      where: { department },
      order: { date: 'DESC' },
      relations: { employee: true },
    });
  }

  async getWeeklySchedule(startDate: Date): Promise<Shift[]> {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return this.findByDateRange(startDate, endDate);
  }

  async getShiftStatistics(): Promise<{
    totalShifts: number;
    activeShifts: number;
    completedShifts: number;
    upcomingShifts: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalShifts, activeShifts, completedShifts, upcomingShifts] =
      await Promise.all([
        this.shiftRepository.count(),
        this.shiftRepository.count({ where: { status: ShiftStatus.ACTIVE } }),
        this.shiftRepository.count({
          where: { status: ShiftStatus.COMPLETED },
        }),
        this.shiftRepository.count({
          where: {
            date: MoreThan(today),
            status: ShiftStatus.SCHEDULED,
          },
        }),
      ]);

    return {
      totalShifts,
      activeShifts,
      completedShifts,
      upcomingShifts,
    };
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
      throw new ConflictException(
        `Employee already has a shift scheduled from ${conflictingShift.startTime} to ${conflictingShift.endTime} on this date`,
      );
    }
  }
}
