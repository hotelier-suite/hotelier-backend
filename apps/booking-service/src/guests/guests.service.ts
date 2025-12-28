import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  GuestDto,
  CreateGuestDto,
  UpdateGuestDto,
  ListGuestsQueryDto,
} from '@app/contracts/booking-service';
import { Guest } from './entities';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestsRepository: Repository<Guest>,
  ) {}

  findAll(query?: ListGuestsQueryDto): Promise<GuestDto[]> {
    const where = query?.search
      ? [
          { name: ILike(`%${query.search}%`) },
          { email: ILike(`%${query.search}%`) },
          { phone: ILike(`%${query.search}%`) },
          { document: ILike(`%${query.search}%`) },
        ]
      : undefined;

    return this.guestsRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<GuestDto> {
    const guest = await this.guestsRepository.findOne({
      where: { id },
    });

    if (!guest) {
      throw new RpcException({
        statusCode: 404,
        message: `Guest with id ${id} not found`,
      });
    }

    return guest;
  }

  async create(data: CreateGuestDto): Promise<GuestDto> {
    const existing = await this.guestsRepository.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new RpcException({
        statusCode: 400,
        message: `Guest with email ${data.email} already exists`,
      });
    }

    return this.guestsRepository.save(data);
  }

  async update(id: number, data: UpdateGuestDto): Promise<GuestDto> {
    const existing = await this.guestsRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Guest with id ${id} not found`,
      });
    }

    if (data.email && data.email !== existing.email) {
      const duplicate = await this.guestsRepository.findOne({
        where: { email: data.email },
      });

      if (duplicate) {
        throw new RpcException({
          statusCode: 400,
          message: `Guest with email ${data.email} already exists`,
        });
      }
    }

    await this.guestsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<GuestDto> {
    const guest = await this.guestsRepository.findOne({
      where: { id },
    });

    if (!guest) {
      throw new RpcException({
        statusCode: 404,
        message: `Guest with id ${id} not found`,
      });
    }

    await this.guestsRepository.remove(guest);
    return guest;
  }
}
