import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as BaseEntityTypeOrm,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

export class BaseEntity extends BaseEntityTypeOrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
