import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SPACES_PATTERNS } from '@app/contracts/parking-service/spaces/spaces.patterns';
import { SpacesService } from './spaces.service';
import { ParkingSpaceDto } from '@app/contracts/parking-service/spaces/dto/parking-space.dto';
import { CreateParkingSpaceDto } from '@app/contracts/parking-service/spaces/dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from '@app/contracts/parking-service/spaces/dto/update-parking-space.dto';
import { SpaceType } from '@app/contracts/parking-service/spaces/enums/space-type.enum';

@Controller()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @MessagePattern(SPACES_PATTERNS.GET_ALL)
  findAll(): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findAll();
  }

  @MessagePattern(SPACES_PATTERNS.GET_AVAILABLE)
  findAvailable(): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findAvailable();
  }

  @MessagePattern(SPACES_PATTERNS.GET_BY_TYPE)
  findByType(@Payload() type: SpaceType): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findByType(type);
  }

  @MessagePattern(SPACES_PATTERNS.GET_BY_ZONE)
  findByZone(@Payload() zone: string): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findByZone(zone);
  }

  @MessagePattern(SPACES_PATTERNS.GET_BY_ID)
  findOne(@Payload() id: number): Promise<ParkingSpaceDto> {
    return this.spacesService.findOne(id);
  }

  @MessagePattern(SPACES_PATTERNS.GET_BY_CODE)
  findByCode(@Payload() code: string): Promise<ParkingSpaceDto> {
    return this.spacesService.findByCode(code);
  }

  @MessagePattern(SPACES_PATTERNS.CREATE)
  create(@Payload() data: CreateParkingSpaceDto): Promise<ParkingSpaceDto> {
    return this.spacesService.create(data);
  }

  @MessagePattern(SPACES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateParkingSpaceDto },
  ): Promise<ParkingSpaceDto> {
    return this.spacesService.update(payload.id, payload.data);
  }

  @MessagePattern(SPACES_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<ParkingSpaceDto> {
    return this.spacesService.remove(id);
  }
}
