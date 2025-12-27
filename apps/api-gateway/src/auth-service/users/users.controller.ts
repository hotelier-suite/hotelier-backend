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
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserRoleIdsDto,
  RoleResponseDto,
  PermissionResponseDto,
  JwtUser,
} from '@app/contracts/auth-service';
import { CurrentUser } from '../../common';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';
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
    status: 401,
    description: 'Unauthorized - authentication required',
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
    description: 'Unique identifier of the user',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
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
    description:
      'Create a new user account with the provided credentials and profile information.',
  })
  @ApiBody({
    description:
      'User creation data including username, email, password, and optional profile fields',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid request data - validation failed or duplicate username/email',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
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
    description:
      'Update an existing user account with the provided data. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to update',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description:
      'User update data - only include fields that need to be changed',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
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
    description:
      'Permanently delete a user account from the system. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to delete',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
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
    description:
      'Activate a user account, allowing the user to log in and access the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to activate',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'User activated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
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
    description:
      'Deactivate a user account, preventing the user from logging in until reactivated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to deactivate',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'User deactivated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<UserResponseDto> {
    return this.usersService.deactivate(id);
  }

  @Put(':userId/roles')
  @ApiOperation({
    summary: 'Assign Roles to User',
    description:
      'Assign multiple roles to a specific user. This replaces any existing role assignments.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user to assign roles to',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Array of role IDs to assign to the user',
    type: UserRoleIdsDto,
  })
  @ApiResponse({
    status: 204,
    description: 'Roles assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid request - roleIds must be an array of valid positive integers',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'User or role not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  assignRolesToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UserRoleIdsDto,
  ): Observable<void> {
    return this.usersService.assignRolesToUser(userId, body.roleIds);
  }

  @Delete(':userId/roles/:roleId')
  @ApiOperation({
    summary: 'Remove Role from User',
    description:
      'Remove a specific role from a user. The user will lose all permissions associated with this role.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user',
    type: 'number',
    example: 1,
  })
  @ApiParam({
    name: 'roleId',
    description: 'Unique identifier of the role to remove',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Role removed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'User or role not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeRolesFromUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Observable<void> {
    return this.usersService.removeRolesFromUser(userId, [roleId]);
  }

  @Get(':userId/roles')
  @ApiOperation({
    summary: 'Get User Roles',
    description:
      'Retrieve all roles assigned to a specific user, including role details and associated permissions.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
    type: [RoleResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
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
      'Retrieve all permissions for a specific user aggregated from all their assigned roles.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
    type: [PermissionResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
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
