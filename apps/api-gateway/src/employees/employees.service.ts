import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DepartmentStatsDto } from './dto/department-stats.dto';
import { Department } from './enums/department.enum';
import { StaffStatus } from './enums/staff-status.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.employeeRepository.save(data);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByDepartment(department: Department): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { department },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, data: UpdateEmployeeDto): Promise<Employee> {
    await this.employeeRepository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<Employee> {
    const employee = await this.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    await this.employeeRepository.remove(employee);
    return employee;
  }

  async getHousekeepingEmployees(): Promise<Employee[]> {
    return this.findByDepartment(Department.HOUSEKEEPING);
  }

  async getEmployeesByStatus(isActive: boolean): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { status: isActive ? StaffStatus.ACTIVE : StaffStatus.INACTIVE },
      order: { name: 'ASC' },
    });
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
