import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MaintenanceRequestsService } from './maintenance-requests.service';
import {
  MAINTENANCE_REQUESTS_PATTERNS,
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
} from '@app/contracts/operations-service';

@Controller()
export class MaintenanceRequestsController {
  constructor(
    private readonly maintenanceRequestsService: MaintenanceRequestsService,
  ) {}

  @MessagePattern(MAINTENANCE_REQUESTS_PATTERNS.FIND_ALL)
  findAll(): Promise<HousekeepingMaintenanceRequestDto[]> {
    return this.maintenanceRequestsService.findAll();
  }

  @MessagePattern(MAINTENANCE_REQUESTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.findOne(id);
  }

  @MessagePattern(MAINTENANCE_REQUESTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateHousekeepingMaintenanceRequestDto,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.create(data);
  }

  @MessagePattern(MAINTENANCE_REQUESTS_PATTERNS.UPDATE)
  update(
    @Payload()
    payload: {
      id: number;
      data: UpdateHousekeepingMaintenanceRequestDto;
    },
  ): Promise<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.update(payload.id, payload.data);
  }

  @MessagePattern(MAINTENANCE_REQUESTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.remove(id);
  }
}
