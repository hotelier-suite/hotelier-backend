import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EMPLOYEES_PATTERNS } from '@app/contracts/staff-service/employees/employees.patterns';
import { EmployeeDto } from '@app/contracts/staff-service/employees/dto/employee.dto';
import { CreateEmployeeDto } from '@app/contracts/staff-service/employees/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@app/contracts/staff-service/employees/dto/update-employee.dto';
import { DepartmentStatsDto } from '@app/contracts/staff-service/employees/dto/department-stats.dto';
import { Department } from '@app/contracts/staff-service/employees/enums/department.enum';
import { EmployeesService } from './employees.service';

@Controller()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_ALL)
  findAll(): Promise<EmployeeDto[]> {
    return this.employeesService.findAll();
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_BY_ID)
  findOne(@Payload() id: number): Promise<EmployeeDto> {
    return this.employeesService.findOne(id);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_BY_DEPARTMENT)
  findByDepartment(@Payload() department: Department): Promise<EmployeeDto[]> {
    return this.employeesService.findByDepartment(department);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_HOUSEKEEPING)
  findHousekeeping(): Promise<EmployeeDto[]> {
    return this.employeesService.findHousekeeping();
  }

  @MessagePattern(EMPLOYEES_PATTERNS.GET_DEPARTMENT_STATS)
  getDepartmentStats(): Promise<DepartmentStatsDto[]> {
    return this.employeesService.getDepartmentStats();
  }

  @MessagePattern(EMPLOYEES_PATTERNS.CREATE)
  create(@Payload() data: CreateEmployeeDto): Promise<EmployeeDto> {
    return this.employeesService.create(data);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateEmployeeDto },
  ): Promise<EmployeeDto> {
    return this.employeesService.update(payload.id, payload.data);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<EmployeeDto> {
    return this.employeesService.remove(id);
  }
}
