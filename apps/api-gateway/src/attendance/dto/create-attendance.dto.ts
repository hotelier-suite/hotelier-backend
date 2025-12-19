import { OmitType } from '@nestjs/swagger';
import { Attendance } from '../entities/attendance.entity';

export class CreateAttendanceDto extends OmitType(Attendance, [
  'id',
  'createdAt',
  'updatedAt',
  'employee',
]) {}
