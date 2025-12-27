import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DashboardWidget } from './entities';
import {
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
} from '@app/contracts/dashboard-service';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly widgetRepository: Repository<DashboardWidget>,
  ) {}

  async create(data: CreateDashboardWidgetDto): Promise<DashboardWidgetDto> {
    const widget = this.widgetRepository.create(data);
    return this.widgetRepository.save(widget);
  }

  async findAll(): Promise<DashboardWidgetDto[]> {
    return this.widgetRepository.find({
      where: { visible: true },
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

  async findByUser(userId: number): Promise<DashboardWidgetDto[]> {
    return this.widgetRepository.find({
      where: { userId, visible: true },
      order: { position: 'ASC' },
    });
  }
}
