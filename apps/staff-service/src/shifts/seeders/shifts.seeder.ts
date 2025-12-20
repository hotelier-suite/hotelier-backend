import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities/shift.entity';
import { ShiftType } from '@app/contracts/staff-service/shifts/enums/shift-type.enum';
import { ShiftStatus } from '@app/contracts/staff-service/shifts/enums/shift-status.enum';
import { Employee } from '../../employees/entities/employee.entity';

@Injectable()
export class ShiftsSeeder {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async seed(): Promise<void> {
    const employees = await this.employeeRepository.find();

    if (employees.length === 0) {
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const shiftsData = [
      {
        date: today,
        startTime: '08:00',
        endTime: '16:00',
        type: ShiftType.MORNING,
        status: ShiftStatus.ACTIVE,
        position: 'Cleaning Supervisor',
        department: 'Housekeeping',
        notes: 'Morning shift - general supervision',
        employeeId: employees[0].id,
      },
      {
        date: today,
        startTime: '09:00',
        endTime: '17:00',
        type: ShiftType.MORNING,
        status: ShiftStatus.ACTIVE,
        position: 'Front Desk Agent',
        department: 'Reception',
        notes: 'Morning customer service',
        employeeId: employees[1]?.id || employees[0].id,
      },
      {
        date: today,
        startTime: '08:30',
        endTime: '16:30',
        type: ShiftType.MORNING,
        status: ShiftStatus.COMPLETED,
        position: 'Housekeeper',
        department: 'Housekeeping',
        notes: 'Room cleaning - shift completed',
        employeeId: employees[2]?.id || employees[0].id,
      },
      {
        date: today,
        startTime: '22:00',
        endTime: '06:00',
        type: ShiftType.NIGHT,
        status: ShiftStatus.SCHEDULED,
        position: 'Security Guard',
        department: 'Security',
        notes: 'Night surveillance',
        employeeId: employees[5]?.id || employees[0].id,
      },
      {
        date: tomorrow,
        startTime: '08:00',
        endTime: '16:00',
        type: ShiftType.MORNING,
        status: ShiftStatus.SCHEDULED,
        position: 'Cleaning Supervisor',
        department: 'Housekeeping',
        notes: 'Scheduled morning shift',
        employeeId: employees[0].id,
      },
      {
        date: tomorrow,
        startTime: '09:00',
        endTime: '17:00',
        type: ShiftType.MORNING,
        status: ShiftStatus.SCHEDULED,
        position: 'Front Desk Agent',
        department: 'Reception',
        notes: 'Reception morning shift',
        employeeId: employees[1]?.id || employees[0].id,
      },
      {
        date: tomorrow,
        startTime: '14:00',
        endTime: '22:00',
        type: ShiftType.EVENING,
        status: ShiftStatus.SCHEDULED,
        position: 'Maintenance Technician',
        department: 'Maintenance',
        notes: 'Afternoon maintenance',
        employeeId: employees[3]?.id || employees[0].id,
      },
      {
        date: tomorrow,
        startTime: '18:00',
        endTime: '02:00',
        type: ShiftType.EVENING,
        status: ShiftStatus.SCHEDULED,
        position: 'Waitress',
        department: 'Restaurant',
        notes: 'Dinner service',
        employeeId: employees[4]?.id || employees[0].id,
      },
      {
        date: dayAfterTomorrow,
        startTime: '08:00',
        endTime: '16:00',
        type: ShiftType.MORNING,
        status: ShiftStatus.SCHEDULED,
        position: 'Housekeeper',
        department: 'Housekeeping',
        notes: 'Morning cleaning',
        employeeId: employees[2]?.id || employees[0].id,
      },
      {
        date: dayAfterTomorrow,
        startTime: '16:00',
        endTime: '00:00',
        type: ShiftType.EVENING,
        status: ShiftStatus.SCHEDULED,
        position: 'Security Guard',
        department: 'Security',
        notes: 'Evening security shift',
        employeeId: employees[5]?.id || employees[0].id,
      },
    ];

    for (const shiftData of shiftsData) {
      const existingShift = await this.shiftRepository.findOne({
        where: {
          employeeId: shiftData.employeeId,
          date: shiftData.date,
          startTime: shiftData.startTime,
        },
      });

      if (!existingShift) {
        const shift = this.shiftRepository.create(shiftData);
        await this.shiftRepository.save(shift);
      }
    }
  }
}
