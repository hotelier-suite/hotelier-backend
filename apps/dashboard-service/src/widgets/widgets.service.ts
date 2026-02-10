import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DashboardWidget } from './entities';
import {
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
  FindWidgetsFilterDto,
} from '@app/contracts/dashboard-service';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly dashboardWidgetRepository: Repository<DashboardWidget>,
  ) {}

  create(data: CreateDashboardWidgetDto): Promise<DashboardWidgetDto> {
    const entity = this.dashboardWidgetRepository.create(data);
    return this.dashboardWidgetRepository.save(entity);
  }

  findAll(filters: FindWidgetsFilterDto): Promise<DashboardWidgetDto[]> {
    const where: FindOptionsWhere<DashboardWidget> = { visible: true };

    if (filters.userId) {
      where.userId = filters.userId;
    }

    return this.dashboardWidgetRepository.find({
      where,
      order: { position: 'ASC' },
    });
  }

  async findOne(id: number): Promise<DashboardWidgetDto> {
    const widget = await this.dashboardWidgetRepository.findOne({
      where: { id },
    });
    if (!widget) {
      throw new RpcException({
        statusCode: 404,
        message: `Widget with id ${id} not found`,
      });
    }
    return widget;
  }

  async update(
    id: number,
    data: UpdateDashboardWidgetDto,
  ): Promise<DashboardWidgetDto> {
    const widget = await this.findOne(id);
    const entity = this.dashboardWidgetRepository.create(widget);
    const merged = this.dashboardWidgetRepository.merge(entity, data);
    return this.dashboardWidgetRepository.save(merged);
  }

  async remove(id: number): Promise<DashboardWidgetDto> {
    const widget = await this.findOne(id);
    const entity = this.dashboardWidgetRepository.create(widget);
    return this.dashboardWidgetRepository.remove(entity);
  }
}
