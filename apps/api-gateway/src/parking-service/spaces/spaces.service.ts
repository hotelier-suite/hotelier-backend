import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PARKING_SERVICE_CLIENT } from '../constants';
import { SPACES_PATTERNS } from '@app/contracts/parking-service/spaces/spaces.patterns';
import { ParkingSpaceDto } from '@app/contracts/parking-service/spaces/dto/parking-space.dto';
import { CreateParkingSpaceDto } from '@app/contracts/parking-service/spaces/dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from '@app/contracts/parking-service/spaces/dto/update-parking-space.dto';
import { SpaceType } from '@app/contracts/parking-service/spaces/enums/space-type.enum';

@Injectable()
export class SpacesService {
  constructor(
    @Inject(PARKING_SERVICE_CLIENT)
    private readonly parkingClient: ClientProxy,
  ) {}

  findAll(): Observable<ParkingSpaceDto[]> {
    return this.parkingClient.send<ParkingSpaceDto[], Record<string, never>>(
      SPACES_PATTERNS.GET_ALL,
      {},
    );
  }

  findAvailable(): Observable<ParkingSpaceDto[]> {
    return this.parkingClient.send<ParkingSpaceDto[], Record<string, never>>(
      SPACES_PATTERNS.GET_AVAILABLE,
      {},
    );
  }

  findByType(type: SpaceType): Observable<ParkingSpaceDto[]> {
    return this.parkingClient.send<ParkingSpaceDto[], SpaceType>(
      SPACES_PATTERNS.GET_BY_TYPE,
      type,
    );
  }

  findByZone(zone: string): Observable<ParkingSpaceDto[]> {
    return this.parkingClient.send<ParkingSpaceDto[], string>(
      SPACES_PATTERNS.GET_BY_ZONE,
      zone,
    );
  }

  findOne(id: number): Observable<ParkingSpaceDto> {
    return this.parkingClient.send<ParkingSpaceDto, number>(
      SPACES_PATTERNS.GET_BY_ID,
      id,
    );
  }

  findByCode(code: string): Observable<ParkingSpaceDto> {
    return this.parkingClient.send<ParkingSpaceDto, string>(
      SPACES_PATTERNS.GET_BY_CODE,
      code,
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
