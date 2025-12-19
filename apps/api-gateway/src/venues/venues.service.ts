import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async create(data: CreateVenueDto): Promise<Venue> {
    return this.venueRepository.save(data);
  }

  async findAll(): Promise<Venue[]> {
    return this.venueRepository.find({
      relations: {
        events: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Venue | null> {
    return this.venueRepository.findOne({
      where: { id },
      relations: {
        events: true,
      },
    });
  }

  async update(id: number, data: UpdateVenueDto): Promise<Venue> {
    const existingVenue = await this.findOne(id);
    if (!existingVenue) {
      throw new NotFoundException(`Venue with id ${id} not found`);
    }

    await this.venueRepository.update(id, data);
    const updated = await this.findOne(id);
    return updated!;
  }

  async delete(id: number): Promise<Venue> {
    const venue = await this.findOne(id);
    if (!venue) {
      throw new NotFoundException(`Venue with id ${id} not found`);
    }
    await this.venueRepository.remove(venue);
    return venue;
  }

  async getAvailableVenues(): Promise<Venue[]> {
    return this.venueRepository.find({
      where: { available: true },
      order: { name: 'ASC' },
    });
  }
}
