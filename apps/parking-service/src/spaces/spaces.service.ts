import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { ParkingSpace } from './entities';
import {
  ParkingSpaceDto,
  CreateParkingSpaceDto,
  UpdateParkingSpaceDto,
  FindSpacesFilterDto,
} from '@app/contracts/parking-service';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(ParkingSpace)
    private readonly parkingSpaceRepository: Repository<ParkingSpace>,
  ) {}

  private readonly parkingSpaceSelect: FindOptionsSelect<ParkingSpace> = {
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
    vehicles: {
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
    },
  };

  private readonly parkingSpaceRelations: FindOptionsRelations<ParkingSpace> = {
    vehicles: true,
  };

  findAll(filters: FindSpacesFilterDto): Promise<ParkingSpaceDto[]> {
    return this.parkingSpaceRepository.find({
      where: filters,
      select: this.parkingSpaceSelect,
      relations: this.parkingSpaceRelations,
      order: { code: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ParkingSpaceDto> {
    const space = await this.parkingSpaceRepository.findOne({
      where: { id },
      select: this.parkingSpaceSelect,
      relations: this.parkingSpaceRelations,
    });

    if (!space) {
      throw new RpcException({
        statusCode: 404,
        message: `Parking space with id ${id} not found`,
      });
    }

    return space;
  }

  create(data: CreateParkingSpaceDto): Promise<ParkingSpaceDto> {
    const entity = this.parkingSpaceRepository.create(data);
    return this.parkingSpaceRepository.save(entity);
  }

  async update(
    id: number,
    data: UpdateParkingSpaceDto,
  ): Promise<ParkingSpaceDto> {
    const existing = await this.findOne(id);
    const entity = this.parkingSpaceRepository.create(existing);
    const merged = this.parkingSpaceRepository.merge(entity, data);
    return this.parkingSpaceRepository.save(merged);
  }

  async remove(id: number): Promise<ParkingSpaceDto> {
    const space = await this.findOne(id);
    const entity = this.parkingSpaceRepository.create(space);
    return this.parkingSpaceRepository.remove(entity);
  }
}
