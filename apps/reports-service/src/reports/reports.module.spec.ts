import { Test } from '@nestjs/testing';
import { ReportsModule } from './reports.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from './entities';

describe('ReportsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ReportsModule],
    })
      .overrideProvider(getRepositoryToken(Report))
      .useValue({})
      .overrideProvider('BILLING_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('BOOKING_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .compile();

    expect(module).toBeDefined();
  });
});
