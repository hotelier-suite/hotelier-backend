import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PARKING_SERVICE_CLIENT } from '../constants';
import {
  VEHICLES_PATTERNS,
  VehicleDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  FindVehiclesFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(PARKING_SERVICE_CLIENT)
    private readonly parkingClient: ClientProxy,
  ) {}

  findAll(filters: FindVehiclesFilterDto): Observable<VehicleDto[]> {
    return this.parkingClient.send<VehicleDto[], FindVehiclesFilterDto>(
      VEHICLES_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<VehicleDto> {
    return this.parkingClient.send<VehicleDto, number>(
      VEHICLES_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateVehicleDto): Observable<VehicleDto> {
    return this.parkingClient.send<VehicleDto, CreateVehicleDto>(
      VEHICLES_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateVehicleDto): Observable<VehicleDto> {
    return this.parkingClient.send<
      VehicleDto,
      { id: number; data: UpdateVehicleDto }
    >(VEHICLES_PATTERNS.UPDATE, { id, data });
  }

  checkOut(id: number): Observable<VehicleDto> {
    return this.parkingClient.send<VehicleDto, number>(
      VEHICLES_PATTERNS.CHECKOUT,
      id,
    );
  }

  remove(id: number): Observable<VehicleDto> {
    return this.parkingClient.send<VehicleDto, number>(
      VEHICLES_PATTERNS.DELETE,
      id,
    );
  }
}
