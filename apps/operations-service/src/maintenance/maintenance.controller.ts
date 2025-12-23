import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MAINTENANCE_PATTERNS } from '@app/contracts/operations-service/maintenance/maintenance.patterns';
import {
  GeneralMaintenanceRequestDto,
  CreateGeneralMaintenanceRequestDto,
  UpdateGeneralMaintenanceRequestDto,
} from '@app/contracts/operations-service/maintenance/dto';
import { MaintenanceService } from './maintenance.service';

@Controller()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @MessagePattern(MAINTENANCE_PATTERNS.FIND_ALL_REQUESTS)
  findAll(): Promise<GeneralMaintenanceRequestDto[]> {
    return this.maintenanceService.findAll();
  }

  @MessagePattern(MAINTENANCE_PATTERNS.FIND_ONE_REQUEST)
  findOne(@Payload() id: number): Promise<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.findOne(id);
  }

  @MessagePattern(MAINTENANCE_PATTERNS.CREATE_REQUEST)
  create(
    @Payload() data: CreateGeneralMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.create(data);
  }

  @MessagePattern(MAINTENANCE_PATTERNS.UPDATE_REQUEST)
  update(
    @Payload()
    payload: {
      id: number;
      data: UpdateGeneralMaintenanceRequestDto;
    },
  ): Promise<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.update(payload.id, payload.data);
  }

  @MessagePattern(MAINTENANCE_PATTERNS.DELETE_REQUEST)
  remove(@Payload() id: number): Promise<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.remove(id);
  }
}
