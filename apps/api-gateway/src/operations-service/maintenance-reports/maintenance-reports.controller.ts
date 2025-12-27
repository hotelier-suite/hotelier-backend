import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { MaintenanceReportsService } from './maintenance-reports.service';
import {
  MaintenanceReportDto,
  CreateMaintenanceReportDto,
  UpdateMaintenanceReportDto,
} from '@app/contracts/operations-service';

@ApiTags('Maintenance Reports')
@Controller('housekeeping/maintenance-reports')
@ApiBearerAuth()
export class MaintenanceReportsController {
  constructor(
    private readonly maintenanceReportsService: MaintenanceReportsService,
  ) {}

  @ApiOperation({
    summary: 'Get all maintenance reports',
    description:
      'Retrieve all maintenance reports in the housekeeping system. Returns a list of reports documenting maintenance issues found during room inspections or cleaning.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports',
    type: [MaintenanceReportDto],
  })
  @Get()
  findAll(): Observable<MaintenanceReportDto[]> {
    return this.maintenanceReportsService.findAll();
  }

  @ApiOperation({
    summary: 'Get maintenance report by ID',
    description:
      'Retrieve a specific maintenance report by its unique identifier. Returns detailed information about the reported issue including room, description, and status.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance report',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance report',
    type: MaintenanceReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found with the specified ID',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new maintenance report',
    description:
      'Create a new maintenance report to document an issue found during housekeeping activities. Reports are typically created by housekeeping staff when they discover maintenance problems in rooms.',
  })
  @ApiBody({
    type: CreateMaintenanceReportDto,
    description:
      'Maintenance report data including room, issue description, and severity',
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance report created successfully',
    type: MaintenanceReportDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @Post()
  create(
    @Body() data: CreateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.create(data);
  }

  @ApiOperation({
    summary: 'Update a maintenance report',
    description:
      'Update an existing maintenance report with new information. Can be used to update the status, add notes, or modify the issue description.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance report to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateMaintenanceReportDto,
    description: 'Updated maintenance report data',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance report updated successfully',
    type: MaintenanceReportDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found with the specified ID',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a maintenance report',
    description:
      'Delete a maintenance report by its unique identifier. This removes the report from the system permanently.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance report to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance report deleted successfully',
    type: MaintenanceReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance report not found with the specified ID',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.remove(id);
  }
}
