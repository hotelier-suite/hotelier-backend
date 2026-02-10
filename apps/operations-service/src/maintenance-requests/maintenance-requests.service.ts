import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from './entities';
import {
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
} from '@app/contracts/operations-service';

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
    const entity = this.maintenanceRequestRepository.create(data);
    return this.maintenanceRequestRepository.save(entity);
  }

  async update(
    id: number,
    data: UpdateHousekeepingMaintenanceRequestDto,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    const existing = await this.findOne(id);
    const entity = this.maintenanceRequestRepository.create(existing);
    const merged = this.maintenanceRequestRepository.merge(entity, data);
    return this.maintenanceRequestRepository.save(merged);
  }

  async remove(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.findOne(id);
    const entity = this.maintenanceRequestRepository.create(request);
    return this.maintenanceRequestRepository.remove(entity);
  }
}
