import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeDto } from '@app/contracts/staff-service/employees/dto/employee.dto';
import { CreateEmployeeDto } from '@app/contracts/staff-service/employees/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@app/contracts/staff-service/employees/dto/update-employee.dto';
import { DepartmentStatsDto } from '@app/contracts/staff-service/employees/dto/department-stats.dto';
import { Department } from '@app/contracts/staff-service/employees/enums/department.enum';
import { StaffStatus } from '@app/contracts/staff-service/employees/enums/staff-status.enum';

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

    const created = await this.employeeRepository.save(data);

    const loaded = await this.employeeRepository.findOne({
      where: { id: created.id },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load employee with id ${created.id} after creation`,
      });
    }

    return loaded;
  }

  findAll(): Promise<EmployeeDto[]> {
    return this.employeeRepository.find({
      order: { name: 'ASC' },
    });
  }

  findByDepartment(department: Department): Promise<EmployeeDto[]> {
    return this.employeeRepository.find({
      where: { department },
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

  findHousekeeping(): Promise<EmployeeDto[]> {
    return this.findByDepartment(Department.HOUSEKEEPING);
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
