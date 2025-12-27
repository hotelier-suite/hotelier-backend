import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import { TaskPriority } from '@app/contracts/common';
import { IncidentsService } from './incidents.service';
import {
  CreateParkingIncidentDto,
  IncidentStatus,
  IncidentType,
  ParkingIncidentDto,
  ResolveIncidentRequestDto,
  UpdateParkingIncidentDto,
} from '@app/contracts/parking-service';

@ApiTags('parking')
@Controller('parking/incidents')
@AuditLog({ resource: AuditResource.PARKING })
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Incidents',
    description:
      'Retrieve all parking incidents reported in the facility, including their current status and resolution details.',
  })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  findAll(): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findAll();
  }

  @Get('by-status')
  @ApiOperation({
    summary: 'Get Incidents by Status',
    description:
      'Retrieve all parking incidents filtered by their current status (e.g., open, in progress, resolved).',
  })
  @ApiQuery({
    name: 'status',
    enum: IncidentStatus,
    description: 'Filter incidents by their current resolution status',
  })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value provided',
  })
  findByStatus(
    @Query('status') status: IncidentStatus,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findByStatus(status);
  }

  @Get('by-priority')
  @ApiOperation({
    summary: 'Get Incidents by Priority',
    description:
      'Retrieve all parking incidents filtered by their priority level (e.g., low, medium, high, critical).',
  })
  @ApiQuery({
    name: 'priority',
    enum: TaskPriority,
    description: 'Filter incidents by their assigned priority level',
  })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  @ApiResponse({
    status: 400,
    description: 'Invalid priority value provided',
  })
  findByPriority(
    @Query('priority') priority: TaskPriority,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findByPriority(priority);
  }

  @Get('by-type')
  @ApiOperation({
    summary: 'Get Incidents by Type',
    description:
      'Retrieve all parking incidents filtered by their type (e.g., damage, theft, unauthorized parking).',
  })
  @ApiQuery({
    name: 'type',
    enum: IncidentType,
    description: 'Filter incidents by their category or type',
  })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  @ApiResponse({
    status: 400,
    description: 'Invalid incident type value provided',
  })
  findByType(
    @Query('type') type: IncidentType,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Incident by ID',
    description:
      'Retrieve a specific parking incident by its unique identifier, including full details and resolution history.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the parking incident',
    example: 1,
  })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Incident',
    description:
      'Report a new parking incident in the facility. The incident will be assigned a priority and tracked until resolution.',
  })
  @ApiBody({
    type: CreateParkingIncidentDto,
    description:
      'Incident details including type, description, location, and priority',
  })
  @ApiResponse({ status: 201, type: ParkingIncidentDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  create(
    @Body() body: CreateParkingIncidentDto,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.create(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Incident',
    description:
      'Update an existing parking incident with new information such as status, priority, or additional details.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the incident to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateParkingIncidentDto,
    description: 'Updated incident data',
  })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateParkingIncidentDto,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.update(id, body);
  }

  @Put(':id/resolve')
  @ApiOperation({
    summary: 'Resolve Incident',
    description:
      'Mark a parking incident as resolved with resolution details. This closes the incident and records the resolution.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the incident to resolve',
    example: 1,
  })
  @ApiBody({
    type: ResolveIncidentRequestDto,
    description:
      'Resolution details including resolution notes and actions taken',
  })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResolveIncidentRequestDto,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.resolve(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Incident',
    description:
      'Remove a parking incident record from the system. This should only be used for erroneous entries.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the incident to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.remove(id);
  }
}
