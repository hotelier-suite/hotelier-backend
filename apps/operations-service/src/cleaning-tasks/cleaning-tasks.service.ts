import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningTask } from './entities';
import {
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
  CleaningStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class CleaningTasksService {
  constructor(
    @InjectRepository(CleaningTask)
    private readonly cleaningTaskRepository: Repository<CleaningTask>,
  ) {}

  findAll(): Promise<CleaningTaskDto[]> {
    return this.cleaningTaskRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<CleaningTaskDto> {
    const task = await this.cleaningTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new RpcException({
        statusCode: 404,
        message: `Cleaning task with id ${id} not found`,
      });
    }
    return task;
  }

  create(data: CreateCleaningTaskDto): Promise<CleaningTaskDto> {
    return this.cleaningTaskRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateCleaningTaskDto,
  ): Promise<CleaningTaskDto> {
    await this.findOne(id);
    await this.cleaningTaskRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<CleaningTaskDto> {
    const task = await this.findOne(id);
    await this.cleaningTaskRepository.remove(task);
    return task;
  }
}
