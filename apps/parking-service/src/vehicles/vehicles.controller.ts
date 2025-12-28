import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VehiclesService } from './vehicles.service';
import {
  VEHICLES_PATTERNS,
  VehicleDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  FindVehiclesFilterDto,
} from '@app/contracts/parking-service';

@Controller()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @MessagePattern(VEHICLES_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindVehiclesFilterDto): Promise<VehicleDto[]> {
    return this.vehiclesService.findAll(filters);
  }

  @MessagePattern(VEHICLES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<VehicleDto> {
    return this.vehiclesService.findOne(id);
  }

  @MessagePattern(VEHICLES_PATTERNS.CREATE)
  create(@Payload() data: CreateVehicleDto): Promise<VehicleDto> {
    return this.vehiclesService.create(data);
  }

  @MessagePattern(VEHICLES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateVehicleDto },
  ): Promise<VehicleDto> {
    return this.vehiclesService.update(payload.id, payload.data);
  }

  @MessagePattern(VEHICLES_PATTERNS.CHECKOUT)
  checkOut(@Payload() id: number): Promise<VehicleDto> {
    return this.vehiclesService.checkOut(id);
  }

  @MessagePattern(VEHICLES_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<VehicleDto> {
    return this.vehiclesService.remove(id);
  }
}
