import { Test } from '@nestjs/testing';
import { NotificationsModule } from './notifications.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entities';

describe('NotificationsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [NotificationsModule],
    })
      .overrideProvider(getRepositoryToken(Notification))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
