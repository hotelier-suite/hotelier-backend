import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateShiftDto } from '@app/contracts/staff-service/shifts/dto/create-shift.dto';
import { ShiftDto } from '@app/contracts/staff-service/shifts/dto/shift.dto';
import { UpdateShiftDto } from '@app/contracts/staff-service/shifts/dto/update-shift.dto';
import { ShiftStatus } from '@app/contracts/staff-service/shifts/enums/shift-status.enum';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditAction } from '../../audit/enums/audit-action.enum';
import { AuditResource } from '../../audit/enums/audit-resource.enum';
import { ShiftsService } from './shifts.service';

@ApiTags('shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Shifts',
    description:
      'Retrieve all shifts with employee information, sorted by date (newest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Shifts retrieved successfully',
    type: [ShiftDto],
  })
  findAll(): Observable<ShiftDto[]> {
    return this.shiftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Shift by ID',
    description:
      'Retrieve a specific shift by its ID with employee information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Shift ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Shift retrieved successfully',
    type: ShiftDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Shift not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ShiftDto> {
    return this.shiftsService.findOne(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({
    summary: 'Get Shifts by Employee',
    description: 'Retrieve all shifts for a specific employee.',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee shifts retrieved successfully',
    type: [ShiftDto],
  })
  findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Observable<ShiftDto[]> {
    return this.shiftsService.findByEmployee(employeeId);
  }

  @Get('date/:date')
  @ApiOperation({
    summary: 'Get Shifts by Date',
    description: 'Retrieve all shifts for a specific date.',
  })
  @ApiParam({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    type: 'string',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Shifts for date retrieved successfully',
    type: [ShiftDto],
  })
  findByDate(@Param('date') date: string): Observable<ShiftDto[]> {
    return this.shiftsService.findByDate(new Date(date));
  }

  @Get('range/:startDate/:endDate')
  @ApiOperation({
    summary: 'Get Shifts by Date Range',
    description: 'Retrieve all shifts within a specific date range.',
  })
  @ApiParam({
    name: 'startDate',
    description: 'Start date in YYYY-MM-DD format',
    type: 'string',
    example: '2024-01-15',
  })
  @ApiParam({
    name: 'endDate',
    description: 'End date in YYYY-MM-DD format',
    type: 'string',
    example: '2024-01-22',
  })
  @ApiResponse({
    status: 200,
    description: 'Shifts in date range retrieved successfully',
    type: [ShiftDto],
  })
  findByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Observable<ShiftDto[]> {
    return this.shiftsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Get Shifts by Status',
    description: 'Retrieve all shifts with a specific status.',
  })
  @ApiParam({
    name: 'status',
    description: 'Shift status',
    enum: ShiftStatus,
    example: ShiftStatus.SCHEDULED,
  })
  @ApiResponse({
    status: 200,
    description: 'Shifts with status retrieved successfully',
    type: [ShiftDto],
  })
  findByStatus(@Param('status') status: ShiftStatus): Observable<ShiftDto[]> {
    return this.shiftsService.findByStatus(status);
  }

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.SHIFT,
    description: 'Shift created',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Create Shift',
    description: 'Create a new employee shift.',
  })
  @ApiBody({
    description: 'Shift creation data',
    type: CreateShiftDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Shift created successfully',
    type: ShiftDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() data: CreateShiftDto): Observable<ShiftDto> {
    return this.shiftsService.create(data);
  }

  @Patch(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.SHIFT,
    description: 'Shift updated',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Update Shift',
    description: 'Update an existing shift (status, times, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Shift ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Shift update data',
    type: UpdateShiftDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Shift updated successfully',
    type: ShiftDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Shift not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateShiftDto,
  ): Observable<ShiftDto> {
    return this.shiftsService.update(id, data);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.SHIFT,
    description: 'Shift deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete Shift',
    description: 'Delete a shift from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Shift ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Shift deleted successfully',
    type: ShiftDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Shift not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<ShiftDto> {
    return this.shiftsService.remove(id);
  }
}
