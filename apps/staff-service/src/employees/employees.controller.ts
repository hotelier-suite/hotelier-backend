import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  EMPLOYEES_PATTERNS,
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  DepartmentStatsDto,
  FindEmployeesFilterDto,
} from '@app/contracts/staff-service';
import { EmployeesService } from './employees.service';

@Controller()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindEmployeesFilterDto): Promise<EmployeeDto[]> {
    return this.employeesService.findAll(filters);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<EmployeeDto> {
    return this.employeesService.findOne(id);
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
