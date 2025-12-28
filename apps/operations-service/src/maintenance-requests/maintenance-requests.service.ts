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
    private readonly maintenanceRequestRepository: Repository<MaintenanceRequest>,
  ) {}

  findAll(): Promise<HousekeepingMaintenanceRequestDto[]> {
    return this.maintenanceRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.maintenanceRequestRepository.findOne({
      where: { id },
    });
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
    const request = this.maintenanceRequestRepository.create({
      ...data,
      status: HousekeepingMaintenanceStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
      reportDate: new Date(),
    });
    return this.maintenanceRequestRepository.save(request);
  }

  async update(
    id: number,
    data: UpdateHousekeepingMaintenanceRequestDto,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    await this.findOne(id);
    await this.maintenanceRequestRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.findOne(id);
    await this.maintenanceRequestRepository.remove(request);
    return request;
  }
}
