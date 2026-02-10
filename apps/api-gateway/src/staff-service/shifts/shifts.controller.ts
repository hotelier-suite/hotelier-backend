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
import {
  CreateShiftDto,
  FindShiftsFilterDto,
  ShiftDto,
  UpdateShiftDto,
} from '@app/contracts/staff-service';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';
import { ShiftsService } from './shifts.service';

@ApiTags('shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Shifts',
    description:
      'Retrieve all shifts with employee information. Optionally filter by employee ID, date, date range, or status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Shifts retrieved successfully',
    type: [ShiftDto],
  })
  findAll(@Query() filters: FindShiftsFilterDto): Observable<ShiftDto[]> {
    return this.shiftsService.findAll(filters);
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
