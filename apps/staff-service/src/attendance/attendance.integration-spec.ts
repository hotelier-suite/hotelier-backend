import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { AttendanceModule } from './attendance.module';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeesService } from '../employees/employees.service';
import { AttendanceStatus, Department } from '@app/contracts/staff-service';

describe('AttendanceService (integration)', () => {
  let module: TestingModule;
  let service: AttendanceService;
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
            entities: [Attendance, Employee],
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
        AttendanceModule,
        EmployeesModule,
      ],
    }).compile();

    service = module.get(AttendanceService);
    employeesService = module.get(EmployeesService);

    const employee = await employeesService.create({
      employeeId: 'ATT-EMP-001',
      name: 'Attendance Test Employee',
      department: Department.FRONT_DESK,
      position: 'Receptionist',
    });
    employeeId = employee.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an attendance record', async () => {
    const result = await service.create({
      date: new Date('2026-01-15'),
      checkIn: '08:00',
      employeeId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.employeeId).toBe(employeeId);
    expect(result.status).toBe(AttendanceStatus.PRESENT);
  });

  it('should find all attendance records', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find attendance by id', async () => {
    const created = await service.create({
      date: new Date('2026-01-16'),
      checkIn: '09:00',
      employeeId,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update an attendance record', async () => {
    const created = await service.create({
      date: new Date('2026-01-17'),
      checkIn: '08:30',
      employeeId,
    });

    const updated = await service.update(created.id, {
      checkOut: '17:30',
    });
    expect(updated.checkOut).toBe('17:30');
  });

  it('should filter by employeeId', async () => {
    const results = await service.findAll({ employeeId });
    results.forEach((a) => expect(a.employeeId).toBe(employeeId));
  });

  it('should remove an attendance record', async () => {
    const created = await service.create({
      date: new Date('2026-01-18'),
      employeeId,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
