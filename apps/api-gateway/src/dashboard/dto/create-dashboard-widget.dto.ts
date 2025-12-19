import { OmitType } from '@nestjs/swagger';
import { DashboardWidget } from '../entities/dashboard-widget.entity';

export class CreateDashboardWidgetDto extends OmitType(DashboardWidget, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
