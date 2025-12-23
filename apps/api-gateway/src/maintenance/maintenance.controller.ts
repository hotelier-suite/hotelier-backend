import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceRequestDto } from './dto/create-maintenance-request.dto';
import { UpdateMaintenanceRequestDto } from './dto/update-maintenance-request.dto';
import { GeneralMaintenanceRequest } from './entities/maintenance-request.entity';
import { MaintenanceStatus } from './enums/maintenance-status.enum';
import { MaintenancePriority } from './enums/maintenance-priority.enum';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';

@ApiTags('maintenance')
@Controller('maintenance')
@AuditLog({ resource: AuditResource.MAINTENANCE })
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Maintenance Request',
    description: 'Create a new maintenance request.',
  })
  @ApiBody({
    description: 'Maintenance request creation data',
    type: CreateMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance request created successfully',
    type: GeneralMaintenanceRequest,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(
    @Body() createMaintenanceRequestDto: CreateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    return this.maintenanceService.create(createMaintenanceRequestDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Maintenance Requests',
    description:
      'Retrieve all maintenance requests with technician and requester details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findAll(): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findAll();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get Maintenance Statistics',
    description:
      'Retrieve maintenance statistics including counts by status and priority.',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance statistics retrieved successfully',
  })
  getStats() {
    return this.maintenanceService.getMaintenanceStats();
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Get Maintenance Requests by Status',
    description: 'Retrieve maintenance requests filtered by status.',
  })
  @ApiParam({
    name: 'status',
    description: 'Maintenance status',
    enum: MaintenanceStatus,
    example: MaintenanceStatus.SCHEDULED,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findByStatus(
    @Param('status') status: MaintenanceStatus,
  ): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findByStatus(status);
  }

  @Get('priority/:priority')
  @ApiOperation({
    summary: 'Get Maintenance Requests by Priority',
    description: 'Retrieve maintenance requests filtered by priority.',
  })
  @ApiParam({
    name: 'priority',
    description: 'Maintenance priority',
    enum: MaintenancePriority,
    example: MaintenancePriority.HIGH,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findByPriority(
    @Param('priority') priority: MaintenancePriority,
  ): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findByPriority(priority);
  }

  @Get('technician/:technicianId')
  @ApiOperation({
    summary: 'Get Maintenance Requests by Technician',
    description:
      'Retrieve maintenance requests assigned to a specific technician.',
  })
  @ApiParam({
    name: 'technicianId',
    description: 'Technician ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findByTechnician(
    @Param('technicianId', ParseIntPipe) technicianId: number,
  ): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findByTechnician(technicianId);
  }

  @Get('overdue')
  @ApiOperation({
    summary: 'Get Overdue Maintenance Requests',
    description:
      'Retrieve maintenance requests that are past their scheduled date.',
  })
  @ApiResponse({
    status: 200,
    description: 'Overdue maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findOverdue(): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findOverdueRequests();
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get Upcoming Maintenance Requests',
    description:
      'Retrieve maintenance requests scheduled for the next few days.',
  })
  @ApiQuery({
    name: 'days',
    description: 'Number of days to look ahead',
    example: 7,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findUpcoming(
    @Query('days') days?: number,
  ): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findUpcomingRequests(days);
  }

  @Get('scheduled/:startDate/:endDate')
  @ApiOperation({
    summary: 'Get Maintenance Requests by Date Range',
    description: 'Retrieve maintenance requests scheduled within a date range.',
  })
  @ApiParam({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-12-01',
  })
  @ApiParam({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance requests retrieved successfully',
    type: [GeneralMaintenanceRequest],
  })
  findByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Promise<GeneralMaintenanceRequest[]> {
    return this.maintenanceService.findScheduledForDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Maintenance Request by ID',
    description: 'Retrieve a specific maintenance request by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Maintenance request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request retrieved successfully',
    type: GeneralMaintenanceRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GeneralMaintenanceRequest> {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Maintenance Request',
    description: 'Update an existing maintenance request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Maintenance request ID',
    example: 1,
  })
  @ApiBody({
    description: 'Maintenance request update data',
    type: UpdateMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request updated successfully',
    type: GeneralMaintenanceRequest,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaintenanceRequestDto: UpdateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    return this.maintenanceService.update(id, updateMaintenanceRequestDto);
  }

  @Patch(':id/assign/:technicianId')
  @ApiOperation({
    summary: 'Assign Technician to Maintenance Request',
    description: 'Assign a technician to a maintenance request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Maintenance request ID',
    example: 1,
  })
  @ApiParam({
    name: 'technicianId',
    description: 'Technician ID',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Technician assigned successfully',
    type: GeneralMaintenanceRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found',
  })
  assignTechnician(
    @Param('id', ParseIntPipe) id: number,
    @Param('technicianId', ParseIntPipe) technicianId: number,
  ): Promise<GeneralMaintenanceRequest> {
    return this.maintenanceService.assignTechnician(id, technicianId);
  }

  @Patch(':id/status/:status')
  @ApiOperation({
    summary: 'Update Maintenance Request Status',
    description: 'Update the status of a maintenance request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Maintenance request ID',
    example: 1,
  })
  @ApiParam({
    name: 'status',
    description: 'New status',
    enum: MaintenanceStatus,
    example: MaintenanceStatus.IN_PROGRESS,
  })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: GeneralMaintenanceRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: MaintenanceStatus,
  ): Promise<GeneralMaintenanceRequest> {
    return this.maintenanceService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Maintenance Request',
    description: 'Delete a maintenance request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Maintenance request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request deleted successfully',
    type: GeneralMaintenanceRequest,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GeneralMaintenanceRequest> {
    return this.maintenanceService.remove(id);
  }
}
