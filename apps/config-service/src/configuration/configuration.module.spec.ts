import { Test } from '@nestjs/testing';
import { ConfigurationModule } from './configuration.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Configuration } from './entities';

describe('ConfigurationModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigurationModule],
    })
      .overrideProvider(getRepositoryToken(Configuration))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
