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
    private readonly widgetRepository: Repository<DashboardWidget>,
  ) {}

  create(data: CreateDashboardWidgetDto): Promise<DashboardWidgetDto> {
    const widget = this.widgetRepository.create(data);
    return this.widgetRepository.save(widget);
  }

  findAll(filters: FindWidgetsFilterDto): Promise<DashboardWidgetDto[]> {
    const where: FindOptionsWhere<DashboardWidget> = { visible: true };

    if (filters.userId) {
      where.userId = filters.userId;
    }

    return this.widgetRepository.find({
      where,
      order: { position: 'ASC' },
    });
  }

  async findOne(id: number): Promise<DashboardWidgetDto> {
    const widget = await this.widgetRepository.findOne({ where: { id } });
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
    Object.assign(widget, data);
    return this.widgetRepository.save(widget as DashboardWidget);
  }

  async remove(id: number): Promise<DashboardWidgetDto> {
    const widget = await this.findOne(id);
    await this.widgetRepository.remove(widget as DashboardWidget);
    return { ...widget, id };
  }
}
