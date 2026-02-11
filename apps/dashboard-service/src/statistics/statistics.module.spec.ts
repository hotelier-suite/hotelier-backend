import { Test } from '@nestjs/testing';
import { StatisticsModule } from './statistics.module';

describe('StatisticsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [StatisticsModule],
    })
      .overrideProvider('BOOKING_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('BILLING_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('OPERATIONS_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('GUEST_REQUESTS_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('STAFF_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('AUTH_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .compile();

    expect(module).toBeDefined();
  });
});
