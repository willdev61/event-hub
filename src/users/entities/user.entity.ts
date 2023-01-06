import { Exclude } from 'class-transformer';
import { UserRole } from 'src/enums/role.enum';
import { Evente } from 'src/eventes/entities/evente.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { TimestampEntities } from 'src/generics/timestamp.entities';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends TimestampEntities {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly username: string;

  @Column()
  readonly email: string;

  @Column()
  readonly contacts: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  readonly role: UserRole;

  @JoinTable()
  @OneToMany((type) => Evente, (evente) => evente.user)
  eventes: Evente[];

  @JoinTable()
  @OneToMany((type) => Participation, (participation) => participation.user)
  participations: Participation[];
}
