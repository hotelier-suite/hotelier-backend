import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeRequestDto } from '@app/contracts/staff-service/employee-requests/dto/employee-request.dto';
import { CreateEmployeeRequestDto } from '@app/contracts/staff-service/employee-requests/dto/create-employee-request.dto';
import { UpdateEmployeeRequestDto } from '@app/contracts/staff-service/employee-requests/dto/update-employee-request.dto';
import { RequestType } from '@app/contracts/staff-service/employee-requests/enums/request-type.enum';
import { RequestStatus } from '@app/contracts/staff-service/employee-requests/enums/request-status.enum';
import { EmployeeRequest } from './entities/employee-request.entity';
import { Employee } from '../employees/entities/employee.entity';

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

  findByStatus(status: RequestStatus): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository.find({
      where: { status },
      relations: { employee: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByType(type: RequestType): Promise<EmployeeRequestDto[]> {
    return this.employeeRequestRepository.find({
      where: { type },
      relations: { employee: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByDateRange(
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<EmployeeRequestDto[]> {
    const parsedStartDate = this.toDate(startDate);
    const parsedEndDate = this.toDate(endDate);

    return this.employeeRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.employee', 'employee')
      .where(
        'request.startDate >= :startDate AND request.endDate <= :endDate',
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
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
      startDate: this.toDate(data.startDate),
      endDate: this.toDate(data.endDate),
      days: data.days,
      status: RequestStatus.PENDING,
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
      status: RequestStatus.APPROVED,
      approvedBy,
    });
  }

  reject(id: number): Promise<EmployeeRequestDto> {
    return this.update(id, {
      status: RequestStatus.REJECTED,
    });
  }

  async remove(id: number): Promise<EmployeeRequestDto> {
    const request = await this.findOne(id);

    await this.employeeRequestRepository.delete(id);

    return request;
  }

  private toDate(input: unknown): Date {
    if (input instanceof Date) {
      return input;
    }

    if (typeof input === 'string' || typeof input === 'number') {
      const parsed = new Date(input);

      if (Number.isNaN(parsed.getTime())) {
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid date',
        });
      }

      return parsed;
    }

    const parsed = new Date(input as string);

    if (Number.isNaN(parsed.getTime())) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid date',
      });
    }

    return parsed;
  }
}
