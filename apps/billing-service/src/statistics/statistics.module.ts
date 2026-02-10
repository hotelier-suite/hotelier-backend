import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Invoice } from '../invoices/entities';
import { Payment } from '../payments/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Payment])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
