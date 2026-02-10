import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IncidentsService } from './incidents.service';
import {
  INCIDENTS_PATTERNS,
  ParkingIncidentDto,
  CreateParkingIncidentDto,
  UpdateParkingIncidentDto,
  FindIncidentsFilterDto,
} from '@app/contracts/parking-service';

@Controller()
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @MessagePattern(INCIDENTS_PATTERNS.FIND_ALL)
  findAll(
    @Payload() filters: FindIncidentsFilterDto,
  ): Promise<ParkingIncidentDto[]> {
    return this.incidentsService.findAll(filters);
  }

  @MessagePattern(INCIDENTS_PATTERNS.FIND_ONE)
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

  @MessagePattern(INCIDENTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<ParkingIncidentDto> {
    return this.incidentsService.remove(id);
  }
}
