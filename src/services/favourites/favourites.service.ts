import {ConflictException, NotFoundException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Favourites} from '../../entities/favourites.entity';
import {Repository} from 'typeorm';
import {Eat} from 'src/entities/eat.entity';
import {Product} from 'src/entities/product.entity';
import {Shop} from 'src/entities/shop.entity';
import {create} from 'domain';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourites)
    private favouritesRepository: Repository<Favourites>,
    @InjectRepository(Eat)
    private eatRepository: Repository<Eat>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findOneByCondition(condition: any): Promise<Favourites> {
    try {
      return await this.favouritesRepository
        .createQueryBuilder('favourites')
        .leftJoinAndSelect('favourites.products', 'product')
        .leftJoinAndSelect('favourites.shopping', 'shop')
        .leftJoinAndSelect('favourites.eating', 'eat')
        .leftJoinAndSelect('favourites.user', 'veggie')
        .where(condition)
        .getOneOrFail();
    } catch (error) {
      throw new NotFoundException(error, "This Fav doesn't exist");
    }
  }

  async findAnyById(id: string): Promise<any> {
    try {
      const eat = await this.eatRepository.findOne(id, {
        relations: ['categories', 'location', 'reviews', 'favourites', 'brand'],
      });

      const shop = await this.shopRepository.findOne(id, {
        relations: [
          'categories',
          'location',
          'reviews',
          'products',
          'favourites',
          'brand',
        ],
      });

      const product = await this.productRepository.findOne(id, {
        relations: ['favourites', 'reviews', 'brand', 'shops', 'categories'],
      });

      return eat || shop || product;
    } catch (error) {
      throw new NotFoundException(error, 'Item not found!');
    }
  }

  async createOne(fav: Favourites): Promise<Favourites> {
    const favExists = await this.favouritesRepository.findOne(null, {
      where: {user: fav.user},
    });
    if (favExists) {
      throw new ConflictException('This user already has a Fav list!');
    }
    const newFav = await this.favouritesRepository.create({...fav});
    return this.favouritesRepository.save(newFav);
  }

  async updateOne(userId, itemId): Promise<Favourites> {
    try {
      const oldFav = await this.favouritesRepository.findOne({user: userId});
      if (!oldFav) {
        // check if item is shop, eat or product:
        console.log('NO FAV');
        const product = await this.productRepository.findOne(itemId);
        const shop = await this.shopRepository.findOne(itemId);
        const eat = await this.eatRepository.findOne(itemId);

        const createdFav = await this.favouritesRepository.create({
          user: userId,
        });
        if (product) {
          createdFav.products.push(itemId);
        }
        if (shop) {
          createdFav.shopping.push(itemId);
        }
        if (eat) {
          createdFav.eating.push(itemId);
        }

        return this.favouritesRepository.save(createdFav);
      }
      const newFav = {...oldFav};
      // if shopping || eating || products include the item, remove it:
      const shopIndex = newFav.shopping.findIndex(
        (item: any) => item.id === itemId,
      );
      const eatIndex = newFav.eating.findIndex(
        (item: any) => item.id === itemId,
      );
      const productIndex = newFav.products.findIndex(
        (item: any) => item.id === itemId,
      );

      if (shopIndex !== -1 || eatIndex !== -1 || productIndex !== -1) {
        shopIndex !== -1 && newFav.shopping.splice(shopIndex, 1);
        eatIndex !== -1 && newFav.eating.splice(eatIndex, 1);
        productIndex !== -1 && newFav.products.splice(productIndex, 1);
      } else {
        // else, look for the item in tables and include it in the correct array
        const isEat = await this.eatRepository.findOne(itemId);
        const isShop = await this.shopRepository.findOne(itemId);
        const isProduct = await this.productRepository.findOne(itemId);

        if (isEat || isShop || isProduct) {
          isEat && newFav.eating.push(isEat);
          isShop && newFav.shopping.push(isShop);
          isProduct && newFav.products.push(isProduct);
        }
      }
      return await this.favouritesRepository.save(newFav);
    } catch (error) {
      throw new NotFoundException(error, 'Fav list or fav item not found!');
    }
  }

  async deleteOneByCondition(condition: any): Promise<Favourites> {
    try {
      const fav = await this.findOneByCondition(condition);
      return await this.favouritesRepository.remove(fav);
    } catch (error) {
      throw new NotFoundException(error, "Couldn't delete, entry not found.");
    }
  }

  // ONLY FOR DEVELOPMENT
  async deleteAll(): Promise<void> {
    await this.favouritesRepository
      .createQueryBuilder()
      .delete()
      .from(Favourites)
      .execute();
  }
}
