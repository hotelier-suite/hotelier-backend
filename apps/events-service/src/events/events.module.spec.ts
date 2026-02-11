import { Test } from '@nestjs/testing';
import { EventsModule } from './events.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities';

describe('EventsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [EventsModule],
    })
      .overrideProvider(getRepositoryToken(Event))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
