import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { of } from 'rxjs';
import { ShiftsModule } from './shifts.module';
import { ShiftsService } from './shifts.service';
import { Shift } from './entities/shift.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeesService } from '../employees/employees.service';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';
import {
  ShiftType,
  ShiftStatus,
  Department,
} from '@app/contracts/staff-service';

describe('ShiftsService (integration)', () => {
  let module: TestingModule;
  let service: ShiftsService;
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
            entities: [Shift, Employee],
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
        ShiftsModule,
        EmployeesModule,
        {
          module: class MockNotifications {},
          global: true,
          providers: [
            {
              provide: NotificationsService,
              useValue: { create: jest.fn().mockReturnValue(of({})) },
            },
          ],
          exports: [NotificationsService],
        },
      ],
    }).compile();

    service = module.get(ShiftsService);
    employeesService = module.get(EmployeesService);

    const employee = await employeesService.create({
      employeeId: 'SHIFT-EMP-001',
      name: 'Shift Test Employee',
      department: Department.FRONT_DESK,
      position: 'Receptionist',
    });
    employeeId = employee.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a shift', async () => {
    const result = await service.create({
      date: new Date('2026-03-01'),
      startTime: '08:00',
      endTime: '16:00',
      type: ShiftType.MORNING,
      status: ShiftStatus.SCHEDULED,
      position: 'Receptionist',
      department: 'Front Desk',
      employeeId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.type).toBe(ShiftType.MORNING);
    expect(result.status).toBe(ShiftStatus.SCHEDULED);
  });

  it('should find all shifts', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find shift by id', async () => {
    const created = await service.create({
      date: new Date('2026-03-02'),
      startTime: '16:00',
      endTime: '00:00',
      type: ShiftType.AFTERNOON,
      status: ShiftStatus.SCHEDULED,
      position: 'Receptionist',
      department: 'Front Desk',
      employeeId,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.type).toBe(ShiftType.AFTERNOON);
  });

  it('should update a shift', async () => {
    const created = await service.create({
      date: new Date('2026-03-03'),
      startTime: '08:00',
      endTime: '16:00',
      type: ShiftType.MORNING,
      status: ShiftStatus.SCHEDULED,
      position: 'Receptionist',
      department: 'Front Desk',
      employeeId,
    });

    const updated = await service.update(created.id, {
      status: ShiftStatus.COMPLETED,
    });
    expect(updated.status).toBe(ShiftStatus.COMPLETED);
  });

  it('should remove a shift', async () => {
    const created = await service.create({
      date: new Date('2026-03-04'),
      startTime: '08:00',
      endTime: '16:00',
      type: ShiftType.MORNING,
      status: ShiftStatus.SCHEDULED,
      position: 'Receptionist',
      department: 'Front Desk',
      employeeId,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
