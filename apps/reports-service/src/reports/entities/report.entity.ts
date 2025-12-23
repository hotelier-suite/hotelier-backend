import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportType } from '@app/contracts/reports-service/reports/enums/report-type.enum';
import { ReportStatus } from '@app/contracts/reports-service/reports/enums/report-status.enum';
import { ReportParametersDto } from '@app/contracts/reports-service/reports/dto/report-parameters.dto';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('json', { nullable: true })
  parameters?: ReportParametersDto;

  @Column('json', { nullable: true })
  data?: object;

  @Column({ nullable: true })
  filePath?: string;

  @Column()
  generatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
