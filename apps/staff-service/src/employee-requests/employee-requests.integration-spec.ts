import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { EmployeeRequestsModule } from './employee-requests.module';
import { EmployeeRequestsService } from './employee-requests.service';
import { EmployeeRequest } from './entities/employee-request.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeesService } from '../employees/employees.service';
import {
  EmployeeRequestType,
  EmployeeRequestStatus,
  Department,
} from '@app/contracts/staff-service';

describe('EmployeeRequestsService (integration)', () => {
  let module: TestingModule;
  let service: EmployeeRequestsService;
  let employeesService: EmployeesService;
  let employeeId: number;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [EmployeeRequest, Employee],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        EmployeeRequestsModule,
        EmployeesModule,
      ],
    }).compile();

    service = module.get(EmployeeRequestsService);
    employeesService = module.get(EmployeesService);

    const employee = await employeesService.create({
      employeeId: 'REQ-EMP-001',
      name: 'Request Test Employee',
      department: Department.RESTAURANT,
      position: 'Waiter',
    });
    employeeId = employee.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an employee request', async () => {
    const result = await service.create({
      employeeId,
      type: EmployeeRequestType.VACATION,
      reason: 'Family vacation',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-10'),
      days: 10,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.type).toBe(EmployeeRequestType.VACATION);
    expect(result.status).toBe(EmployeeRequestStatus.PENDING);
  });

  it('should find all requests', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find request by id', async () => {
    const created = await service.create({
      employeeId,
      type: EmployeeRequestType.SICK_LEAVE,
      reason: 'Flu',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-03'),
      days: 3,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.type).toBe(EmployeeRequestType.SICK_LEAVE);
  });

  it('should approve a request', async () => {
    const created = await service.create({
      employeeId,
      type: EmployeeRequestType.PERSONAL,
      reason: 'Personal matter',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-02'),
      days: 2,
    });

    const approved = await service.approve(created.id, 'Manager');
    expect(approved.status).toBe(EmployeeRequestStatus.APPROVED);
    expect(approved.approvedBy).toBe('Manager');
  });

  it('should reject a request', async () => {
    const created = await service.create({
      employeeId,
      type: EmployeeRequestType.VACATION,
      reason: 'Trip',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-05'),
      days: 5,
    });

    const rejected = await service.reject(created.id);
    expect(rejected.status).toBe(EmployeeRequestStatus.REJECTED);
  });

  it('should remove a request', async () => {
    const created = await service.create({
      employeeId,
      type: EmployeeRequestType.OTHER,
      reason: 'To remove',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-01'),
      days: 1,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
