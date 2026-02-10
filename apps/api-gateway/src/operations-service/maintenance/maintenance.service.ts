import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  MAINTENANCE_PATTERNS,
  GeneralMaintenanceRequestDto,
  CreateGeneralMaintenanceRequestDto,
  UpdateGeneralMaintenanceRequestDto,
} from '@app/contracts/operations-service';

@Injectable()
export class MaintenanceService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  findAll(): Observable<GeneralMaintenanceRequestDto[]> {
    return this.operationsClient.send<
      GeneralMaintenanceRequestDto[],
      Record<string, never>
    >(MAINTENANCE_PATTERNS.FIND_ALL_REQUESTS, {});
  }

  findOne(id: number): Observable<GeneralMaintenanceRequestDto> {
    return this.operationsClient.send<GeneralMaintenanceRequestDto, number>(
      MAINTENANCE_PATTERNS.FIND_ONE_REQUEST,
      id,
    );
  }

  create(
    data: CreateGeneralMaintenanceRequestDto,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.operationsClient.send<
      GeneralMaintenanceRequestDto,
      CreateGeneralMaintenanceRequestDto
    >(MAINTENANCE_PATTERNS.CREATE_REQUEST, data);
  }

  update(
    id: number,
    data: UpdateGeneralMaintenanceRequestDto,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.operationsClient.send<
      GeneralMaintenanceRequestDto,
      { id: number; data: UpdateGeneralMaintenanceRequestDto }
    >(MAINTENANCE_PATTERNS.UPDATE_REQUEST, { id, data });
  }

  remove(id: number): Observable<GeneralMaintenanceRequestDto> {
    return this.operationsClient.send<GeneralMaintenanceRequestDto, number>(
      MAINTENANCE_PATTERNS.DELETE_REQUEST,
      id,
    );
  }
}
