import { Test } from '@nestjs/testing';
import { Module, Global } from '@nestjs/common';
import { ShiftsModule } from './shifts.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shift } from './entities';
import { Employee } from '../employees/entities';
import { NotificationsService } from '../notifications-service';

@Global()
@Module({
  providers: [{ provide: NotificationsService, useValue: {} }],
  exports: [NotificationsService],
})
class MockNotificationsModule {}

describe('ShiftsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ShiftsModule, MockNotificationsModule],
    })
      .overrideProvider(getRepositoryToken(Shift))
      .useValue({})
      .overrideProvider(getRepositoryToken(Employee))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
