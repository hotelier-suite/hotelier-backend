import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { EmployeeRequestsService } from './employee-requests.service';
import {
  EmployeeRequestDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  FindEmployeeRequestsFilterDto,
  ApproveRequestDto,
} from '@app/contracts/staff-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('permissions')
@Controller('permissions')
@AuditLog({ resource: AuditResource.EMPLOYEE_REQUEST })
export class EmployeeRequestsController {
  constructor(
    private readonly employeeRequestsService: EmployeeRequestsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Employee Requests',
    description:
      'Retrieve all employee permission requests (vacation, sick leave, etc.). Optionally filter by employee ID, status, type, or date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee requests retrieved successfully',
    type: [EmployeeRequestDto],
  })
  findAll(
    @Query() filters: FindEmployeeRequestsFilterDto,
  ): Observable<EmployeeRequestDto[]> {
    return this.employeeRequestsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Employee Request by ID',
    description: 'Retrieve a specific employee request by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee request retrieved successfully',
    type: EmployeeRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee request not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<EmployeeRequestDto> {
    return this.employeeRequestsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Employee Request',
    description: 'Create a new employee permission request.',
  })
  @ApiBody({
    description: 'Employee request data',
    type: CreateEmployeeRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Employee request created successfully',
    type: EmployeeRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(
    @Body() createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Observable<EmployeeRequestDto> {
    return this.employeeRequestsService.create(createEmployeeRequestDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Employee Request',
    description: 'Update an existing employee request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee request ID',
    example: 1,
  })
  @ApiBody({
    description: 'Updated employee request data',
    type: UpdateEmployeeRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee request updated successfully',
    type: EmployeeRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee request not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Observable<EmployeeRequestDto> {
    return this.employeeRequestsService.update(id, updateEmployeeRequestDto);
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Approve Employee Request',
    description: 'Approve an employee permission request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee request ID',
    example: 1,
  })
  @ApiBody({
    description: 'Approver information',
    type: ApproveRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee request approved successfully',
    type: EmployeeRequestDto,
  })
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveRequestDto,
  ): Observable<EmployeeRequestDto> {
    return this.employeeRequestsService.approve(id, body.approvedBy);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Reject Employee Request',
    description: 'Reject an employee permission request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee request rejected successfully',
    type: EmployeeRequestDto,
  })
  reject(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<EmployeeRequestDto> {
    return this.employeeRequestsService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Employee Request',
    description: 'Delete an employee permission request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee request deleted successfully',
    type: EmployeeRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee request not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<EmployeeRequestDto> {
    return this.employeeRequestsService.remove(id);
  }
}
