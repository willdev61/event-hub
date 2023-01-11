import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TimestampEntities } from 'src/generics/timestamp.entities';
import { Participation } from '../../participation/entities/participation.entity';

@Entity()
export class Evente extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  date: string;

  @Column()
  price: number;

  @Column()
  nbPlace: number;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne((type) => User, (user) => user.eventes)
  user: User;

  @JoinTable()
  @OneToMany((type) => Participation, (participation) => participation.evente)
  participations: Participation[];
}
