import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {IsEmail} from 'class-validator';
import {Review} from './review.entity';
import {Favourites} from './favourites.entity';

// a Veggie is the user of the app
@Entity()
export class Veggie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  profilePic: string;

  @OneToMany(() => Review, review => review.user)
  reviews?: Review[];

  @OneToOne(() => Favourites, favourites => favourites.user)
  @JoinColumn()
  favourites?: Favourites;
}