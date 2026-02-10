import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  MAINTENANCE_REQUESTS_PATTERNS,
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
} from '@app/contracts/operations-service';

@Injectable()
export class MaintenanceRequestsService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  findAll(): Observable<HousekeepingMaintenanceRequestDto[]> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto[],
      Record<string, never>
    >(MAINTENANCE_REQUESTS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      number
    >(MAINTENANCE_REQUESTS_PATTERNS.FIND_ONE, id);
  }

  create(
    data: CreateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      CreateHousekeepingMaintenanceRequestDto
    >(MAINTENANCE_REQUESTS_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      { id: number; data: UpdateHousekeepingMaintenanceRequestDto }
    >(MAINTENANCE_REQUESTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      number
    >(MAINTENANCE_REQUESTS_PATTERNS.DELETE, id);
  }
}
