import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { HousekeepingService } from './housekeeping.service';
import { CreateMaintenanceReportDto } from './dto/create-maintenance-report.dto';
import { UpdateMaintenanceReportDto } from './dto/update-maintenance-report.dto';
import { CreateCleaningAssignmentDto } from './dto/create-cleaning-assignment.dto';
import { UpdateCleaningAssignmentDto } from './dto/update-cleaning-assignment.dto';
import { HousekeepingStatisticsDto } from './dto/housekeeping-statistics.dto';
import { MaintenanceCostsSummaryDto } from './dto/maintenance-costs-summary.dto';
import { CleaningPerformanceDto } from './dto/cleaning-performance.dto';
import { AssignTechnicianResponseDto } from './dto/assign-technician-response.dto';
import { UpdateCostResponseDto } from './dto/update-cost-response.dto';
import { QualityScoreResponseDto } from './dto/quality-score-response.dto';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import { MaintenanceReport } from './entities/maintenance-report.entity';
import { CleaningAssignment } from './entities/cleaning-assignment.entity';
import { MaintenanceType } from './enums/maintenance-type.enum';
import { MaintenanceStatus } from './enums/maintenance-status.enum';
import { CleaningStatus } from './enums/cleaning-status.enum';
import { TaskPriority } from './enums/task-priority.enum';
import { Room } from '../rooms/entities/room.entity';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';

@ApiTags('Housekeeping')
@Controller('housekeeping')
@AuditLog({ resource: AuditResource.HOUSEKEEPING })
@ApiBearerAuth()
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  // Maintenance Report endpoints
  @ApiOperation({
    summary: 'Get all maintenance reports',
    description:
      'Retrieve a list of all maintenance reports ordered by creation date',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports',
    type: [MaintenanceReport],
  })
  @Get('maintenance-reports')
  async getAllMaintenanceReports(): Promise<MaintenanceReport[]> {
    return this.housekeepingService.getAllMaintenanceReports();
  }

  @ApiOperation({
    summary: 'Get pending maintenance reports',
    description: 'Retrieve all maintenance reports with pending status',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved pending maintenance reports',
    type: [MaintenanceReport],
  })
  @Get('maintenance-reports/pending')
  async getPendingMaintenanceReports(): Promise<MaintenanceReport[]> {
    return this.housekeepingService.getPendingMaintenanceReports();
  }

  @ApiOperation({
    summary: 'Get maintenance reports by status',
    description: 'Retrieve maintenance reports filtered by their status',
  })
  @ApiQuery({
    name: 'status',
    enum: MaintenanceStatus,
    description: 'Status to filter maintenance reports by',
    example: MaintenanceStatus.PENDING,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports by status',
    type: [MaintenanceReport],
  })
  @Get('maintenance-reports/by-status')
  async getMaintenanceReportsByStatus(
    @Query('status') status: MaintenanceStatus,
  ): Promise<MaintenanceReport[]> {
    return this.housekeepingService.getMaintenanceReportsByStatus(status);
  }

  @ApiOperation({
    summary: 'Get maintenance reports by priority',
    description:
      'Retrieve maintenance reports filtered by their priority level',
  })
  @ApiQuery({
    name: 'priority',
    enum: TaskPriority,
    description: 'Priority level to filter maintenance reports by',
    example: TaskPriority.HIGH,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports by priority',
    type: [MaintenanceReport],
  })
  @Get('maintenance-reports/by-priority')
  async getMaintenanceReportsByPriority(
    @Query('priority') priority: TaskPriority,
  ): Promise<MaintenanceReport[]> {
    return this.housekeepingService.getMaintenanceReportsByPriority(priority);
  }

  @ApiOperation({
    summary: 'Get maintenance reports by type',
    description: 'Retrieve maintenance reports filtered by maintenance type',
  })
  @ApiQuery({
    name: 'type',
    enum: MaintenanceType,
    description: 'Maintenance type to filter reports by',
    example: MaintenanceType.PLUMBING,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports by type',
    type: [MaintenanceReport],
  })
  @Get('maintenance-reports/by-type')
  async getMaintenanceReportsByType(
    @Query('type') type: MaintenanceType,
  ): Promise<MaintenanceReport[]> {
    return this.housekeepingService.getMaintenanceReportsByType(type);
  }

  @ApiOperation({
    summary: 'Get maintenance reports by room',
    description: 'Retrieve maintenance reports for a specific room',
  })
  @ApiParam({
    name: 'roomId',
    type: 'number',
    description: 'ID of the room to get maintenance reports for',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports for the room',
    type: [MaintenanceReport],
  })
  @Get('maintenance-reports/by-room/:roomId')
  async getMaintenanceReportsByRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<MaintenanceReport[]> {
    return this.housekeepingService.getMaintenanceReportsByRoom(roomId);
  }

  @ApiOperation({
    summary: 'Get maintenance report by ID',
    description: 'Retrieve a specific maintenance report by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance report',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found',
  })
  @Get('maintenance-reports/:id')
  async getMaintenanceReportById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaintenanceReport | null> {
    return this.housekeepingService.getMaintenanceReportById(id);
  }

  @ApiOperation({
    summary: 'Get maintenance report by report number',
    description: 'Retrieve a specific maintenance report by its report number',
  })
  @ApiParam({
    name: 'reportNumber',
    type: 'string',
    description: 'Report number of the maintenance report',
    example: 'MR-2024-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance report',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found',
  })
  @Get('maintenance-reports/number/:reportNumber')
  async getMaintenanceReportByNumber(
    @Param('reportNumber') reportNumber: string,
  ): Promise<MaintenanceReport | null> {
    return this.housekeepingService.getMaintenanceReportByNumber(reportNumber);
  }

  @ApiOperation({
    summary: 'Create a new maintenance report',
    description: 'Create a new maintenance report with the provided data',
  })
  @ApiBody({
    type: CreateMaintenanceReportDto,
    description: 'Maintenance report data',
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance report created successfully',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post('maintenance-reports')
  async createMaintenanceReport(
    @Body() reportData: CreateMaintenanceReportDto,
  ): Promise<MaintenanceReport> {
    return this.housekeepingService.createMaintenanceReport(reportData);
  }

  @ApiOperation({
    summary: 'Update a maintenance report',
    description: 'Update an existing maintenance report with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateMaintenanceReportDto,
    description: 'Updated maintenance report data',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance report updated successfully',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found',
  })
  @Put('maintenance-reports/:id')
  async updateMaintenanceReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() reportData: UpdateMaintenanceReportDto,
  ): Promise<MaintenanceReport> {
    return this.housekeepingService.updateMaintenanceReport(id, reportData);
  }

  @ApiOperation({
    summary: 'Start maintenance work',
    description:
      'Mark a maintenance report as in progress and assign a technician',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report to start',
    example: 1,
  })
  @ApiBody({
    type: AssignTechnicianResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance work started successfully',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found',
  })
  @Put('maintenance-reports/:id/start')
  async startMaintenanceWork(
    @Param('id', ParseIntPipe) id: number,
    @Body('assignedTechnician') assignedTechnician?: string,
  ): Promise<MaintenanceReport> {
    return this.housekeepingService.startMaintenanceWork(
      id,
      assignedTechnician,
    );
  }

  @ApiOperation({
    summary: 'Complete maintenance work',
    description: 'Mark a maintenance report as completed with cost and notes',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report to complete',
    example: 1,
  })
  @ApiBody({
    type: UpdateCostResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance work completed successfully',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found',
  })
  @Put('maintenance-reports/:id/complete')
  async completeMaintenanceWork(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { cost?: number; notes?: string },
  ): Promise<MaintenanceReport> {
    return this.housekeepingService.completeMaintenanceWork(
      id,
      body.cost,
      body.notes,
    );
  }

  @ApiOperation({
    summary: 'Delete a maintenance report',
    description: 'Delete an existing maintenance report',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance report deleted successfully',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found',
  })
  @Delete('maintenance-reports/:id')
  async deleteMaintenanceReport(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaintenanceReport> {
    return this.housekeepingService.deleteMaintenanceReport(id);
  }

  // Cleaning Assignment endpoints
  @ApiOperation({
    summary: 'Get all cleaning assignments',
    description:
      'Retrieve a list of all cleaning assignments ordered by assignment date',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments',
    type: [CleaningAssignment],
  })
  @Get('cleaning-assignments')
  async getAllCleaningAssignments(): Promise<CleaningAssignment[]> {
    return this.housekeepingService.getAllCleaningAssignments();
  }

  @ApiOperation({
    summary: "Get today's cleaning assignments",
    description: 'Retrieve cleaning assignments scheduled for today',
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved today's cleaning assignments",
    type: [CleaningAssignment],
  })
  @Get('cleaning-assignments/today')
  async getTodaysCleaningAssignments(): Promise<CleaningAssignment[]> {
    return this.housekeepingService.getTodaysCleaningAssignments();
  }

  @ApiOperation({
    summary: 'Get cleaning assignments by status',
    description: 'Retrieve cleaning assignments filtered by their status',
  })
  @ApiQuery({
    name: 'status',
    enum: CleaningStatus,
    description: 'Status to filter cleaning assignments by',
    example: CleaningStatus.PENDING,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments by status',
    type: [CleaningAssignment],
  })
  @Get('cleaning-assignments/by-status')
  async getCleaningAssignmentsByStatus(
    @Query('status') status: CleaningStatus,
  ): Promise<CleaningAssignment[]> {
    return this.housekeepingService.getCleaningAssignmentsByStatus(status);
  }

  @ApiOperation({
    summary: 'Get cleaning assignments by employee',
    description: 'Retrieve cleaning assignments for a specific employee',
  })
  @ApiParam({
    name: 'employeeId',
    type: 'number',
    description: 'ID of the employee to get assignments for',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments for the employee',
    type: [CleaningAssignment],
  })
  @Get('cleaning-assignments/by-employee/:employeeId')
  async getCleaningAssignmentsByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<CleaningAssignment[]> {
    return this.housekeepingService.getCleaningAssignmentsByEmployee(
      employeeId,
    );
  }

  @ApiOperation({
    summary: 'Get cleaning assignments by room',
    description: 'Retrieve cleaning assignments for a specific room',
  })
  @ApiParam({
    name: 'roomId',
    type: 'number',
    description: 'ID of the room to get assignments for',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments for the room',
    type: [CleaningAssignment],
  })
  @Get('cleaning-assignments/by-room/:roomId')
  async getCleaningAssignmentsByRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<CleaningAssignment[]> {
    return this.housekeepingService.getCleaningAssignmentsByRoom(roomId);
  }

  @ApiOperation({
    summary: 'Get cleaning assignment by ID',
    description: 'Retrieve a specific cleaning assignment by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning assignment',
    type: CleaningAssignment,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found',
  })
  @Get('cleaning-assignments/:id')
  async getCleaningAssignmentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CleaningAssignment | null> {
    return this.housekeepingService.getCleaningAssignmentById(id);
  }

  @ApiOperation({
    summary: 'Create a new cleaning assignment',
    description: 'Create a new cleaning assignment with the provided data',
  })
  @ApiBody({
    type: CreateCleaningAssignmentDto,
    description: 'Cleaning assignment data',
  })
  @ApiResponse({
    status: 201,
    description: 'Cleaning assignment created successfully',
    type: CleaningAssignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post('cleaning-assignments')
  async createCleaningAssignment(
    @Body() assignmentData: CreateCleaningAssignmentDto,
  ): Promise<CleaningAssignment> {
    return this.housekeepingService.createCleaningAssignment(assignmentData);
  }

  @ApiOperation({
    summary: 'Update a cleaning assignment',
    description: 'Update an existing cleaning assignment with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateCleaningAssignmentDto,
    description: 'Updated cleaning assignment data',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment updated successfully',
    type: CleaningAssignment,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found',
  })
  @Put('cleaning-assignments/:id')
  async updateCleaningAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignmentData: UpdateCleaningAssignmentDto,
  ): Promise<CleaningAssignment> {
    return this.housekeepingService.updateCleaningAssignment(
      id,
      assignmentData,
    );
  }

  @ApiOperation({
    summary: 'Start cleaning work',
    description: 'Mark a cleaning assignment as in progress',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to start',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning work started successfully',
    type: CleaningAssignment,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found',
  })
  @Put('cleaning-assignments/:id/start')
  async startCleaningWork(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CleaningAssignment> {
    return this.housekeepingService.startCleaningWork(id);
  }

  @ApiOperation({
    summary: 'Complete cleaning work',
    description:
      'Mark a cleaning assignment as completed with quality score and notes',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to complete',
    example: 1,
  })
  @ApiBody({
    type: QualityScoreResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning work completed successfully',
    type: CleaningAssignment,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found',
  })
  @Put('cleaning-assignments/:id/complete')
  async completeCleaningWork(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { qualityScore?: number; notes?: string },
  ): Promise<CleaningAssignment> {
    return this.housekeepingService.completeCleaningWork(
      id,
      body.qualityScore,
      body.notes,
    );
  }

  @ApiOperation({
    summary: 'Delete a cleaning assignment',
    description: 'Delete an existing cleaning assignment',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment deleted successfully',
    type: CleaningAssignment,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found',
  })
  @Delete('cleaning-assignments/:id')
  async deleteCleaningAssignment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CleaningAssignment> {
    return this.housekeepingService.deleteCleaningAssignment(id);
  }

  // Statistics and Reports
  @ApiOperation({
    summary: 'Get housekeeping statistics',
    description: 'Retrieve comprehensive housekeeping statistics and metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved housekeeping statistics',
    type: HousekeepingStatisticsDto,
  })
  @Get('statistics')
  async getHousekeepingStatistics(): Promise<HousekeepingStatisticsDto> {
    return this.housekeepingService.getHousekeepingStatistics();
  }

  @ApiOperation({
    summary: 'Get maintenance costs by date range',
    description: 'Retrieve maintenance costs within a specified date range',
  })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    description: 'Start date for the cost report (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    description: 'End date for the cost report (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance costs',
    type: MaintenanceCostsSummaryDto,
  })
  @Get('maintenance-costs')
  async getMaintenanceCostsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<MaintenanceCostsSummaryDto> {
    return this.housekeepingService.getMaintenanceCostsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @ApiOperation({
    summary: 'Get cleaning performance by employee',
    description:
      'Retrieve cleaning performance metrics, optionally filtered by employee',
  })
  @ApiQuery({
    name: 'employeeId',
    type: 'string',
    description: 'Optional employee ID to filter performance by',
    example: '1',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning performance data',
    type: CleaningPerformanceDto,
  })
  @Get('cleaning-performance')
  async getCleaningPerformanceByEmployee(
    @Query('employeeId') employeeId?: string,
  ): Promise<CleaningPerformanceDto> {
    const empId = employeeId ? parseInt(employeeId, 10) : undefined;
    return this.housekeepingService.getCleaningPerformanceByEmployee(empId);
  }

  @ApiOperation({
    summary: 'Get rooms for incident reports',
    description:
      'Retrieve rooms that are currently being cleaned or have cleaning assignments',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved rooms for incident reports',
    type: [Room],
  })
  @Get('rooms/for-incident-reports')
  async getRoomsForIncidentReports(): Promise<Room[]> {
    return this.housekeepingService.getRoomsForIncidentReports();
  }

  @ApiOperation({
    summary: 'Create incident report',
    description:
      'Create a new maintenance report for an incident and update room status',
  })
  @ApiBody({
    type: CreateIncidentReportDto,
    description: 'Incident report data',
  })
  @ApiResponse({
    status: 201,
    description: 'Incident report created successfully and room status updated',
    type: MaintenanceReport,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  @Post('incident-reports')
  async createIncidentReport(
    @Body() incidentData: CreateIncidentReportDto,
  ): Promise<MaintenanceReport> {
    return this.housekeepingService.createIncidentReport(incidentData);
  }
}
