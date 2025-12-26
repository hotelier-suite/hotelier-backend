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
  @ApiOperation({ summary: 'Get All Incidents' })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  getAllIncidents(): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findAll();
  }

  @Get('by-status')
  @ApiOperation({ summary: 'Get Incidents by Status' })
  @ApiQuery({ name: 'status', enum: IncidentStatus })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  getIncidentsByStatus(
    @Query('status') status: IncidentStatus,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findByStatus(status);
  }

  @Get('by-priority')
  @ApiOperation({ summary: 'Get Incidents by Priority' })
  @ApiQuery({ name: 'priority', enum: TaskPriority })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  getIncidentsByPriority(
    @Query('priority') priority: TaskPriority,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findByPriority(priority);
  }

  @Get('by-type')
  @ApiOperation({ summary: 'Get Incidents by Type' })
  @ApiQuery({ name: 'type', enum: IncidentType })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  getIncidentsByType(
    @Query('type') type: IncidentType,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Incident by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  getIncidentById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Incident' })
  @ApiBody({ type: CreateParkingIncidentDto })
  @ApiResponse({ status: 201, type: ParkingIncidentDto })
  createIncident(
    @Body() body: CreateParkingIncidentDto,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Incident' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateParkingIncidentDto })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  updateIncident(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateParkingIncidentDto,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.update(id, body);
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'Resolve Incident' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ResolveIncidentRequestDto })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  resolveIncident(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResolveIncidentRequestDto,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.resolve(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Incident' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ParkingIncidentDto })
  deleteIncident(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ParkingIncidentDto> {
    return this.incidentsService.remove(id);
  }
}
