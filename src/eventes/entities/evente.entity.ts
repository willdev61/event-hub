import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
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
  date: string;

  @Column()
  nbPlace: number;

  @Column({ default: true })
  status: boolean;

  @JoinTable()
  @OneToMany((type) => Ticket, (ticket) => ticket.eventes, {
    cascade: true,
  })
  tickets: Ticket[];

  @ManyToOne((type) => User, (user) => user.eventes)
  users: User;
}
