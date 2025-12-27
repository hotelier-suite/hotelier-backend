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

  @ApiOperation({ summary: 'Get all maintenance reports' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance reports',
    type: [MaintenanceReportDto],
  })
  @Get()
  findAll(): Observable<MaintenanceReportDto[]> {
    return this.maintenanceReportsService.findAll();
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
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new maintenance report' })
  @ApiBody({ type: CreateMaintenanceReportDto })
  @ApiResponse({
    status: 201,
    description: 'Maintenance report created successfully',
    type: MaintenanceReportDto,
  })
  @Post()
  create(
    @Body() data: CreateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.create(data);
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
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.update(id, data);
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
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<MaintenanceReportDto> {
    return this.maintenanceReportsService.delete(id);
  }
}
