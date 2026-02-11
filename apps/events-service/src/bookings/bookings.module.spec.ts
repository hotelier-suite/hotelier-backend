jest.mock('../venues', () => ({
  Venue: class Venue {},
  VenuesController: class {},
  VenuesModule: class {},
  VenuesService: class {},
}));

import { Test } from '@nestjs/testing';
import { BookingsModule } from './bookings.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventBooking } from './entities';
import { Venue } from '../venues';

describe('BookingsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [BookingsModule],
    })
      .overrideProvider(getRepositoryToken(EventBooking))
      .useValue({})
      .overrideProvider(getRepositoryToken(Venue))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
