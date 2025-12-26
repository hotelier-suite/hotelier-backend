import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CONFIGURATION_PATTERNS,
  HotelConfigDto,
  UpdateHotelConfigDto,
} from '@app/contracts/config-service';
import { CONFIG_SERVICE_CLIENT } from '../constants';

@Injectable()
export class ConfigurationService {
  constructor(
    @Inject(CONFIG_SERVICE_CLIENT) private readonly configClient: ClientProxy,
  ) {}

  getHotelConfig(): Observable<HotelConfigDto> {
    return this.configClient.send<HotelConfigDto, Record<string, never>>(
      CONFIGURATION_PATTERNS.GET_HOTEL_CONFIG,
      {},
    );
  }

  updateHotelConfig(data: UpdateHotelConfigDto): Observable<HotelConfigDto> {
    return this.configClient.send<HotelConfigDto, UpdateHotelConfigDto>(
      CONFIGURATION_PATTERNS.UPDATE_HOTEL_CONFIG,
      data,
    );
  }
}
