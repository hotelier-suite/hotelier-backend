import { Test } from '@nestjs/testing';
import { Module, Global } from '@nestjs/common';
import { ItemsModule } from './items.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItem } from './entities';
import { NotificationsService } from '../notifications-service';

@Global()
@Module({
  providers: [{ provide: NotificationsService, useValue: {} }],
  exports: [NotificationsService],
})
class MockNotificationsModule {}

describe('ItemsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ItemsModule, MockNotificationsModule],
    })
      .overrideProvider(getRepositoryToken(InventoryItem))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
