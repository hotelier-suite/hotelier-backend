import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationModule } from './configuration/configuration.module';
import { Configuration } from './configuration/entities';

describe('ConfigServiceModule', () => {
  it('should compile the ConfigurationModule', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigurationModule],
    })
      .overrideProvider(getRepositoryToken(Configuration))
      .useValue({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
      })
      .compile();

    expect(module).toBeDefined();
  });
});
