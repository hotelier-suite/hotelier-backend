import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokensService } from './';
import { User } from '../users';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
const mockBcryptHash = bcrypt.hash as unknown as jest.Mock;

describe('TokensService', () => {
  let service: TokensService;
  const mockJwtService: Record<string, jest.Mock> = {
    signAsync: jest.fn(),
  };
  const mockConfigService: Record<string, jest.Mock> = {
    get: jest.fn(),
  };
  const mockUserRepo: Record<string, jest.Mock> = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokens', () => {
    it('should generate access and refresh tokens', async () => {
      mockConfigService.get.mockReturnValue('test-secret');
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.getTokens(1, 'test@test.com');
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateRefreshToken', () => {
    it('should hash and store refresh token', async () => {
      mockBcryptHash.mockResolvedValueOnce('hashed-token');
      mockUserRepo.update.mockResolvedValueOnce(undefined);

      await service.updateRefreshToken(1, 'refresh-token');

      expect(mockBcryptHash).toHaveBeenCalled();
      expect(mockUserRepo.update).toHaveBeenCalled();
    });
  });
});
