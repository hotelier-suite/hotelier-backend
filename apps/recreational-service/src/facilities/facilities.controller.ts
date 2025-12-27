import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacilitiesService } from './facilities.service';
import {
  RECREATIONAL_FACILITIES_PATTERNS,
  RecreationalFacilityDto,
  CreateRecreationalFacilityDto,
  UpdateRecreationalFacilityDto,
  FacilityAvailabilityDto,
  FacilityType,
} from '@app/contracts/recreational-service';

@Controller()
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_ALL)
  findAll(): Promise<RecreationalFacilityDto[]> {
    return this.facilitiesService.findAll();
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<RecreationalFacilityDto> {
    return this.facilitiesService.findOne(id);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.CREATE)
  create(
    @Payload() data: CreateRecreationalFacilityDto,
  ): Promise<RecreationalFacilityDto> {
    return this.facilitiesService.create(data);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateRecreationalFacilityDto },
  ): Promise<RecreationalFacilityDto> {
    return this.facilitiesService.update(payload.id, payload.data);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<RecreationalFacilityDto> {
    return this.facilitiesService.remove(id);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_AVAILABLE)
  findAvailable(): Promise<RecreationalFacilityDto[]> {
    return this.facilitiesService.findAvailable();
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_BY_TYPE)
  findByType(
    @Payload() type: FacilityType,
  ): Promise<RecreationalFacilityDto[]> {
    return this.facilitiesService.findByType(type);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.GET_AVAILABILITY)
  getAvailability(
    @Payload() payload: { facilityId: number; date: Date },
  ): Promise<FacilityAvailabilityDto> {
    return this.facilitiesService.getAvailability(
      payload.facilityId,
      payload.date,
    );
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.GET_MULTIPLE_AVAILABILITY)
  getMultipleAvailability(
    @Payload() payload: { facilityIds: number[]; date: Date },
  ): Promise<FacilityAvailabilityDto[]> {
    return this.facilitiesService.getMultipleAvailability(
      payload.facilityIds,
      payload.date,
    );
  }
}
