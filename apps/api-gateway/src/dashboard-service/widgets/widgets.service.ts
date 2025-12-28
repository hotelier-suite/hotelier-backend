import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DASHBOARD_SERVICE_CLIENT } from '../constants';
import {
  WIDGETS_PATTERNS,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
  FindWidgetsFilterDto,
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

  findAll(filters: FindWidgetsFilterDto): Observable<DashboardWidgetDto[]> {
    return this.dashboardClient.send<
      DashboardWidgetDto[],
      FindWidgetsFilterDto
    >(WIDGETS_PATTERNS.FIND_ALL, filters);
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

  remove(id: number): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<DashboardWidgetDto, number>(
      WIDGETS_PATTERNS.DELETE,
      id,
    );
  }
}
