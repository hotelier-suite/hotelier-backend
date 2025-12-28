import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  Length,
  Min,
} from 'class-validator';
import { SpaceType, SpaceStatus } from '@app/contracts/parking-service';
import { DecimalTransformer } from '@app/contracts/common';
import { Vehicle } from '../../vehicles';
import { ParkingIncident } from '../../incidents';

@Entity('parking_spaces')
export class ParkingSpace {
  @ApiProperty({ description: 'Parking space unique identifier', example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Unique parking space code', example: 'G-001' })
  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Parking zone name', example: 'Ground Floor' })
  @IsString()
  @Length(1, 50)
  @Column()
  zone: string;

  @ApiProperty({
    description: 'Type of parking space',
    enum: SpaceType,
    example: SpaceType.GUEST,
  })
  @IsEnum(SpaceType)
  @Column({
    type: 'enum',
    enum: SpaceType,
  })
  type: SpaceType;

  @ApiProperty({
    description: 'Current status of the parking space',
    enum: SpaceStatus,
    example: SpaceStatus.AVAILABLE,
    required: false,
  })
  @IsEnum(SpaceStatus)
  @Column({
    type: 'enum',
    enum: SpaceStatus,
    default: SpaceStatus.AVAILABLE,
  })
  status: SpaceStatus;

  @ApiProperty({
    description: 'License plate of currently parked vehicle',
    example: 'ABC-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  currentVehicle?: string;

  @ApiProperty({
    description: 'Hourly parking rate',
    example: 5.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
    transformer: DecimalTransformer,
  })
  hourlyRate: number;

  @ApiProperty({
    description: 'Physical location description',
    example: 'Ground Floor - Row A',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  location: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Vehicles assigned to this space',
    type: () => Array,
    required: false,
  })
  @OneToMany(() => Vehicle, (vehicle) => vehicle.space, { cascade: true })
  vehicles?: Vehicle[];

  @ApiProperty({
    description: 'Incidents related to this space',
    type: () => Array,
    required: false,
  })
  @OneToMany(() => ParkingIncident, (incident) => incident.space, {
    cascade: true,
  })
  incidents?: ParkingIncident[];
}
