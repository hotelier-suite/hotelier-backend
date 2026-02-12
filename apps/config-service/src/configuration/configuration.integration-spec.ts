import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { ConfigurationModule } from './configuration.module';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './entities/configuration.entity';

describe('ConfigurationService (integration)', () => {
  let module: TestingModule;
  let service: ConfigurationService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [Configuration],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        ConfigurationModule,
      ],
    }).compile();

    service = module.get(ConfigurationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should return default hotel config when no keys exist', async () => {
    const config = await service.getHotelConfig();

    expect(config).toBeDefined();
    expect(config.propertyName).toBe('');
    expect(config.propertyAddress).toBe('');
    expect(config.propertyEmail).toBe('');
  });

  it('should update and retrieve hotel config', async () => {
    await service.updateHotelConfig({
      name: 'Test Hotel',
      address: '123 Main St',
      phone: '+1234567890',
      email: 'test@hotel.com',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      timezone: 'America/New_York',
    });

    const config = await service.getHotelConfig();

    expect(config.propertyName).toBe('Test Hotel');
    expect(config.propertyAddress).toBe('123 Main St');
    expect(config.propertyPhone).toBe('+1234567890');
    expect(config.propertyEmail).toBe('test@hotel.com');
    expect(config.checkInTime).toBe('15:00');
    expect(config.checkOutTime).toBe('11:00');
    expect(config.timeZone).toBe('America/New_York');
  });

  it('should partially update hotel config', async () => {
    await service.updateHotelConfig({ name: 'Updated Hotel' });

    const config = await service.getHotelConfig();
    expect(config.propertyName).toBe('Updated Hotel');
    expect(config.propertyPhone).toBe('+1234567890');
  });
});
