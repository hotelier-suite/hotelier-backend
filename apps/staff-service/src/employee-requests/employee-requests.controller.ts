import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  EMPLOYEE_REQUESTS_PATTERNS,
  EmployeeRequestDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  FindEmployeeRequestsFilterDto,
} from '@app/contracts/staff-service';
import { EmployeeRequestsService } from './employee-requests.service';

@Controller()
export class EmployeeRequestsController {
  constructor(
    private readonly employeeRequestsService: EmployeeRequestsService,
  ) {}

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_ALL)
  findAll(
    @Payload() filters: FindEmployeeRequestsFilterDto,
  ): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findAll(filters);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.findOne(id);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateEmployeeRequestDto,
  ): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.create(data);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateEmployeeRequestDto },
  ): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.update(payload.id, payload.data);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.APPROVE)
  approve(
    @Payload() payload: { id: number; approvedBy: string },
  ): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.approve(payload.id, payload.approvedBy);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.REJECT)
  reject(@Payload() id: number): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.reject(id);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.remove(id);
  }
}
