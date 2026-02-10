import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_CLIENT } from '../constants';
import {
  PERMISSIONS_PATTERNS,
  FindPermissionsFilterDto,
  PermissionResponseDto,
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@app/contracts/auth-service';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(AUTH_SERVICE_CLIENT) private readonly authClient: ClientProxy,
  ) {}

  findAll(
    filters: FindPermissionsFilterDto,
  ): Observable<PermissionResponseDto[]> {
    return this.authClient.send<
      PermissionResponseDto[],
      FindPermissionsFilterDto
    >(PERMISSIONS_PATTERNS.FIND_ALL, filters);
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
