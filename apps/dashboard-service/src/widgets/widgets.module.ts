import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { DashboardWidget } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardWidget])],
  controllers: [WidgetsController],
  providers: [WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
