import { Test } from '@nestjs/testing';
import { Module, Global } from '@nestjs/common';
import { FacilitiesModule } from './facilities.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecreationalFacility } from './entities';
import { RecreationalBooking } from '../bookings/entities';
import { NotificationsService } from '../notifications-service';

@Global()
@Module({
  providers: [{ provide: NotificationsService, useValue: {} }],
  exports: [NotificationsService],
})
class MockNotificationsModule {}

describe('FacilitiesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [FacilitiesModule, MockNotificationsModule],
    })
      .overrideProvider(getRepositoryToken(RecreationalFacility))
      .useValue({})
      .overrideProvider(getRepositoryToken(RecreationalBooking))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
