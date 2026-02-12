import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { EmployeesModule } from './employees.module';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { Department, StaffStatus } from '@app/contracts/staff-service';

describe('EmployeesService (integration)', () => {
  let module: TestingModule;
  let service: EmployeesService;

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
            entities: [Employee],
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
        EmployeesModule,
      ],
    }).compile();

    service = module.get(EmployeesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an employee', async () => {
    const result = await service.create({
      employeeId: 'EMP-001',
      name: 'John Doe',
      department: Department.FRONT_DESK,
      position: 'Receptionist',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('John Doe');
    expect(result.status).toBe(StaffStatus.ACTIVE);
  });

  it('should find all employees', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find employee by id', async () => {
    const created = await service.create({
      employeeId: 'EMP-002',
      name: 'Jane Smith',
      department: Department.HOUSEKEEPING,
      position: 'Supervisor',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.department).toBe(Department.HOUSEKEEPING);
  });

  it('should filter employees by department', async () => {
    const results = await service.findAll({
      department: Department.FRONT_DESK,
    });
    results.forEach((e) => expect(e.department).toBe(Department.FRONT_DESK));
  });

  it('should update an employee', async () => {
    const created = await service.create({
      employeeId: 'EMP-003',
      name: 'Bob Brown',
      department: Department.MAINTENANCE,
      position: 'Technician',
    });

    const updated = await service.update(created.id, {
      position: 'Senior Technician',
    });
    expect(updated.position).toBe('Senior Technician');
  });

  it('should remove an employee', async () => {
    const created = await service.create({
      employeeId: 'EMP-004',
      name: 'To Remove',
      department: Department.SECURITY,
      position: 'Guard',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should get department stats', async () => {
    const stats = await service.getDepartmentStats();
    expect(stats).toBeDefined();
    expect(Array.isArray(stats)).toBe(true);
  });
});
