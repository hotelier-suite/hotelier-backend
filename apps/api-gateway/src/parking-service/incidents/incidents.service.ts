import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PARKING_SERVICE_CLIENT } from '../constants';
import { TaskPriority } from '@app/contracts/common';
import {
  CreateParkingIncidentDto,
  IncidentStatus,
  IncidentType,
  INCIDENTS_PATTERNS,
  ParkingIncidentDto,
  ResolveIncidentRequestDto,
  UpdateParkingIncidentDto,
} from '@app/contracts/parking-service';

@Injectable()
export class IncidentsService {
  constructor(
    @Inject(PARKING_SERVICE_CLIENT)
    private readonly parkingClient: ClientProxy,
  ) {}

  findAll(): Observable<ParkingIncidentDto[]> {
    return this.parkingClient.send<ParkingIncidentDto[], Record<string, never>>(
      INCIDENTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findByStatus(status: IncidentStatus): Observable<ParkingIncidentDto[]> {
    return this.parkingClient.send<ParkingIncidentDto[], IncidentStatus>(
      INCIDENTS_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  findByPriority(priority: TaskPriority): Observable<ParkingIncidentDto[]> {
    return this.parkingClient.send<ParkingIncidentDto[], TaskPriority>(
      INCIDENTS_PATTERNS.FIND_BY_PRIORITY,
      priority,
    );
  }

  findByType(type: IncidentType): Observable<ParkingIncidentDto[]> {
    return this.parkingClient.send<ParkingIncidentDto[], IncidentType>(
      INCIDENTS_PATTERNS.FIND_BY_TYPE,
      type,
    );
  }

  findOne(id: number): Observable<ParkingIncidentDto> {
    return this.parkingClient.send<ParkingIncidentDto, number>(
      INCIDENTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateParkingIncidentDto): Observable<ParkingIncidentDto> {
    return this.parkingClient.send<
      ParkingIncidentDto,
      CreateParkingIncidentDto
    >(INCIDENTS_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateParkingIncidentDto,
  ): Observable<ParkingIncidentDto> {
    return this.parkingClient.send<
      ParkingIncidentDto,
      { id: number; data: UpdateParkingIncidentDto }
    >(INCIDENTS_PATTERNS.UPDATE, { id, data });
  }

  resolve(
    id: number,
    data: ResolveIncidentRequestDto,
  ): Observable<ParkingIncidentDto> {
    return this.parkingClient.send<
      ParkingIncidentDto,
      { id: number; data: ResolveIncidentRequestDto }
    >(INCIDENTS_PATTERNS.RESOLVE, { id, data });
  }

  remove(id: number): Observable<ParkingIncidentDto> {
    return this.parkingClient.send<ParkingIncidentDto, number>(
      INCIDENTS_PATTERNS.DELETE,
      id,
    );
  }
}
