import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/contracts/auth-service/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/contracts/auth-service/users/dto/update-user.dto';
import { UserResponseDto } from '@app/contracts/auth-service/users/dto/user-response.dto';
import { UserRoleIdsDto } from '@app/contracts/auth-service/users/dto/user-role-ids.dto';
import { RoleResponseDto } from '@app/contracts/auth-service/roles/dto/role-response.dto';
import { PermissionResponseDto } from '@app/contracts/auth-service/permissions/dto/permission-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtUser } from '@app/contracts/auth-service/tokens/interfaces/jwt-user.interface';
import { AuditLog } from '../../audit-service/audit/decorators/audit-log.decorator';
import { AuditAction, AuditResource } from '@app/contracts/audit-service/enums';
import { Observable } from 'rxjs';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Users',
    description:
      'Retrieve all users with their roles (without sensitive data).',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  findAll(): Observable<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get User by ID',
    description:
      'Retrieve a specific user by ID with roles (without sensitive data).',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.USER,
    description: 'User created',
    includeBody: false, // Don't include password
  })
  @ApiOperation({
    summary: 'Create User',
    description: 'Create a new user account.',
  })
  @ApiBody({
    description: 'User creation data',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  create(@Body() createUserDto: CreateUserDto): Observable<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.USER,
    description: 'User updated',
    resourceIdParam: 'id',
    includeBody: false,
  })
  @ApiOperation({
    summary: 'Update User',
    description: 'Update an existing user account.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'User update data',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.USER,
    description: 'User deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete User',
    description: 'Delete a user account from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<UserResponseDto> {
    return this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.USER,
    description: 'User activated',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Activate User',
    description: 'Activate a user account.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'User activated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  activate(@Param('id', ParseIntPipe) id: number): Observable<UserResponseDto> {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.USER,
    description: 'User deactivated',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Deactivate User',
    description: 'Deactivate a user account.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'User deactivated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<UserResponseDto> {
    return this.usersService.deactivate(id);
  }

  @Put(':userId/roles')
  @ApiOperation({
    summary: 'Assign Roles to User',
    description: 'Assign multiple roles to a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Role IDs to assign',
    type: UserRoleIdsDto,
  })
  @ApiResponse({
    status: 204,
    description: 'Roles assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request - roleIds must be an array of valid integers',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  assignRolesToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UserRoleIdsDto,
  ): Observable<void> {
    if (!Array.isArray(body.roleIds)) {
      throw new BadRequestException('roleIds must be an array');
    }

    const invalidIds = body.roleIds.filter(
      (id) => id == null || !Number.isInteger(id) || id <= 0,
    );

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid role IDs: ${invalidIds.join(', ')}. Role IDs must be positive integers.`,
      );
    }

    return this.usersService.assignRolesToUser(userId, body.roleIds);
  }

  @Delete(':userId/roles/:roleId')
  @ApiOperation({
    summary: 'Remove Role from User',
    description: 'Remove a specific role from a user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Role removed successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeRoleFromUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Observable<void> {
    return this.usersService.removeRolesFromUser(userId, [roleId]);
  }

  @Get(':userId/roles')
  @ApiOperation({
    summary: 'Get User Roles',
    description: 'Retrieve all roles assigned to a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
    type: [RoleResponseDto],
  })
  getUserRoles(
    @Param('userId', ParseIntPipe) userId: number,
  ): Observable<RoleResponseDto[]> {
    return this.usersService.getUserRoles(userId);
  }

  @Get(':userId/permissions')
  @ApiOperation({
    summary: 'Get User Permissions',
    description:
      'Retrieve all permissions for a specific user (through their roles).',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
    type: [PermissionResponseDto],
  })
  getUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Observable<PermissionResponseDto[]> {
    return this.usersService.getUserPermissions(userId);
  }

  @Get('profile/me')
  @ApiOperation({
    summary: 'Get Own Profile',
    description: "Get the current user's profile information.",
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getMyProfile(@CurrentUser() user: JwtUser): Observable<UserResponseDto> {
    return this.usersService.findOne(user.id);
  }

  @Patch('profile/me')
  @ApiOperation({
    summary: 'Update Own Profile',
    description: "Update the current user's profile information.",
  })
  @ApiBody({
    description: 'User profile update data',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  updateMyProfile(
    @CurrentUser() user: JwtUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UserResponseDto> {
    return this.usersService.update(user.id, updateUserDto);
  }
}
