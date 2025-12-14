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
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  Length,
  Min,
} from 'class-validator';
import { ConfigCategory } from '../enums/config-category.enum';

@Entity('configurations')
export class Configuration {
  @ApiProperty({
    description: 'Configuration unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Configuration key',
    example: 'hotel.name',
  })
  @IsString()
  @Length(1, 100)
  @Column({ unique: true })
  key: string;

  @ApiProperty({
    description: 'Configuration value',
    example: 'Grand Hotel Plaza',
  })
  @IsString()
  @Column('text')
  value: string;

  @ApiProperty({
    description: 'Configuration category',
    enum: ConfigCategory,
    example: ConfigCategory.GENERAL,
  })
  @IsEnum(ConfigCategory)
  @Column({
    type: 'enum',
    enum: ConfigCategory,
  })
  category: ConfigCategory;

  @ApiProperty({
    description: 'Configuration description',
    example: 'Hotel name displayed in the system',
  })
  @IsString()
  @Length(1, 500)
  @Column()
  description: string;

  @ApiProperty({
    description: 'Whether this configuration can be edited',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Column({ default: true })
  isEditable?: boolean;

  @ApiProperty({
    description: 'Whether this configuration contains sensitive data',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Column({ default: false })
  isSecure?: boolean;

  @ApiProperty({
    description: 'Configuration creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Configuration last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
