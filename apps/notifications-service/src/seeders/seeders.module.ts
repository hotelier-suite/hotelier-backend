import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';

@Module({
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
