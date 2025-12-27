import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DASHBOARD_SERVICE_CLIENT } from '../constants';
import {
  WIDGETS_PATTERNS,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
} from '@app/contracts/dashboard-service';

@Injectable()
export class WidgetsService {
  constructor(
    @Inject(DASHBOARD_SERVICE_CLIENT)
    private readonly dashboardClient: ClientProxy,
  ) {}

  create(data: CreateDashboardWidgetDto): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<
      DashboardWidgetDto,
      CreateDashboardWidgetDto
    >(WIDGETS_PATTERNS.CREATE, data);
  }

  findAll(): Observable<DashboardWidgetDto[]> {
    return this.dashboardClient.send<
      DashboardWidgetDto[],
      Record<string, never>
    >(WIDGETS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<DashboardWidgetDto, number>(
      WIDGETS_PATTERNS.FIND_ONE,
      id,
    );
  }

  update(
    id: number,
    data: UpdateDashboardWidgetDto,
  ): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<
      DashboardWidgetDto,
      { id: number; data: UpdateDashboardWidgetDto }
    >(WIDGETS_PATTERNS.UPDATE, { id, data });
  }

  delete(id: number): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<DashboardWidgetDto, number>(
      WIDGETS_PATTERNS.DELETE,
      id,
    );
  }

  findByUser(userId: number): Observable<DashboardWidgetDto[]> {
    return this.dashboardClient.send<DashboardWidgetDto[], number>(
      WIDGETS_PATTERNS.FIND_BY_USER,
      userId,
    );
  }
}
