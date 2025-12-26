import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole } from '../users';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
