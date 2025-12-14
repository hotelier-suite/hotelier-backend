import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { Configuration } from './entities/configuration.entity';
import { SeedersService as ConfigurationSeedersService } from './seeders/seeders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService, ConfigurationSeedersService],
  exports: [ConfigurationService, ConfigurationSeedersService],
})
export class ConfigurationModule {}
