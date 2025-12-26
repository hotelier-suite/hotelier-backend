import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VenuesService } from './venues.service';
import {
  VENUES_PATTERNS,
  VenueDto,
  CreateVenueDto,
  UpdateVenueDto,
} from '@app/contracts/events-service';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @MessagePattern(VENUES_PATTERNS.FIND_ALL)
  findAll(): Promise<VenueDto[]> {
    return this.venuesService.findAll();
  }

  @MessagePattern(VENUES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<VenueDto> {
    return this.venuesService.findOne(id);
  }

  @MessagePattern(VENUES_PATTERNS.CREATE)
  create(@Payload() data: CreateVenueDto): Promise<VenueDto> {
    return this.venuesService.create(data);
  }

  @MessagePattern(VENUES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateVenueDto },
  ): Promise<VenueDto> {
    return this.venuesService.update(payload.id, payload.data);
  }

  @MessagePattern(VENUES_PATTERNS.DELETE)
  delete(@Payload() id: number): Promise<VenueDto> {
    return this.venuesService.delete(id);
  }

  @MessagePattern(VENUES_PATTERNS.GET_AVAILABLE)
  getAvailable(): Promise<VenueDto[]> {
    return this.venuesService.getAvailableVenues();
  }
}
