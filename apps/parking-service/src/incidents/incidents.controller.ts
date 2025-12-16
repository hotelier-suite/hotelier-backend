import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INCIDENTS_PATTERNS } from '@app/contracts/parking-service/incidents/incidents.patterns';
import { IncidentsService } from './incidents.service';
import { ParkingIncidentDto } from '@app/contracts/parking-service/incidents/dto/parking-incident.dto';
import { CreateParkingIncidentDto } from '@app/contracts/parking-service/incidents/dto/create-parking-incident.dto';
import { UpdateParkingIncidentDto } from '@app/contracts/parking-service/incidents/dto/update-parking-incident.dto';
import { ResolveIncidentRequestDto } from '@app/contracts/parking-service/incidents/dto/resolve-incident-request.dto';
import { IncidentStatus } from '@app/contracts/parking-service/incidents/enums/incident-status.enum';
import { IncidentType } from '@app/contracts/parking-service/incidents/enums/incident-type.enum';
import { TaskPriority } from '@app/contracts/common/enums/task-priority.enum';

@Controller()
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @MessagePattern(INCIDENTS_PATTERNS.GET_ALL)
  findAll(): Promise<ParkingIncidentDto[]> {
    return this.incidentsService.findAll();
  }

  @MessagePattern(INCIDENTS_PATTERNS.GET_BY_STATUS)
  findByStatus(
    @Payload() status: IncidentStatus,
  ): Promise<ParkingIncidentDto[]> {
    return this.incidentsService.findByStatus(status);
  }

  @MessagePattern(INCIDENTS_PATTERNS.GET_BY_PRIORITY)
  findByPriority(
    @Payload() priority: TaskPriority,
  ): Promise<ParkingIncidentDto[]> {
    return this.incidentsService.findByPriority(priority);
  }

  @MessagePattern(INCIDENTS_PATTERNS.GET_BY_TYPE)
  findByType(@Payload() type: IncidentType): Promise<ParkingIncidentDto[]> {
    return this.incidentsService.findByType(type);
  }

  @MessagePattern(INCIDENTS_PATTERNS.GET_BY_ID)
  findOne(@Payload() id: number): Promise<ParkingIncidentDto> {
    return this.incidentsService.findOne(id);
  }

  @MessagePattern(INCIDENTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateParkingIncidentDto,
  ): Promise<ParkingIncidentDto> {
    return this.incidentsService.create(data);
  }

  @MessagePattern(INCIDENTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateParkingIncidentDto },
  ): Promise<ParkingIncidentDto> {
    return this.incidentsService.update(payload.id, payload.data);
  }

  @MessagePattern(INCIDENTS_PATTERNS.RESOLVE)
  resolve(
    @Payload() payload: { id: number; data: ResolveIncidentRequestDto },
  ): Promise<ParkingIncidentDto> {
    return this.incidentsService.resolve(payload.id, payload.data);
  }

  @MessagePattern(INCIDENTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<ParkingIncidentDto> {
    return this.incidentsService.remove(id);
  }
}
