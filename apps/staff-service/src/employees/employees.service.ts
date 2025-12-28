import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities';
import {
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  DepartmentStatsDto,
  Department,
  StaffStatus,
  FindEmployeesFilterDto,
} from '@app/contracts/staff-service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(data: CreateEmployeeDto): Promise<EmployeeDto> {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { employeeId: data.employeeId },
    });

    if (existingEmployee) {
      throw new RpcException({
        statusCode: 400,
        message: `Employee with employeeId ${data.employeeId} already exists`,
      });
    }

    return this.employeeRepository.save(data);
  }

  findAll(filters: FindEmployeesFilterDto): Promise<EmployeeDto[]> {
    return this.employeeRepository.find({
      where: filters,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EmployeeDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${id} not found`,
      });
    }

    return employee;
  }

  async update(id: number, data: UpdateEmployeeDto): Promise<EmployeeDto> {
    const existing = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${id} not found`,
      });
    }

    await this.employeeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<EmployeeDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: `Employee with id ${id} not found`,
      });
    }

    await this.employeeRepository.remove(employee);
    return employee;
  }

  async getDepartmentStats(): Promise<DepartmentStatsDto[]> {
    const stats: DepartmentStatsDto[] = [];

    for (const department of Object.values(Department)) {
      const total = await this.employeeRepository.count({
        where: { department },
      });

      const active = await this.employeeRepository.count({
        where: { department, status: StaffStatus.ACTIVE },
      });

      stats.push({
        department,
        activeCount: active,
        totalCount: total,
      });
    }

    return stats;
  }
}
