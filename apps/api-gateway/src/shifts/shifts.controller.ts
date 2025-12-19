import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { Shift } from './entities/shift.entity';
import { ShiftStatus } from './enums/shift-status.enum';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditAction } from '../audit/enums/audit-action.enum';
import { AuditResource } from '../audit/enums/audit-resource.enum';

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
    type: [Shift],
  })
  async findAll(): Promise<Shift[]> {
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
    type: Shift,
  })
  @ApiResponse({
    status: 404,
    description: 'Shift not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Shift | null> {
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
    type: [Shift],
  })
  async findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<Shift[]> {
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
    type: [Shift],
  })
  async findByDate(@Param('date') date: string): Promise<Shift[]> {
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
    type: [Shift],
  })
  async findByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Promise<Shift[]> {
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
    type: [Shift],
  })
  async findByStatus(@Param('status') status: ShiftStatus): Promise<Shift[]> {
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
    type: Shift,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  async create(@Body() data: CreateShiftDto): Promise<Shift> {
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
    type: Shift,
  })
  @ApiResponse({
    status: 404,
    description: 'Shift not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateShiftDto,
  ): Promise<Shift> {
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
    type: Shift,
  })
  @ApiResponse({
    status: 404,
    description: 'Shift not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Shift> {
    return this.shiftsService.remove(id);
  }
}
