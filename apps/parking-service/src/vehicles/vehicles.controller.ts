import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VEHICLES_PATTERNS } from '@app/contracts/parking-service/vehicles/vehicles.patterns';
import { VehiclesService } from './vehicles.service';
import { VehicleDto } from '@app/contracts/parking-service/vehicles/dto/vehicle.dto';
import { CreateVehicleDto } from '@app/contracts/parking-service/vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '@app/contracts/parking-service/vehicles/dto/update-vehicle.dto';
import { GuestType } from '@app/contracts/parking-service/vehicles/enums/guest-type.enum';
import { VehicleStatus } from '@app/contracts/parking-service/vehicles/enums/vehicle-status.enum';

@Controller()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @MessagePattern(VEHICLES_PATTERNS.GET_ALL)
  findAll(): Promise<VehicleDto[]> {
    return this.vehiclesService.findAll();
  }

  @MessagePattern(VEHICLES_PATTERNS.GET_BY_ID)
  findOne(@Payload() id: number): Promise<VehicleDto> {
    return this.vehiclesService.findOne(id);
  }

  @MessagePattern(VEHICLES_PATTERNS.GET_BY_LICENSE_PLATE)
  findByLicensePlate(@Payload() licensePlate: string): Promise<VehicleDto> {
    return this.vehiclesService.findByLicensePlate(licensePlate);
  }

  @MessagePattern(VEHICLES_PATTERNS.GET_BY_STATUS)
  findByStatus(@Payload() status: VehicleStatus): Promise<VehicleDto[]> {
    return this.vehiclesService.findByStatus(status);
  }

  @MessagePattern(VEHICLES_PATTERNS.GET_BY_GUEST_TYPE)
  findByGuestType(@Payload() guestType: GuestType): Promise<VehicleDto[]> {
    return this.vehiclesService.findByGuestType(guestType);
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
