import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  FindOptionsWhere,
} from 'typeorm';
import {
  EmployeeRequestDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  EmployeeRequestStatus,
  FindEmployeeRequestsFilterDto,
} from '@app/contracts/staff-service';
import { EmployeeRequest } from './entities';
import { Employee } from '../employees';

@Injectable()
export class EmployeeRequestsService {
  constructor(
    @InjectRepository(EmployeeRequest)
    private readonly employeeRequestRepository: Repository<EmployeeRequest>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  findAll(
    filters: FindEmployeeRequestsFilterDto,
  ): Promise<EmployeeRequestDto[]> {
    const where: FindOptionsWhere<EmployeeRequest> = {};

    if (filters.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.startDate && filters.endDate) {
      where.startDate = Between(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
      where.startDate = MoreThanOrEqual(filters.startDate);
    } else if (filters.endDate) {
      where.startDate = LessThanOrEqual(filters.endDate);
    }

    return this.employeeRequestRepository.find({
      where,
      relations: { employee: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<EmployeeRequestDto> {
    const request = await this.employeeRequestRepository.findOne({
      where: { id },
      relations: { employee: true },
    });

    if (!request) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee request with id ${id} not found`,
      });
    }

    return request;
  }

  async create(data: CreateEmployeeRequestDto): Promise<EmployeeRequestDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${data.employeeId} not found`,
      });
    }

    const entity = this.employeeRequestRepository.create({
      employeeId: data.employeeId,
      type: data.type,
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
    });
    return this.employeeRequestRepository.save(entity);
  }

  async update(
    id: number,
    data: UpdateEmployeeRequestDto,
  ): Promise<EmployeeRequestDto> {
    const existing = await this.findOne(id);
    const entity = this.employeeRequestRepository.create(existing);
    const merged = this.employeeRequestRepository.merge(entity, data);
    return this.employeeRequestRepository.save(merged);
  }

  approve(id: number, approvedBy: string): Promise<EmployeeRequestDto> {
    return this.update(id, {
      status: EmployeeRequestStatus.APPROVED,
      approvedBy,
    });
  }

  reject(id: number): Promise<EmployeeRequestDto> {
    return this.update(id, {
      status: EmployeeRequestStatus.REJECTED,
    });
  }

  async remove(id: number): Promise<EmployeeRequestDto> {
    const request = await this.findOne(id);
    const entity = this.employeeRequestRepository.create(request);
    return this.employeeRequestRepository.remove(entity);
  }
}
