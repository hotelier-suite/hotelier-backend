import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PARKING_SERVICE_CLIENT } from '../constants';
import {
  CreateParkingIncidentDto,
  INCIDENTS_PATTERNS,
  ParkingIncidentDto,
  UpdateParkingIncidentDto,
  FindIncidentsFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class IncidentsService {
  constructor(
    @Inject(PARKING_SERVICE_CLIENT)
    private readonly parkingClient: ClientProxy,
  ) {}

  findAll(filters: FindIncidentsFilterDto): Observable<ParkingIncidentDto[]> {
    return this.parkingClient.send<
      ParkingIncidentDto[],
      FindIncidentsFilterDto
    >(INCIDENTS_PATTERNS.FIND_ALL, filters);
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

  remove(id: number): Observable<ParkingIncidentDto> {
    return this.parkingClient.send<ParkingIncidentDto, number>(
      INCIDENTS_PATTERNS.DELETE,
      id,
    );
  }
}
