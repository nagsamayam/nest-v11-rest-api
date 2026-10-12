import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
@Index('users_email_unique_idx', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 254,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 254,
  })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 254,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 254,
  })
  password!: string;

  @Column({
    name: 'email_verified_at',
    type: 'datetime',
    nullable: true,
  })
  emailVerifiedAt!: Date | null;

  @Column({
    name: 'mobile_number',
    type: 'varchar',
    length: 20,
    default: null,
    nullable: true,
  })
  mobileNumber!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt!: Date;
}
