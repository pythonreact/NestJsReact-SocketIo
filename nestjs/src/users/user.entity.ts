import { Itinerary } from 'src/itineraries/itinerary.entity';
import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  admin: boolean;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.user)
  itineraries: Itinerary[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with Id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with Id', this.id);
  }

  @BeforeRemove()
  logRemove() {
    console.log('Removed User with Id', this.id);
  }
}
