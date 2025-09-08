import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { CategoryModule } from 'src/category/category.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports:[
    CategoryModule,
    MongooseModule.forFeature([{name:Product.name,schema:ProductSchema}]),
    NotificationsModule
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports : [MongooseModule]
})
export class ProductModule {}
