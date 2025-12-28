import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  CreateGuestRequestDto,
  GuestRequestDto,
  UpdateGuestRequestDto,
  GuestRequestStatus,
  FindGuestRequestsFilterDto,
} from '@app/contracts/guest-requests-service';
import { GuestRequest } from './entities';

@Injectable()
export class GuestRequestsService {
  constructor(
    @InjectRepository(GuestRequest)
    private readonly guestRequestRepository: Repository<GuestRequest>,
  ) {}

  findAll(filters: FindGuestRequestsFilterDto): Promise<GuestRequestDto[]> {
    const where: FindOptionsWhere<GuestRequest> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    return this.guestRequestRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: filters.limit,
    });
  }

  async findOne(id: number): Promise<GuestRequestDto> {
    const request = await this.guestRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new RpcException({
        statusCode: 404,
        message: `Guest request with id ${id} not found`,
      });
    }

    return request;
  }

  async create(data: CreateGuestRequestDto): Promise<GuestRequestDto> {
    const created = await this.guestRequestRepository.save(data);

    const loaded = await this.guestRequestRepository.findOne({
      where: { id: created.id },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load guest request with id ${created.id} after creation`,
      });
    }

    return loaded;
  }

  async update(
    id: number,
    data: UpdateGuestRequestDto,
  ): Promise<GuestRequestDto> {
    await this.guestRequestRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<GuestRequestDto> {
    const request = await this.findOne(id);
    await this.guestRequestRepository.remove(request as GuestRequest);
    return request;
  }

  countByStatus(status: GuestRequestStatus): Promise<number> {
    return this.guestRequestRepository.count({
      where: { status },
    });
  }
}
