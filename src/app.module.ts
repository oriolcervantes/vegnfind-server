import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {join} from 'path';
import {CategoryController} from './controllers/category/category.controller';
import {CategoryService} from './services/category/category.service';
import {Category} from './entities/category.entity';
import {Veggie} from './entities/veggie.entity';
import {VeggieController} from './controllers/user/veggie.controller';
import {VeggieService} from './services/user/veggie.service';
import {ShopController} from './controllers/shop/shop.controller';
import {ShopService} from './services/shop/shop.service';
import {Shop} from './entities/shop.entity';
import {EatController} from './controllers/eat/eat.controller';
import {EatService} from './services/eat/eat.service';
import {Eat} from './entities/eat.entity';
import {AuthController} from './controllers/auth/auth.controller';
import {AuthService} from './services/auth/auth.service';
import {LocalStrategy} from './auth/local.strategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ProductController} from './controllers/product/product.controller';
import {ProductService} from './services/product/product.service';
import {Product} from './entities/product.entity';
import {CloudinaryController} from './controllers/cloudinary/cloudinary.controller';
import {CloudinaryService} from './services/cloudinary/cloudinary.service';
import {Brand} from './entities/brand.entity';
import {BrandController} from './controllers/brand/brand.controller';
import {BrandService} from './services/brand/brand.service';
import {Favourites} from './entities/favourites.entity';
import {ReviewsController} from './controllers/reviews/reviews.controller';
import {ReviewsService} from './services/reviews/reviews.service';
import {Review} from './entities/review.entity';
import {FavouritesController} from './controllers/favourites/favourites.controller';
import {FavouritesService} from './services/favourites/favourites.service';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: +process.env.DB_PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      synchronize: true, // CHANGE IN PRODUCTION
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      ssl: true,
      migrations: ['dist/src/migrations/*.js'],
      cli: {
        migrationsDir: 'src/migrations',
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    TypeOrmModule.forFeature([
      Category,
      Veggie,
      Shop,
      Eat,
      Product,
      Brand,
      Favourites,
      Review,
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {expiresIn: '3600s'},
    }),
  ],
  controllers: [
    CategoryController,
    VeggieController,
    ShopController,
    EatController,
    AuthController,
    ProductController,
    CloudinaryController,
    BrandController,
    FavouritesController,
    ReviewsController,
  ],
  providers: [
    CategoryService,
    VeggieService,
    ShopService,
    EatService,
    AuthService,
    LocalStrategy,
    ProductService,
    CloudinaryService,
    BrandService,
    FavouritesService,
    ReviewsService,
  ],
})
export class AppModule {}
