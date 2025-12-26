import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole } from './entities';
import { Role } from '../roles';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccessControlModule } from '../access-control';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    AccessControlModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
