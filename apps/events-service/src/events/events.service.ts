import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { Event } from './entities';
import {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
} from '@app/contracts/events-service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private readonly eventSelect: FindOptionsSelect<Event> = {
    id: true,
    title: true,
    description: true,
    eventDate: true,
    startTime: true,
    endTime: true,
    venue: true,
    capacity: true,
    attendees: true,
    status: true,
    organizer: true,
    cost: true,
    revenue: true,
    createdAt: true,
    updatedAt: true,
  };

  findAll(): Promise<EventDto[]> {
    return this.eventRepository.find({
      select: this.eventSelect,
      order: { eventDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      select: this.eventSelect,
    });

    if (!event) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    return event;
  }

  create(data: CreateEventDto): Promise<EventDto> {
    return this.eventRepository.save(data);
  }

  async update(id: number, data: UpdateEventDto): Promise<EventDto> {
    const existing = await this.findOne(id);
    const entity = this.eventRepository.create(existing);
    const merged = this.eventRepository.merge(entity, data);
    return this.eventRepository.save(merged);
  }

  async remove(id: number): Promise<EventDto> {
    const event = await this.findOne(id);
    const entity = this.eventRepository.create(event);
    return this.eventRepository.remove(entity);
  }
}
