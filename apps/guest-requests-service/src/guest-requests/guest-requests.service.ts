import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/create-guest-request.dto';
import { GuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/guest-request.dto';
import { UpdateGuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/update-guest-request.dto';
import { RequestPriority } from '@app/contracts/guest-requests-service/guest-requests/enums/request-priority.enum';
import { RequestStatus } from '@app/contracts/guest-requests-service/guest-requests/enums/request-status.enum';
import { GuestRequest } from './entities/guest-request.entity';

@Injectable()
export class GuestRequestsService {
  constructor(
    @InjectRepository(GuestRequest)
    private readonly guestRequestRepository: Repository<GuestRequest>,
  ) {}

  findAll(): Promise<GuestRequestDto[]> {
    return this.guestRequestRepository.find({
      order: { createdAt: 'DESC' },
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

  findByStatus(status: RequestStatus): Promise<GuestRequestDto[]> {
    return this.guestRequestRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  findByPriority(priority: RequestPriority): Promise<GuestRequestDto[]> {
    return this.guestRequestRepository.find({
      where: { priority },
      order: { createdAt: 'DESC' },
    });
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

  countByStatus(status: RequestStatus): Promise<number> {
    return this.guestRequestRepository.count({
      where: { status },
    });
  }

  findRecent(limit = 5): Promise<GuestRequestDto[]> {
    const take = typeof limit === 'number' && limit > 0 ? limit : 5;

    return this.guestRequestRepository.find({
      order: { createdAt: 'DESC' },
      take,
    });
  }
}
