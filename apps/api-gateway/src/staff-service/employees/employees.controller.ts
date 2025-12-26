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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  CreateEmployeeDto,
  DepartmentStatsDto,
  EmployeeDto,
  UpdateEmployeeDto,
  Department,
} from '@app/contracts/staff-service';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';
import { EmployeesService } from './employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.EMPLOYEE,
    description: 'Employee created',
    includeBody: true,
    includeResult: true,
  })
  @ApiOperation({
    summary: 'Create Employee',
    description: 'Create a new employee record.',
  })
  @ApiBody({
    description: 'Employee creation data',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    type: EmployeeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Observable<EmployeeDto> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Employees',
    description: 'Retrieve all employees, optionally filtered by department.',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    enum: Department,
    description: 'Filter employees by department',
  })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
    type: [EmployeeDto],
  })
  findAll(
    @Query('department') department?: Department,
  ): Observable<EmployeeDto[]> {
    if (department) {
      return this.employeesService.findByDepartment(department);
    }

    return this.employeesService.findAll();
  }

  @Get('housekeeping')
  @ApiOperation({
    summary: 'Get Housekeeping Employees',
    description: 'Retrieve all employees in the housekeeping department.',
  })
  @ApiResponse({
    status: 200,
    description: 'Housekeeping employees retrieved successfully',
    type: [EmployeeDto],
  })
  getHousekeepingEmployees(): Observable<EmployeeDto[]> {
    return this.employeesService.getHousekeepingEmployees();
  }

  @Get('stats/departments')
  @ApiOperation({
    summary: 'Get Department Statistics',
    description: 'Retrieve employee statistics grouped by department.',
  })
  @ApiResponse({
    status: 200,
    description: 'Department statistics retrieved successfully',
    type: [DepartmentStatsDto],
  })
  getDepartmentStats(): Observable<DepartmentStatsDto[]> {
    return this.employeesService.getDepartmentStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Employee by ID',
    description: 'Retrieve a specific employee by their ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee retrieved successfully',
    type: EmployeeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<EmployeeDto> {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.EMPLOYEE,
    description: 'Employee updated',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Update Employee',
    description: 'Update an existing employee record.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee ID',
    example: 1,
  })
  @ApiBody({
    description: 'Employee update data',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    type: EmployeeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Observable<EmployeeDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.EMPLOYEE,
    description: 'Employee deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete Employee',
    description: 'Delete an employee record.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee deleted successfully',
    type: EmployeeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<EmployeeDto> {
    return this.employeesService.remove(id);
  }
}
