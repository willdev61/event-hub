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

  @ManyToOne((type) => User, (user) => user.eventes)
  users: User;
}
