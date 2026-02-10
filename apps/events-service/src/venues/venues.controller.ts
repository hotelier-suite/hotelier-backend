import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VenuesService } from './venues.service';
import {
  VENUES_PATTERNS,
  VenueDto,
  CreateVenueDto,
  UpdateVenueDto,
  FindVenuesFilterDto,
} from '@app/contracts/events-service';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @MessagePattern(VENUES_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindVenuesFilterDto): Promise<VenueDto[]> {
    return this.venuesService.findAll(filters);
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
  remove(@Payload() id: number): Promise<VenueDto> {
    return this.venuesService.remove(id);
  }
}
