import { Test } from '@nestjs/testing';
import { ReservationsModule } from './reservations.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities';
import { Room } from '../rooms/entities';
import { Guest } from '../guests/entities';
import {
  NotificationsServiceModule,
  NOTIFICATIONS_SERVICE_CLIENT,
} from '../notifications-service';

describe('ReservationsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [NotificationsServiceModule, ReservationsModule],
    })
      .overrideProvider(getRepositoryToken(Reservation))
      .useValue({})
      .overrideProvider(getRepositoryToken(Room))
      .useValue({})
      .overrideProvider(getRepositoryToken(Guest))
      .useValue({})
      .overrideProvider(NOTIFICATIONS_SERVICE_CLIENT)
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .compile();

    expect(module).toBeDefined();
  });
});
