import { User } from '../users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Itinerary {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  departure: string;

  @Column()
  stops: string;

  @Column()
  arrival: string;

  @ManyToOne(() => User, (user) => user.itineraries)
  @JoinColumn({ name: 'userId' })
  user: User;
}
