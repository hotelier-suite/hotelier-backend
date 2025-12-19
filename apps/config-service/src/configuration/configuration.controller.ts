import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CONFIGURATION_PATTERNS } from '@app/contracts/config-service/configuration/configuration.patterns';
import { ConfigurationService } from './configuration.service';
import { HotelConfigDto } from '@app/contracts/config-service/configuration/dto/hotel-config.dto';
import { UpdateHotelConfigDto } from '@app/contracts/config-service/configuration/dto/update-hotel-config.dto';

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
