import { Test } from '@nestjs/testing';
import { TokensModule } from './tokens.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities';

describe('TokensModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TokensModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue({ get: jest.fn().mockReturnValue('test-value') })
      .compile();

    expect(module).toBeDefined();
  });
});
