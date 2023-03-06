import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'varchar', nullable: false, unique: true }) username: string;
  @Column({ type: 'varchar', nullable: false }) password: string;
  @Column({ type: 'varchar', nullable: false }) email: string;

  @Column({ type: 'varchar', nullable: false, default: Role.User })
  role: Role[];

  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
