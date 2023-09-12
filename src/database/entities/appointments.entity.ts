import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum AppointmentStatus {
  WAITING = 'waiting',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'appointments' })
export class Appointments extends BaseEntity {
  @Column({ name: 'ref_uid', type: 'varchar', nullable: false })
  refUid: string;

  @Column({ name: 'employee_name', type: 'varchar', nullable: false })
  employeeName: string;

  @Column({ name: 'expert_id', type: 'varchar', nullable: false })
  expertId: string;

  @Column({ name: 'expert_name', type: 'varchar', nullable: false })
  expertName: string;

  @Column({ name: 'company_id', type: 'varchar', nullable: false })
  companyId: string;

  @Column({ name: 'company_name', type: 'varchar', nullable: false })
  companyName: string;

  @Column({ name: 'appointment_date', type: 'date', nullable: false })
  appointmentDate: Date;

  @Column({ name: 'start_time', type: 'timestamp', nullable: false })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: false })
  endTime: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AppointmentStatus,
    nullable: false,
    default: AppointmentStatus.WAITING,
  })
  status: AppointmentStatus;
}
