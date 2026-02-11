import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { UsersService } from './';
import { AUTH_SERVICE_CLIENT } from '../constants';

describe('UsersService (gateway)', () => {
  let service: UsersService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: AUTH_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockClient.send.mockReturnValueOnce(of([{ id: 1 }]));
    const result = await lastValueFrom(service.findAll({} as never));
    expect(result).toHaveLength(1);
  });

  it('should findOne', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should removeRolesFromUser', async () => {
    mockClient.send.mockReturnValueOnce(of(undefined));
    await lastValueFrom(service.removeRolesFromUser(1, [2]));
    expect(mockClient.send).toHaveBeenCalled();
  });

  it('should getUserRoles', async () => {
    mockClient.send.mockReturnValueOnce(of([{ id: 1 }]));
    const result = await lastValueFrom(service.getUserRoles(1));
    expect(result).toHaveLength(1);
  });

  it('should getUserPermissions', async () => {
    mockClient.send.mockReturnValueOnce(of([{ id: 1 }]));
    const result = await lastValueFrom(service.getUserPermissions(1));
    expect(result).toHaveLength(1);
  });
});
