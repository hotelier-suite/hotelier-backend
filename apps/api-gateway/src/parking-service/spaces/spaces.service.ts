import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PARKING_SERVICE_CLIENT } from '../constants';
import {
  CreateParkingSpaceDto,
  ParkingSpaceDto,
  SPACES_PATTERNS,
  UpdateParkingSpaceDto,
  FindSpacesFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class SpacesService {
  constructor(
    @Inject(PARKING_SERVICE_CLIENT)
    private readonly parkingClient: ClientProxy,
  ) {}

  findAll(filters: FindSpacesFilterDto): Observable<ParkingSpaceDto[]> {
    return this.parkingClient.send<ParkingSpaceDto[], FindSpacesFilterDto>(
      SPACES_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<ParkingSpaceDto> {
    return this.parkingClient.send<ParkingSpaceDto, number>(
      SPACES_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateParkingSpaceDto): Observable<ParkingSpaceDto> {
    return this.parkingClient.send<ParkingSpaceDto, CreateParkingSpaceDto>(
      SPACES_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateParkingSpaceDto): Observable<ParkingSpaceDto> {
    return this.parkingClient.send<
      ParkingSpaceDto,
      { id: number; data: UpdateParkingSpaceDto }
    >(SPACES_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<ParkingSpaceDto> {
    return this.parkingClient.send<ParkingSpaceDto, number>(
      SPACES_PATTERNS.DELETE,
      id,
    );
  }
}
