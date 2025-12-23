import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { AuthModule } from '../auth-service/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardWidget]), AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
