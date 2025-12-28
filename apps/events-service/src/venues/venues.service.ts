import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsWhere,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { Venue } from './entities';
import {
  VenueDto,
  CreateVenueDto,
  UpdateVenueDto,
  FindVenuesFilterDto,
} from '@app/contracts/events-service';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  private readonly venueSelect: FindOptionsSelect<Venue> = {
    id: true,
    name: true,
    capacity: true,
    area: true,
    hourlyRate: true,
    available: true,
    location: true,
    description: true,
    createdAt: true,
    updatedAt: true,
  };

  create(data: CreateVenueDto): Promise<VenueDto> {
    return this.venueRepository.save(data);
  }

  findAll(filters: FindVenuesFilterDto = {}): Promise<VenueDto[]> {
    const where: FindOptionsWhere<Venue> = {};

    if (filters.isAvailable !== undefined) {
      where.available = filters.isAvailable;
    }

    if (filters.minCapacity !== undefined) {
      where.capacity = MoreThanOrEqual(filters.minCapacity);
    }

    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }

    return this.venueRepository.find({
      where,
      select: this.venueSelect,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<VenueDto> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      select: this.venueSelect,
    });

    if (!venue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${id} not found`,
      });
    }

    return venue;
  }

  async update(id: number, data: UpdateVenueDto): Promise<VenueDto> {
    const existingVenue = await this.venueRepository.findOne({ where: { id } });

    if (!existingVenue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${id} not found`,
      });
    }

    await this.venueRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<VenueDto> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      select: this.venueSelect,
    });

    if (!venue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${id} not found`,
      });
    }

    await this.venueRepository.remove(venue);
    return venue;
  }

  findOneEntity(id: number): Promise<Venue | null> {
    return this.venueRepository.findOne({ where: { id } });
  }
}
