import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { STAFF_SERVICE_CLIENT } from './constants';
import { EmployeesModule } from './employees';
import { ShiftsModule } from './shifts';
import { AttendanceModule } from './attendance';
import { EmployeeRequestsModule } from './employee-requests';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: STAFF_SERVICE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
          ],
          queue: 'staff_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    EmployeesModule,
    ShiftsModule,
    AttendanceModule,
    EmployeeRequestsModule,
  ],
  exports: [
    ClientsModule,
    EmployeesModule,
    ShiftsModule,
    AttendanceModule,
    EmployeeRequestsModule,
  ],
})
export class StaffServiceModule {}
