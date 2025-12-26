import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities';
import { AttendanceStatus } from '@app/contracts/staff-service';
import { Employee } from '../../employees';

@Injectable()
export class AttendanceSeeder {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async seed(): Promise<void> {
    const employees = await this.employeeRepository.find();

    if (employees.length === 0) {
      return;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const attendanceRecords = [
      {
        date: today,
        checkIn: '08:00',
        checkOut: undefined,
        status: AttendanceStatus.PRESENT,
        notes: 'On-time arrival - shift in progress',
        hoursWorked: 0,
        overtimeHours: 0,
        employeeId: employees[0].id,
      },
      {
        date: today,
        checkIn: '09:10',
        checkOut: undefined,
        status: AttendanceStatus.LATE,
        notes: 'Late arrival due to traffic',
        hoursWorked: 0,
        overtimeHours: 0,
        employeeId: employees[1].id,
      },
      {
        date: today,
        checkIn: '08:30',
        checkOut: undefined,
        status: AttendanceStatus.PRESENT,
        notes: 'Normal morning shift',
        hoursWorked: 0,
        overtimeHours: 0,
        employeeId: employees[2]?.id || employees[0].id,
      },
      {
        date: today,
        checkIn: undefined,
        checkOut: undefined,
        status: AttendanceStatus.SICK_LEAVE,
        notes: 'Medical leave - flu',
        hoursWorked: 0,
        overtimeHours: 0,
        employeeId: employees[3]?.id || employees[0].id,
      },
      {
        date: yesterday,
        checkIn: '08:00',
        checkOut: '16:30',
        status: AttendanceStatus.PRESENT,
        notes: 'Full workday',
        hoursWorked: 8.5,
        overtimeHours: 0.5,
        employeeId: employees[0].id,
      },
      {
        date: yesterday,
        checkIn: '09:00',
        checkOut: '17:00',
        status: AttendanceStatus.PRESENT,
        notes: 'Regular shift',
        hoursWorked: 8.0,
        overtimeHours: 0,
        employeeId: employees[1].id,
      },
      {
        date: yesterday,
        checkIn: '08:30',
        checkOut: '16:30',
        status: AttendanceStatus.PRESENT,
        notes: 'Room cleaning completed',
        hoursWorked: 8.0,
        overtimeHours: 0,
        employeeId: employees[2]?.id || employees[0].id,
      },
      {
        date: yesterday,
        checkIn: '14:00',
        checkOut: '22:30',
        status: AttendanceStatus.PRESENT,
        notes: 'Evening shift - maintenance',
        hoursWorked: 8.5,
        overtimeHours: 0.5,
        employeeId: employees[3]?.id || employees[0].id,
      },
      {
        date: yesterday,
        checkIn: '18:00',
        checkOut: '02:00',
        status: AttendanceStatus.PRESENT,
        notes: 'Night shift - dinner service',
        hoursWorked: 8.0,
        overtimeHours: 0,
        employeeId: employees[4]?.id || employees[0].id,
      },
      {
        date: yesterday,
        checkIn: '22:00',
        checkOut: '06:00',
        status: AttendanceStatus.PRESENT,
        notes: 'Night surveillance',
        hoursWorked: 8.0,
        overtimeHours: 0,
        employeeId: employees[5]?.id || employees[0].id,
      },
      {
        date: dayBeforeYesterday,
        checkIn: '08:15',
        checkOut: '16:00',
        status: AttendanceStatus.EARLY_LEAVE,
        notes: 'Early leave for medical appointment',
        hoursWorked: 7.75,
        overtimeHours: 0,
        employeeId: employees[0].id,
      },
      {
        date: dayBeforeYesterday,
        checkIn: undefined,
        checkOut: undefined,
        status: AttendanceStatus.VACATION,
        notes: 'Scheduled vacation day',
        hoursWorked: 0,
        overtimeHours: 0,
        employeeId: employees[1].id,
      },
      {
        date: dayBeforeYesterday,
        checkIn: '08:30',
        checkOut: '17:30',
        status: AttendanceStatus.PRESENT,
        notes: 'Extended shift - special event',
        hoursWorked: 9.0,
        overtimeHours: 1.0,
        employeeId: employees[2]?.id || employees[0].id,
      },
      {
        date: dayBeforeYesterday,
        checkIn: undefined,
        checkOut: undefined,
        status: AttendanceStatus.ABSENT,
        notes: 'Unexcused absence',
        hoursWorked: 0,
        overtimeHours: 0,
        employeeId: employees[3]?.id || employees[0].id,
      },
    ];

    for (const recordData of attendanceRecords) {
      const existingRecord = await this.attendanceRepository.findOne({
        where: {
          employeeId: recordData.employeeId,
          date: recordData.date,
        },
      });

      if (!existingRecord) {
        const attendance = this.attendanceRepository.create(recordData);
        await this.attendanceRepository.save(attendance);
      }
    }
  }
}
