import { Test } from '@nestjs/testing';
import { GuestRequestsModule } from './guest-requests.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuestRequest } from './entities';

describe('GuestRequestsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [GuestRequestsModule],
    })
      .overrideProvider(getRepositoryToken(GuestRequest))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
