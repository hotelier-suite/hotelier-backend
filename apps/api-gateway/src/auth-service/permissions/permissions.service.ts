import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../constants';
import { PERMISSIONS_PATTERNS } from '@app/contracts/auth-service/permissions/permissions.patterns';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { CreatePermissionDto } from '@app/contracts/auth-service/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@app/contracts/auth-service/permissions/dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  findAll(): Observable<PermissionResponseDto[]> {
    return this.authClient.send<PermissionResponseDto[], Record<string, never>>(
      PERMISSIONS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findByResource(): Observable<Record<string, PermissionResponseDto[]>> {
    return this.authClient.send<
      Record<string, PermissionResponseDto[]>,
      Record<string, never>
    >(PERMISSIONS_PATTERNS.BY_RESOURCE, {});
  }

  create(data: CreatePermissionDto): Observable<PermissionResponseDto> {
    return this.authClient.send<PermissionResponseDto, CreatePermissionDto>(
      PERMISSIONS_PATTERNS.CREATE,
      data,
    );
  }

  update(
    id: number,
    data: UpdatePermissionDto,
  ): Observable<PermissionResponseDto> {
    return this.authClient.send<
      PermissionResponseDto,
      { id: number; data: UpdatePermissionDto }
    >(PERMISSIONS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<PermissionResponseDto> {
    return this.authClient.send<PermissionResponseDto, number>(
      PERMISSIONS_PATTERNS.DELETE,
      id,
    );
  }
}
