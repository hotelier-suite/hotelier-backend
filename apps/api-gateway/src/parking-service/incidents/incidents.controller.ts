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
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import { IncidentsService } from './incidents.service';
import {
  CreateParkingIncidentDto,
  FindIncidentsFilterDto,
  ParkingIncidentDto,
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
      'Retrieve all parking incidents reported in the facility, with optional filters for status, priority, and type.',
  })
  @ApiResponse({ status: 200, type: [ParkingIncidentDto] })
  findAll(
    @Query() filters: FindIncidentsFilterDto,
  ): Observable<ParkingIncidentDto[]> {
    return this.incidentsService.findAll(filters);
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

  @Patch(':id')
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
