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
import { Observable } from 'rxjs';
import { HousekeepingService } from './housekeeping.service';
import {
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
  CleaningAssignmentDto,
  CreateCleaningAssignmentDto,
  UpdateCleaningAssignmentDto,
  MaintenanceReportDto,
  CreateMaintenanceReportDto,
  UpdateMaintenanceReportDto,
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
  HousekeepingStatisticsDto,
  CleaningPerformanceDto,
} from '@app/contracts/operations-service/housekeeping/dto';

@ApiTags('Housekeeping')
@Controller('housekeeping')
@ApiBearerAuth()
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  // Cleaning Tasks
  @ApiOperation({ summary: 'Get all cleaning tasks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning tasks',
    type: [CleaningTaskDto],
  })
  @Get('tasks')
  findAllTasks(): Observable<CleaningTaskDto[]> {
    return this.housekeepingService.findAllTasks();
  }

  @ApiOperation({ summary: 'Get cleaning task by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning task',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning task',
    type: CleaningTaskDto,
  })
  @Get('tasks/:id')
  findOneTask(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningTaskDto> {
    return this.housekeepingService.findOneTask(id);
  }

  @ApiOperation({ summary: 'Create a new cleaning task' })
  @ApiBody({ type: CreateCleaningTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Cleaning task created successfully',
    type: CleaningTaskDto,
  })
  @Post('tasks')
  createTask(@Body() data: CreateCleaningTaskDto): Observable<CleaningTaskDto> {
    return this.housekeepingService.createTask(data);
  }

  @ApiOperation({ summary: 'Update a cleaning task' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning task to update',
  })
  @ApiBody({ type: UpdateCleaningTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Cleaning task updated successfully',
    type: CleaningTaskDto,
  })
  @Put('tasks/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCleaningTaskDto,
  ): Observable<CleaningTaskDto> {
    return this.housekeepingService.updateTask(id, data);
  }

  @ApiOperation({ summary: 'Delete a cleaning task' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning task to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning task deleted successfully',
    type: CleaningTaskDto,
  })
  @Delete('tasks/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningTaskDto> {
    return this.housekeepingService.deleteTask(id);
  }

  // Cleaning Assignments
  @ApiOperation({ summary: 'Get all cleaning assignments' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments',
    type: [CleaningAssignmentDto],
  })
  @Get('assignments')
  findAllAssignments(): Observable<CleaningAssignmentDto[]> {
    return this.housekeepingService.findAllAssignments();
  }

  @ApiOperation({ summary: 'Get cleaning assignment by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning assignment',
    type: CleaningAssignmentDto,
  })
  @Get('assignments/:id')
  findOneAssignment(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningAssignmentDto> {
    return this.housekeepingService.findOneAssignment(id);
  }

  @ApiOperation({ summary: 'Create a new cleaning assignment' })
  @ApiBody({ type: CreateCleaningAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'Cleaning assignment created successfully',
    type: CleaningAssignmentDto,
  })
  @Post('assignments')
  createAssignment(
    @Body() data: CreateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.housekeepingService.createAssignment(data);
  }

  @ApiOperation({ summary: 'Update a cleaning assignment' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to update',
  })
  @ApiBody({ type: UpdateCleaningAssignmentDto })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment updated successfully',
    type: CleaningAssignmentDto,
  })
  @Put('assignments/:id')
  updateAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.housekeepingService.updateAssignment(id, data);
  }

  @ApiOperation({ summary: 'Delete a cleaning assignment' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment deleted successfully',
    type: CleaningAssignmentDto,
  })
  @Delete('assignments/:id')
  deleteAssignment(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningAssignmentDto> {
    return this.housekeepingService.deleteAssignment(id);
  }

  // Maintenance Reports
  @ApiOperation({ summary: 'Get all maintenance reports' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports',
    type: [MaintenanceReportDto],
  })
  @Get('maintenance-reports')
  findAllMaintenanceReports(): Observable<MaintenanceReportDto[]> {
    return this.housekeepingService.findAllMaintenanceReports();
  }

  @ApiOperation({ summary: 'Get maintenance report by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance report',
    type: MaintenanceReportDto,
  })
  @Get('maintenance-reports/:id')
  findOneMaintenanceReport(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<MaintenanceReportDto> {
    return this.housekeepingService.findOneMaintenanceReport(id);
  }

  @ApiOperation({ summary: 'Create a new maintenance report' })
  @ApiBody({ type: CreateMaintenanceReportDto })
  @ApiResponse({
    status: 201,
    description: 'Maintenance report created successfully',
    type: MaintenanceReportDto,
  })
  @Post('maintenance-reports')
  createMaintenanceReport(
    @Body() data: CreateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.housekeepingService.createMaintenanceReport(data);
  }

  @ApiOperation({ summary: 'Update a maintenance report' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report to update',
  })
  @ApiBody({ type: UpdateMaintenanceReportDto })
  @ApiResponse({
    status: 200,
    description: 'Maintenance report updated successfully',
    type: MaintenanceReportDto,
  })
  @Put('maintenance-reports/:id')
  updateMaintenanceReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.housekeepingService.updateMaintenanceReport(id, data);
  }

  @ApiOperation({ summary: 'Delete a maintenance report' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance report to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance report deleted successfully',
    type: MaintenanceReportDto,
  })
  @Delete('maintenance-reports/:id')
  deleteMaintenanceReport(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<MaintenanceReportDto> {
    return this.housekeepingService.deleteMaintenanceReport(id);
  }

  // Maintenance Requests
  @ApiOperation({ summary: 'Get all maintenance requests' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance requests',
    type: [HousekeepingMaintenanceRequestDto],
  })
  @Get('maintenance-requests')
  findAllMaintenanceRequests(): Observable<
    HousekeepingMaintenanceRequestDto[]
  > {
    return this.housekeepingService.findAllMaintenanceRequests();
  }

  @ApiOperation({ summary: 'Get maintenance request by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance request',
    type: HousekeepingMaintenanceRequestDto,
  })
  @Get('maintenance-requests/:id')
  findOneMaintenanceRequest(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.findOneMaintenanceRequest(id);
  }

  @ApiOperation({ summary: 'Create a new maintenance request' })
  @ApiBody({ type: CreateHousekeepingMaintenanceRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Maintenance request created successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @Post('maintenance-requests')
  createMaintenanceRequest(
    @Body() data: CreateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.createMaintenanceRequest(data);
  }

  @ApiOperation({ summary: 'Update a maintenance request' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request to update',
  })
  @ApiBody({ type: UpdateHousekeepingMaintenanceRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request updated successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @Put('maintenance-requests/:id')
  updateMaintenanceRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.updateMaintenanceRequest(id, data);
  }

  @ApiOperation({ summary: 'Delete a maintenance request' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request deleted successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @Delete('maintenance-requests/:id')
  deleteMaintenanceRequest(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.deleteMaintenanceRequest(id);
  }

  // Statistics
  @ApiOperation({ summary: 'Get housekeeping statistics' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved housekeeping statistics',
    type: HousekeepingStatisticsDto,
  })
  @Get('statistics')
  getStatistics(): Observable<HousekeepingStatisticsDto> {
    return this.housekeepingService.getStatistics();
  }

  @ApiOperation({ summary: 'Get cleaning performance' })
  @ApiQuery({
    name: 'employeeId',
    type: 'number',
    required: false,
    description: 'Optional employee ID to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning performance',
    type: CleaningPerformanceDto,
  })
  @Get('cleaning-performance')
  getCleaningPerformance(
    @Query('employeeId') employeeId?: string,
  ): Observable<CleaningPerformanceDto> {
    const empId = employeeId ? parseInt(employeeId, 10) : undefined;
    return this.housekeepingService.getCleaningPerformance(empId);
  }
}
