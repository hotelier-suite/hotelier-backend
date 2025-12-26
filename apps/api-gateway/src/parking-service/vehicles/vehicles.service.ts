import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PARKING_SERVICE_CLIENT } from '../constants';
import {
  VEHICLES_PATTERNS,
  VehicleDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleStatus,
  GuestType,
} from '@app/contracts/parking-service';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(PARKING_SERVICE_CLIENT)
    private readonly parkingClient: ClientProxy,
  ) {}

  findAll(): Observable<VehicleDto[]> {
    return this.parkingClient.send<VehicleDto[], Record<string, never>>(
      VEHICLES_PATTERNS.GET_ALL,
      {},
    );
  }

  findByStatus(status: VehicleStatus): Observable<VehicleDto[]> {
    return this.parkingClient.send<VehicleDto[], VehicleStatus>(
      VEHICLES_PATTERNS.GET_BY_STATUS,
      status,
    );
  }

  findByGuestType(guestType: GuestType): Observable<VehicleDto[]> {
    return this.parkingClient.send<VehicleDto[], GuestType>(
      VEHICLES_PATTERNS.GET_BY_GUEST_TYPE,
      guestType,
    );
  }

  findOne(id: number): Observable<VehicleDto> {
    return this.parkingClient.send<VehicleDto, number>(
      VEHICLES_PATTERNS.GET_BY_ID,
      id,
    );
  }

  findByLicensePlate(licensePlate: string): Observable<VehicleDto> {
    return this.parkingClient.send<VehicleDto, string>(
      VEHICLES_PATTERNS.GET_BY_LICENSE_PLATE,
      licensePlate,
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
