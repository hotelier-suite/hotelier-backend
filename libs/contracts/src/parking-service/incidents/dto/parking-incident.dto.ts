import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@app/contracts/common/enums/task-priority.enum';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IncidentType } from '../enums/incident-type.enum';
import type { VehicleDto } from '../../vehicles/dto/vehicle.dto';
import type { ParkingSpaceDto } from '../../spaces/dto/parking-space.dto';

export class ParkingIncidentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: IncidentType, example: IncidentType.VEHICLE_DAMAGE })
  type: IncidentType;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: String })
  reportDate: Date;

  @ApiProperty({ enum: IncidentStatus, example: IncidentStatus.PENDING })
  status: IncidentStatus;

  @ApiProperty()
  responsible: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.NORMAL })
  priority: TaskPriority;

  @ApiProperty({ required: false })
  resolution?: string;

  @ApiProperty({ required: false, type: String })
  resolvedAt?: Date;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ required: false })
  vehicleId?: number;

  @ApiProperty({ required: false })
  spaceId?: number;

  @ApiProperty({ required: false })
  vehicle?: VehicleDto;

  @ApiProperty({ required: false })
  space?: ParkingSpaceDto;
}
