import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WidgetsService } from './widgets.service';
import {
  WIDGETS_PATTERNS,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
} from '@app/contracts/dashboard-service';

@Controller()
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @MessagePattern(WIDGETS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateDashboardWidgetDto,
  ): Promise<DashboardWidgetDto> {
    return this.widgetsService.create(data);
  }

  @MessagePattern(WIDGETS_PATTERNS.FIND_ALL)
  findAll(): Promise<DashboardWidgetDto[]> {
    return this.widgetsService.findAll();
  }

  @MessagePattern(WIDGETS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<DashboardWidgetDto> {
    return this.widgetsService.findOne(id);
  }

  @MessagePattern(WIDGETS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateDashboardWidgetDto },
  ): Promise<DashboardWidgetDto> {
    return this.widgetsService.update(payload.id, payload.data);
  }

  @MessagePattern(WIDGETS_PATTERNS.DELETE)
  delete(@Payload() id: number): Promise<DashboardWidgetDto> {
    return this.widgetsService.delete(id);
  }

  @MessagePattern(WIDGETS_PATTERNS.FIND_BY_USER)
  findByUser(@Payload() userId: number): Promise<DashboardWidgetDto[]> {
    return this.widgetsService.findByUser(userId);
  }
}
