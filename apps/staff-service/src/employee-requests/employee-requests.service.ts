import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EmployeeRequestDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  EmployeeRequestType,
  EmployeeRequestStatus,
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

  findAll(): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository.find({
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

  findByEmployee(employeeId: number): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository.find({
      where: { employeeId },
      relations: { employee: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByStatus(status: EmployeeRequestStatus): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository.find({
      where: { status },
      relations: { employee: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByType(type: EmployeeRequestType): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository.find({
      where: { type },
      relations: { employee: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.employee', 'employee')
      .where(
        'request.startDate >= :startDate AND request.endDate <= :endDate',
        {
          startDate,
          endDate,
        },
      )
      .orderBy('request.createdAt', 'DESC')
      .getMany();
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

    const request = this.employeeRequestRepository.create({
      employeeId: data.employeeId,
      type: data.type,
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      status: EmployeeRequestStatus.PENDING,
    });

    const savedRequest = await this.employeeRequestRepository.save(request);

    return this.findOne(savedRequest.id);
  }

  async update(
    id: number,
    data: UpdateEmployeeRequestDto,
  ): Promise<EmployeeRequestDto> {
    await this.findOne(id);

    await this.employeeRequestRepository.update(id, data);

    return this.findOne(id);
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

    await this.employeeRequestRepository.delete(id);

    return request;
  }
}
