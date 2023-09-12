import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { AliasRole } from '../database.constants';
import { Companies } from './companies.entity';

@Entity({ name: 'users' })
export class Users extends BaseEntity {
  @Column({ name: 'ref_uid', type: 'varchar', nullable: false, unique: true })
  refUid: string;

  @Column({ name: 'email', type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'photo_url', type: 'varchar', nullable: true })
  photoUrl: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: AliasRole,
    nullable: false,
    default: AliasRole.ADMIN,
  })
  role: AliasRole;

  @ManyToOne(() => Companies, (companies) => companies.users)
  company: Companies;
}
