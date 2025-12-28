import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeRequest } from '../entities';
import {
  EmployeeRequestType,
  EmployeeRequestStatus,
} from '@app/contracts/staff-service';
import { Employee } from '../../employees';

@Injectable()
export class EmployeeRequestsSeeder {
  constructor(
    @InjectRepository(EmployeeRequest)
    private readonly employeeRequestRepository: Repository<EmployeeRequest>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async seed(): Promise<void> {
    const employees = await this.employeeRepository.find();

    if (employees.length === 0) {
      return;
    }

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const requests: Array<
      Omit<EmployeeRequest, 'id' | 'createdAt' | 'updatedAt'>
    > = [
      {
        type: EmployeeRequestType.VACATION,
        reason: 'Family vacation - beach trip',
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
        days: 5,
        status: EmployeeRequestStatus.PENDING,
        employeeId: employees[0].id,
        employee: employees[0],
      },
      {
        type: EmployeeRequestType.VACATION,
        reason: 'Personal rest',
        startDate: nextMonth,
        endDate: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        days: 7,
        status: EmployeeRequestStatus.PENDING,
        employeeId: employees[1]?.id || employees[0].id,
        employee: employees[1] || employees[0],
      },
      {
        type: EmployeeRequestType.SICK_LEAVE,
        reason: 'Medical appointment - routine checkup',
        startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        days: 1,
        status: EmployeeRequestStatus.APPROVED,
        approvedBy: 'General Manager',
        employeeId: employees[2]?.id || employees[0].id,
        employee: employees[2] || employees[0],
      },
      {
        type: EmployeeRequestType.PERSONAL,
        reason: 'Personal matters - bank procedures',
        startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        days: 1,
        status: EmployeeRequestStatus.APPROVED,
        approvedBy: 'Area Supervisor',
        employeeId: employees[3]?.id || employees[0].id,
        employee: employees[3] || employees[0],
      },
      {
        type: EmployeeRequestType.VACATION,
        reason: 'Summer vacation',
        startDate: lastWeek,
        endDate: new Date(lastWeek.getTime() + 10 * 24 * 60 * 60 * 1000),
        days: 10,
        status: EmployeeRequestStatus.APPROVED,
        approvedBy: 'Human Resources Manager',
        employeeId: employees[4]?.id || employees[0].id,
        employee: employees[4] || employees[0],
      },
      {
        type: EmployeeRequestType.OTHER,
        reason: 'Professional conference participation',
        startDate: new Date(lastWeek.getTime() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(lastWeek.getTime() - 1 * 24 * 60 * 60 * 1000),
        days: 2,
        status: EmployeeRequestStatus.REJECTED,
        employeeId: employees[5]?.id || employees[0].id,
        employee: employees[5] || employees[0],
      },
      {
        type: EmployeeRequestType.SICK_LEAVE,
        reason: 'Medical leave - flu',
        startDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() - 11 * 24 * 60 * 60 * 1000),
        days: 3,
        status: EmployeeRequestStatus.APPROVED,
        approvedBy: 'Area Manager',
        employeeId: employees[0].id,
        employee: employees[0],
      },
      {
        type: EmployeeRequestType.PERSONAL,
        reason: 'Moving to new residence',
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
        days: 1,
        status: EmployeeRequestStatus.CANCELLED,
        employeeId: employees[1]?.id || employees[0].id,
        employee: employees[1] || employees[0],
      },
      {
        type: EmployeeRequestType.VACATION,
        reason: 'End of year vacation',
        startDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 65 * 24 * 60 * 60 * 1000),
        days: 5,
        status: EmployeeRequestStatus.PENDING,
        employeeId: employees[2]?.id || employees[0].id,
        employee: employees[2] || employees[0],
      },
      {
        type: EmployeeRequestType.SICK_LEAVE,
        reason: 'Scheduled surgery',
        startDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
        days: 7,
        status: EmployeeRequestStatus.PENDING,
        employeeId: employees[3]?.id || employees[0].id,
        employee: employees[3] || employees[0],
      },
    ];

    for (const requestData of requests) {
      const existingRequest = await this.employeeRequestRepository.findOne({
        where: {
          employeeId: requestData.employeeId,
          startDate: requestData.startDate,
          type: requestData.type,
        },
      });

      if (!existingRequest) {
        await this.employeeRequestRepository.save(requestData);
      }
    }
  }
}
