import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SpacesService } from './spaces.service';
import {
  SPACES_PATTERNS,
  ParkingSpaceDto,
  CreateParkingSpaceDto,
  UpdateParkingSpaceDto,
  SpaceType,
} from '@app/contracts/parking-service';

@Controller()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @MessagePattern(SPACES_PATTERNS.FIND_ALL)
  findAll(): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findAll();
  }

  @MessagePattern(SPACES_PATTERNS.FIND_AVAILABLE)
  findAvailable(): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findAvailable();
  }

  @MessagePattern(SPACES_PATTERNS.FIND_BY_TYPE)
  findByType(@Payload() type: SpaceType): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findByType(type);
  }

  @MessagePattern(SPACES_PATTERNS.FIND_BY_ZONE)
  findByZone(@Payload() zone: string): Promise<ParkingSpaceDto[]> {
    return this.spacesService.findByZone(zone);
  }

  @MessagePattern(SPACES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<ParkingSpaceDto> {
    return this.spacesService.findOne(id);
  }

  @MessagePattern(SPACES_PATTERNS.FIND_BY_CODE)
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
