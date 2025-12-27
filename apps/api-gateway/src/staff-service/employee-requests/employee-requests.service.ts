import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  EMPLOYEE_REQUESTS_PATTERNS,
  EmployeeRequestDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  EmployeeRequestStatus,
  EmployeeRequestType,
} from '@app/contracts/staff-service';
import { STAFF_SERVICE_CLIENT } from '../constants';

@Injectable()
export class EmployeeRequestsService {
  constructor(
    @Inject(STAFF_SERVICE_CLIENT)
    private readonly staffClient: ClientProxy,
  ) {}

  findAll(): Observable<EmployeeRequestDto[]> {
    return this.staffClient.send<EmployeeRequestDto[], Record<string, never>>(
      EMPLOYEE_REQUESTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<EmployeeRequestDto> {
    return this.staffClient.send<EmployeeRequestDto, number>(
      EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  findByEmployee(employeeId: number): Observable<EmployeeRequestDto[]> {
    return this.staffClient.send<EmployeeRequestDto[], number>(
      EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_EMPLOYEE,
      employeeId,
    );
  }

  findByStatus(
    status: EmployeeRequestStatus,
  ): Observable<EmployeeRequestDto[]> {
    return this.staffClient.send<EmployeeRequestDto[], EmployeeRequestStatus>(
      EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  findByType(type: EmployeeRequestType): Observable<EmployeeRequestDto[]> {
    return this.staffClient.send<EmployeeRequestDto[], EmployeeRequestType>(
      EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_TYPE,
      type,
    );
  }

  findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Observable<EmployeeRequestDto[]> {
    return this.staffClient.send<
      EmployeeRequestDto[],
      { startDate: Date; endDate: Date }
    >(EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_DATE_RANGE, { startDate, endDate });
  }

  create(data: CreateEmployeeRequestDto): Observable<EmployeeRequestDto> {
    return this.staffClient.send<EmployeeRequestDto, CreateEmployeeRequestDto>(
      EMPLOYEE_REQUESTS_PATTERNS.CREATE,
      data,
    );
  }

  update(
    id: number,
    data: UpdateEmployeeRequestDto,
  ): Observable<EmployeeRequestDto> {
    return this.staffClient.send<
      EmployeeRequestDto,
      { id: number; data: UpdateEmployeeRequestDto }
    >(EMPLOYEE_REQUESTS_PATTERNS.UPDATE, { id, data });
  }

  approve(id: number, approvedBy: string): Observable<EmployeeRequestDto> {
    return this.staffClient.send<
      EmployeeRequestDto,
      { id: number; approvedBy: string }
    >(EMPLOYEE_REQUESTS_PATTERNS.APPROVE, { id, approvedBy });
  }

  reject(id: number): Observable<EmployeeRequestDto> {
    return this.staffClient.send<EmployeeRequestDto, number>(
      EMPLOYEE_REQUESTS_PATTERNS.REJECT,
      id,
    );
  }

  remove(id: number): Observable<EmployeeRequestDto> {
    return this.staffClient.send<EmployeeRequestDto, number>(
      EMPLOYEE_REQUESTS_PATTERNS.DELETE,
      id,
    );
  }
}
