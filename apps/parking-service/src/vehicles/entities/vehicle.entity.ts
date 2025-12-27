import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsDate,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  VehicleType,
  GuestType,
  VehicleStatus,
} from '@app/contracts/parking-service';
import { ParkingSpace } from '../../spaces';
import { ParkingIncident } from '../../incidents';

@Entity('vehicles')
export class Vehicle {
  @ApiProperty({ description: 'Vehicle unique identifier', example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Vehicle license plate number',
    example: 'ABC-123',
  })
  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  licensePlate: string;

  @ApiProperty({ description: 'Vehicle brand', example: 'Toyota' })
  @IsString()
  @Length(1, 50)
  @Column()
  brand: string;

  @ApiProperty({ description: 'Vehicle model', example: 'Camry' })
  @IsString()
  @Length(1, 50)
  @Column()
  model: string;

  @ApiProperty({ description: 'Vehicle color', example: 'Blue' })
  @IsString()
  @Length(1, 30)
  @Column()
  color: string;

  @ApiProperty({
    description: 'Type of vehicle',
    enum: VehicleType,
    example: VehicleType.CAR,
  })
  @IsEnum(VehicleType)
  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @ApiProperty({ description: 'Vehicle owner name', example: 'John Smith' })
  @IsString()
  @Length(1, 100)
  @Column()
  owner: string;

  @ApiProperty({
    description: 'Room number if guest',
    example: '201',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  room?: string;

  @ApiProperty({
    description: 'Type of guest/user',
    enum: GuestType,
    example: GuestType.GUEST,
  })
  @IsEnum(GuestType)
  @Column({
    type: 'enum',
    enum: GuestType,
  })
  guestType: GuestType;

  @ApiProperty({
    description: 'Assigned parking space code',
    example: 'G-002',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  assignedSpace?: string;

  @ApiProperty({ description: 'Vehicle entry timestamp' })
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  entryTime: Date;

  @ApiProperty({
    description: 'Vehicle exit timestamp',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  exitTime?: Date;

  @ApiProperty({
    description: 'Current vehicle status',
    enum: VehicleStatus,
    example: VehicleStatus.PARKED,
    required: false,
  })
  @IsEnum(VehicleStatus)
  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.PARKED,
  })
  status: VehicleStatus;

  @ApiProperty({
    description: 'Additional notes about the vehicle',
    example: 'Guest vehicle - checkout tomorrow',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Assigned parking space',
    type: () => ParkingSpace,
    required: false,
  })
  @ManyToOne(() => ParkingSpace, (space) => space.vehicles, { nullable: true })
  @JoinColumn({ name: 'assignedSpace', referencedColumnName: 'code' })
  space?: ParkingSpace;

  @ApiProperty({
    description: 'Related parking incidents',
    type: () => Array,
    required: false,
  })
  @OneToMany(() => ParkingIncident, (incident) => incident.vehicle, {
    cascade: true,
  })
  incidents?: ParkingIncident[];
}
