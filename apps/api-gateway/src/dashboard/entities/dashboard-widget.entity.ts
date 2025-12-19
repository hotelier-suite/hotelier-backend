import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
} from 'class-validator';

@Entity('dashboard_widgets')
export class DashboardWidget {
  @ApiProperty({
    description: 'Dashboard widget unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Widget title',
    example: 'Revenue Chart',
  })
  @IsString()
  @Column()
  title: string;

  @ApiProperty({
    description: 'Widget type',
    example: 'chart',
  })
  @IsString()
  @Column()
  type: string;

  @ApiProperty({
    description: 'Widget configuration settings',
    example: { chartType: 'line', dataSource: 'revenue' },
  })
  @IsObject()
  @Column('json')
  configuration: any;

  @ApiProperty({
    description: 'Widget data',
    example: { values: [100, 200, 300] },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Column('json', { nullable: true })
  data?: any;

  @ApiProperty({
    description: 'Widget position on dashboard',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  position?: number;

  @ApiProperty({
    description: 'Whether widget is visible',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Column({ default: true })
  visible?: boolean;

  @ApiProperty({
    description: 'User ID who owns this widget',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  userId: number;

  @ApiProperty({
    description: 'Widget creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Widget last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
