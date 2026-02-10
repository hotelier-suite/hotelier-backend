import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConfigurationService } from './configuration.service';
import {
  CONFIGURATION_PATTERNS,
  HotelConfigDto,
  UpdateHotelConfigDto,
} from '@app/contracts/config-service';

@Controller()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @MessagePattern(CONFIGURATION_PATTERNS.GET_HOTEL_CONFIG)
  getHotelConfig(): Promise<HotelConfigDto> {
    return this.configurationService.getHotelConfig();
  }

  @MessagePattern(CONFIGURATION_PATTERNS.UPDATE_HOTEL_CONFIG)
  updateHotelConfig(
    @Payload() data: UpdateHotelConfigDto,
  ): Promise<HotelConfigDto> {
    return this.configurationService.updateHotelConfig(data);
  }
}
