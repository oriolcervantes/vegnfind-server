import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import {Veggie} from './veggie.entity';
import {Product} from './product.entity';
import {Shop} from './shop.entity';
import {Eat} from './eat.entity';

@Entity()
export class Favourites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Product, product => product.favourites, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  products: Product[];

  @ManyToMany(() => Shop, shop => shop.favourites, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  shopping: Shop[];

  @ManyToMany(() => Eat, eat => eat.favourites, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  eating: Eat[];

  @OneToOne(() => Veggie, veggie => veggie.favourites, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinColumn({name: 'user'})
  user: Veggie;
}
