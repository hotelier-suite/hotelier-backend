import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../entities';
import { SuppliersSeeder } from './suppliers.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SuppliersSeeder],
  exports: [SuppliersSeeder],
})
export class SuppliersSeedersModule {}
