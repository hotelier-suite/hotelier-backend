import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { Configuration } from '../configuration';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
