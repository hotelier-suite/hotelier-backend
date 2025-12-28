import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { ParkingIncident } from './entities';
import {
  ParkingIncidentDto,
  CreateParkingIncidentDto,
  UpdateParkingIncidentDto,
  IncidentStatus,
  FindIncidentsFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(ParkingIncident)
    private readonly parkingIncidentRepository: Repository<ParkingIncident>,
  ) {}

  private readonly parkingIncidentReadSelect: FindOptionsSelect<ParkingIncident> =
    {
      id: true,
      type: true,
      description: true,
      reportDate: true,
      status: true,
      responsible: true,
      priority: true,
      resolution: true,
      resolvedAt: true,
      createdAt: true,
      updatedAt: true,
      vehicleId: true,
      spaceId: true,
    };

  findAll(filters: FindIncidentsFilterDto): Promise<ParkingIncidentDto[]> {
    return this.parkingIncidentRepository.find({
      where: filters,
      select: this.parkingIncidentReadSelect,
      order: { reportDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ParkingIncidentDto> {
    const incident = await this.parkingIncidentRepository.findOne({
      where: { id },
      select: this.parkingIncidentReadSelect,
    });

    if (!incident) {
      throw new RpcException({
        statusCode: 404,
        message: `Incident with id ${id} not found`,
      });
    }

    return incident;
  }

  async create(data: CreateParkingIncidentDto): Promise<ParkingIncidentDto> {
    const created = await this.parkingIncidentRepository.save({
      ...data,
      status: IncidentStatus.PENDING,
      reportDate: new Date(),
    });

    const loaded = await this.parkingIncidentRepository.findOne({
      where: { id: created.id },
      select: this.parkingIncidentReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load incident with id ${created.id} after creation`,
      });
    }

    return loaded;
  }

  async update(
    id: number,
    data: UpdateParkingIncidentDto,
  ): Promise<ParkingIncidentDto> {
    await this.parkingIncidentRepository.update(id, data);

    return this.findOne(id);
  }

  async remove(id: number): Promise<ParkingIncidentDto> {
    const incident = await this.findOne(id);
    await this.parkingIncidentRepository.remove(incident);
    return incident;
  }
}
