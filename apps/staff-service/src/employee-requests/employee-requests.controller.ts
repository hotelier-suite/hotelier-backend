import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  EMPLOYEE_REQUESTS_PATTERNS,
  EmployeeRequestDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  RequestStatus,
  RequestType,
} from '@app/contracts/staff-service';
import { EmployeeRequestsService } from './employee-requests.service';

@Controller()
export class EmployeeRequestsController {
  constructor(
    private readonly employeeRequestsService: EmployeeRequestsService,
  ) {}

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_ALL)
  findAll(): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findAll();
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_ID)
  findOne(@Payload() id: number): Promise<EmployeeRequestDto> {
    return this.employeeRequestsService.findOne(id);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_EMPLOYEE)
  findByEmployee(@Payload() employeeId: number): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findByEmployee(employeeId);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_STATUS)
  findByStatus(
    @Payload() status: RequestStatus,
  ): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findByStatus(status);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_TYPE)
  findByType(@Payload() type: RequestType): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findByType(type);
  }

  @MessagePattern(EMPLOYEE_REQUESTS_PATTERNS.FIND_BY_DATE_RANGE)
  findByDateRange(
    @Payload() payload: { startDate: string | Date; endDate: string | Date },
  ): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findByDateRange(
      payload.startDate,
      payload.endDate,
    );
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
