jest.mock('../bookings', () => ({
  BookingsController: class {},
  BookingsModule: class {},
  BookingsService: class {},
}));

import { Test } from '@nestjs/testing';
import { VenuesModule } from './venues.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Venue } from './entities';

describe('VenuesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [VenuesModule],
    })
      .overrideProvider(getRepositoryToken(Venue))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
