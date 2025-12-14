import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { UpdateHotelConfigDto } from './dto/update-hotel-config.dto';
import { HotelConfigDto } from './dto/hotel-config.dto';
import { ConfigCategory } from './enums/config-category.enum';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configRepository: Repository<Configuration>,
  ) {}

  // Helpers
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

  async create(data: CreateConfigurationDto): Promise<Configuration> {
    return this.configRepository.save(data);
  }

  async findAll(): Promise<Configuration[]> {
    return this.configRepository.find({
      order: { category: 'ASC', key: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Configuration | null> {
    return this.configRepository.findOne({
      where: { id },
    });
  }

  async findByKey(key: string): Promise<Configuration | null> {
    return this.configRepository.findOne({
      where: { key },
    });
  }

  async findByCategory(category: ConfigCategory): Promise<Configuration[]> {
    return this.configRepository.find({
      where: { category },
      order: { key: 'ASC' },
    });
  }

  async updateByKey(key: string, value: string): Promise<Configuration> {
    const config = await this.findByKey(key);
    if (!config) {
      throw new NotFoundException(`Configuration with key ${key} not found`);
    }

    await this.configRepository.update(config.id, { value });
    const updated = await this.findOne(config.id);
    if (!updated) {
      throw new NotFoundException(
        `Configuration with id ${config.id} not found`,
      );
    }
    return updated;
  }

  async remove(id: number): Promise<Configuration> {
    const config = await this.findOne(id);
    if (!config) {
      throw new NotFoundException(`Configuration with id ${id} not found`);
    }
    await this.configRepository.remove(config);
    return config;
  }

  async getHotelSettings(): Promise<Record<string, string>> {
    const configs = await this.findByCategory(ConfigCategory.HOTEL);
    const settings: Record<string, string> = {};

    configs.forEach((config) => {
      settings[config.key] = config.value;
    });

    return settings;
  }

  async getSystemSettings(): Promise<Record<string, string>> {
    const configs = await this.findByCategory(ConfigCategory.SYSTEM);
    const settings: Record<string, string> = {};

    configs.forEach((config) => {
      settings[config.key] = config.value;
    });

    return settings;
  }

  async getPaymentSettings(): Promise<Record<string, string>> {
    const configs = await this.findByCategory(ConfigCategory.PAYMENT);
    const settings: Record<string, string> = {};

    configs.forEach((config) => {
      settings[config.key] = config.value;
    });

    return settings;
  }

  async getNotificationSettings(): Promise<Record<string, string>> {
    const configs = await this.findByCategory(ConfigCategory.NOTIFICATION);
    const settings: Record<string, string> = {};

    configs.forEach((config) => {
      settings[config.key] = config.value;
    });

    return settings;
  }

  async bulkUpdate(
    updates: { key: string; value: string }[],
  ): Promise<Configuration[]> {
    const results: Configuration[] = [];

    for (const update of updates) {
      const updated = await this.updateByKey(update.key, update.value);
      results.push(updated);
    }

    return results;
  }

  async update(
    id: number,
    data: UpdateConfigurationDto,
  ): Promise<Configuration> {
    await this.configRepository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Configuration with id ${id} not found`);
    }
    return updated;
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
