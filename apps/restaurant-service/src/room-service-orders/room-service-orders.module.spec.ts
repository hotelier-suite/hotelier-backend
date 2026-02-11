import { Test } from '@nestjs/testing';
import { RoomServiceOrdersModule } from './room-service-orders.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomServiceOrder } from './entities';

describe('RoomServiceOrdersModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [RoomServiceOrdersModule],
    })
      .overrideProvider(getRepositoryToken(RoomServiceOrder))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
