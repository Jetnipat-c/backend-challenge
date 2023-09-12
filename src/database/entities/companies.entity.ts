import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Users } from './users.entity';

@Entity({ name: 'companies' })
export class Companies extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Column({ name: 'website', type: 'varchar', nullable: true })
  website: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @Column({ name: 'quota', type: 'int', nullable: false, default: 0 })
  quota: number;

  @OneToMany(() => Users, (users) => users.company)
  users: Users[];
}
