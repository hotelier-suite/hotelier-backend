import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
