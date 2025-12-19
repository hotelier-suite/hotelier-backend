import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeRequest } from './entities/employee-request.entity';
import { CreateEmployeeRequestDto } from './dto/create-employee-request.dto';
import { UpdateEmployeeRequestDto } from './dto/update-employee-request.dto';
import { RequestType } from './enums/request-type.enum';
import { RequestStatus } from './enums/request-status.enum';

@Injectable()
export class EmployeeRequestsService {
  constructor(
    @InjectRepository(EmployeeRequest)
    private readonly employeeRequestRepository: Repository<EmployeeRequest>,
  ) {}

  async findAll(): Promise<EmployeeRequest[]> {
    return this.employeeRequestRepository.find({
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<EmployeeRequest> {
    const request = await this.employeeRequestRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!request) {
      throw new NotFoundException(`Employee request with ID ${id} not found`);
    }

    return request;
  }

  async findByEmployee(employeeId: number): Promise<EmployeeRequest[]> {
    return this.employeeRequestRepository.find({
      where: { employeeId },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: RequestStatus): Promise<EmployeeRequest[]> {
    return this.employeeRequestRepository.find({
      where: { status },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: RequestType): Promise<EmployeeRequest[]> {
    return this.employeeRequestRepository.find({
      where: { type },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeRequest[]> {
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

  async create(
    createEmployeeRequestDto: CreateEmployeeRequestDto,
  ): Promise<EmployeeRequest> {
    const request = this.employeeRequestRepository.create({
      ...createEmployeeRequestDto,
      startDate: new Date(createEmployeeRequestDto.startDate),
      endDate: new Date(createEmployeeRequestDto.endDate),
    });

    const savedRequest = await this.employeeRequestRepository.save(request);

    return this.findOne(savedRequest.id);
  }

  async update(
    id: number,
    updateEmployeeRequestDto: UpdateEmployeeRequestDto,
  ): Promise<EmployeeRequest> {
    const request = await this.findOne(id);

    Object.assign(request, updateEmployeeRequestDto);
    await this.employeeRequestRepository.save(request);

    return this.findOne(id);
  }

  async approve(id: number, approvedBy: string): Promise<EmployeeRequest> {
    return this.update(id, {
      status: RequestStatus.APPROVED,
      approvedBy,
    });
  }

  async reject(id: number): Promise<EmployeeRequest> {
    return this.update(id, {
      status: RequestStatus.REJECTED,
    });
  }

  async remove(id: number): Promise<EmployeeRequest> {
    const request = await this.findOne(id);
    await this.employeeRequestRepository.remove(request);
    return request;
  }
}
