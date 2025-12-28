import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { Vehicle } from './entities';
import {
  VehicleDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleStatus,
  FindVehiclesFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  private readonly vehicleReadSelect: FindOptionsSelect<Vehicle> = {
    id: true,
    licensePlate: true,
    brand: true,
    model: true,
    color: true,
    type: true,
    owner: true,
    room: true,
    guestType: true,
    assignedSpace: true,
    entryTime: true,
    exitTime: true,
    status: true,
    notes: true,
    createdAt: true,
    updatedAt: true,
    space: {
      id: true,
      code: true,
      zone: true,
      type: true,
      status: true,
      currentVehicle: true,
      hourlyRate: true,
      location: true,
      createdAt: true,
      updatedAt: true,
    },
    incidents: {
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
    },
  };

  private readonly vehicleReadRelations: FindOptionsRelations<Vehicle> = {
    space: true,
    incidents: true,
  };

  findAll(filters: FindVehiclesFilterDto): Promise<VehicleDto[]> {
    return this.vehicleRepository.find({
      where: filters,
      select: this.vehicleReadSelect,
      relations: this.vehicleReadRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<VehicleDto> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      select: this.vehicleReadSelect,
      relations: this.vehicleReadRelations,
    });

    if (!vehicle) {
      throw new RpcException({
        statusCode: 404,
        message: `Vehicle with id ${id} not found`,
      });
    }

    return vehicle;
  }

  async create(data: CreateVehicleDto): Promise<VehicleDto> {
    const created = await this.vehicleRepository.save({
      ...data,
      status: VehicleStatus.PARKED,
    });

    const loaded = await this.vehicleRepository.findOne({
      where: { id: created.id },
      select: this.vehicleReadSelect,
      relations: this.vehicleReadRelations,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load vehicle with id ${created.id} after creation`,
      });
    }

    return loaded;
  }

  async update(id: number, data: UpdateVehicleDto): Promise<VehicleDto> {
    await this.vehicleRepository.update(id, data);

    return this.findOne(id);
  }

  checkOut(id: number): Promise<VehicleDto> {
    return this.update(id, {
      status: VehicleStatus.EXITED,
      exitTime: new Date(),
    });
  }

  async remove(id: number): Promise<VehicleDto> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
    return vehicle;
  }
}
