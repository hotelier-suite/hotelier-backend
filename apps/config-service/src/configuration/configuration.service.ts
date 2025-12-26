import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities';
import { ConfigCategory } from './enums';
import {
  HotelConfigDto,
  UpdateHotelConfigDto,
} from '@app/contracts/config-service';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configRepository: Repository<Configuration>,
  ) {}

  private async getValue(
    category: ConfigCategory,
    key: string,
  ): Promise<string | null> {
    const record = await this.configRepository.findOne({
      where: { category, key },
    });

    return record?.value ?? null;
  }

  private async setValue(
    category: ConfigCategory,
    key: string,
    value: string,
    description = '',
  ): Promise<void> {
    const existing = await this.configRepository.findOne({
      where: { category, key },
    });

    if (existing) {
      if (existing.value !== value || existing.description !== description) {
        await this.configRepository.update(existing.id, { value, description });
      }
      return;
    }

    await this.configRepository.save({
      category,
      key,
      value,
      description,
      isEditable: true,
    });
  }

  async getHotelConfig(): Promise<HotelConfigDto> {
    const propName =
      (await this.getValue(ConfigCategory.HOTEL, 'PROPERTY_NAME')) ?? '';
    const address =
      (await this.getValue(ConfigCategory.HOTEL, 'PROPERTY_ADDRESS')) ?? '';
    const phone =
      (await this.getValue(ConfigCategory.HOTEL, 'PROPERTY_PHONE')) ?? '';
    const email =
      (await this.getValue(ConfigCategory.HOTEL, 'PROPERTY_EMAIL')) ?? '';
    const checkIn =
      (await this.getValue(ConfigCategory.HOTEL, 'CHECKIN_TIME')) ?? '15:00';
    const checkOut =
      (await this.getValue(ConfigCategory.HOTEL, 'CHECKOUT_TIME')) ?? '11:00';
    const cancel =
      (await this.getValue(ConfigCategory.HOTEL, 'CANCELLATION_POLICY')) ?? '';
    const timezone =
      (await this.getValue(ConfigCategory.HOTEL, 'TIMEZONE')) ?? 'UTC';

    return {
      id: 1,
      propertyName: propName,
      propertyAddress: address,
      propertyPhone: phone,
      propertyEmail: email,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      cancellationPolicy: cancel,
      timeZone: timezone,
    };
  }

  async updateHotelConfig(data: UpdateHotelConfigDto): Promise<HotelConfigDto> {
    const map: Record<string, string | undefined> = {
      PROPERTY_NAME: data.name,
      PROPERTY_ADDRESS: data.address,
      PROPERTY_PHONE: data.phone,
      PROPERTY_EMAIL: data.email,
      CHECKIN_TIME: data.checkInTime,
      CHECKOUT_TIME: data.checkOutTime,
      TIMEZONE: data.timezone,
    };

    for (const [k, v] of Object.entries(map)) {
      if (typeof v !== 'undefined') {
        await this.setValue(
          ConfigCategory.HOTEL,
          k,
          String(v),
          `Hotel setting ${k}`,
        );
      }
    }

    return this.getHotelConfig();
  }
}
