import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from './entities';
import {
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class MaintenanceRequestsService {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private readonly requestRepository: Repository<MaintenanceRequest>,
  ) {}

  findAll(): Promise<HousekeepingMaintenanceRequestDto[]> {
    return this.requestRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new RpcException({
        statusCode: 404,
        message: `Maintenance request with id ${id} not found`,
      });
    }
    return request;
  }

  create(
    data: CreateHousekeepingMaintenanceRequestDto,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    const request = this.requestRepository.create({
      ...data,
      status: HousekeepingMaintenanceStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
      reportDate: new Date(),
    });
    return this.requestRepository.save(request);
  }

  async update(
    id: number,
    data: UpdateHousekeepingMaintenanceRequestDto,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    await this.findOne(id);
    await this.requestRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.findOne(id);
    await this.requestRepository.remove(request);
    return request;
  }
}
