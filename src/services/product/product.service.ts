import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import {Product} from '../../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findOneByCondition(condition: any): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail(condition);
    } catch (error) {
      throw new NotFoundException(error, "This Shop doesn't exist");
    }
  }

  async findAllBySearchTerm(searchTerm: string): Promise<Product[]> {
    try {
      return await this.productRepository.query(`select distinct *
      from product 
      where LOWER(name) LIKE LOWER('%${searchTerm}%') JOIN brand ON product.brandId=brand.id `);
    } catch (error) {
      throw new NotFoundException('No Products match the query');
    }
  }

  async createOne(product: Product): Promise<Product> {
    // check if Product already exists in db
    const productExists = await this.productRepository.findOne(null, {
      where: {name: product.name},
    });
    if (productExists) {
      throw new ConflictException('This Product already exists!');
    }
    // create new instance of Product and save into db
    const newProduct = await this.productRepository.create({...product});
    return this.productRepository.save(newProduct);
  }
}
