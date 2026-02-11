import { Test } from '@nestjs/testing';
import { Module, Global } from '@nestjs/common';
import { BookingsModule } from './bookings.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecreationalBooking } from './entities';
import { RecreationalFacility } from '../facilities/entities';
import { NotificationsService } from '../notifications-service';

@Global()
@Module({
  providers: [{ provide: NotificationsService, useValue: {} }],
  exports: [NotificationsService],
})
class MockNotificationsModule {}

describe('BookingsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [BookingsModule, MockNotificationsModule],
    })
      .overrideProvider(getRepositoryToken(RecreationalBooking))
      .useValue({})
      .overrideProvider(getRepositoryToken(RecreationalFacility))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
