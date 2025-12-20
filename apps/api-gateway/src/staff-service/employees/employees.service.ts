import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EMPLOYEES_PATTERNS } from '@app/contracts/staff-service/employees/employees.patterns';
import { EmployeeDto } from '@app/contracts/staff-service/employees/dto/employee.dto';
import { CreateEmployeeDto } from '@app/contracts/staff-service/employees/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@app/contracts/staff-service/employees/dto/update-employee.dto';
import { DepartmentStatsDto } from '@app/contracts/staff-service/employees/dto/department-stats.dto';
import { Department } from '@app/contracts/staff-service/employees/enums/department.enum';
import { STAFF_SERVICE_CLIENT } from '../constants';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(STAFF_SERVICE_CLIENT)
    private readonly staffClient: ClientProxy,
  ) {}

  findAll(): Observable<EmployeeDto[]> {
    return this.staffClient.send<EmployeeDto[], Record<string, never>>(
      EMPLOYEES_PATTERNS.FIND_ALL,
      {},
    );
  }

  findByDepartment(department: Department): Observable<EmployeeDto[]> {
    return this.staffClient.send<EmployeeDto[], Department>(
      EMPLOYEES_PATTERNS.FIND_BY_DEPARTMENT,
      department,
    );
  }

  getHousekeepingEmployees(): Observable<EmployeeDto[]> {
    return this.staffClient.send<EmployeeDto[], Record<string, never>>(
      EMPLOYEES_PATTERNS.FIND_HOUSEKEEPING,
      {},
    );
  }

  getDepartmentStats(): Observable<DepartmentStatsDto[]> {
    return this.staffClient.send<DepartmentStatsDto[], Record<string, never>>(
      EMPLOYEES_PATTERNS.GET_DEPARTMENT_STATS,
      {},
    );
  }

  findOne(id: number): Observable<EmployeeDto> {
    return this.staffClient.send<EmployeeDto, number>(
      EMPLOYEES_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  create(data: CreateEmployeeDto): Observable<EmployeeDto> {
    return this.staffClient.send<EmployeeDto, CreateEmployeeDto>(
      EMPLOYEES_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateEmployeeDto): Observable<EmployeeDto> {
    return this.staffClient.send<
      EmployeeDto,
      { id: number; data: UpdateEmployeeDto }
    >(EMPLOYEES_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<EmployeeDto> {
    return this.staffClient.send<EmployeeDto, number>(
      EMPLOYEES_PATTERNS.DELETE,
      id,
    );
  }
}
