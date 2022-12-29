import { Exclude } from 'class-transformer';
import { UserRole } from 'src/enums/role.enum';
import { Evente } from 'src/eventes/entities/evente.entity';
import { TimestampEntities } from 'src/generics/timestamp.entities';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends TimestampEntities{
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  readonly username: string;

  @Column({ unique: true })
  readonly email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: string;

  @JoinTable()
  @OneToMany((type) => Evente, (evente) => evente.users)
  eventes: Evente[];
}
