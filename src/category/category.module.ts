import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Category.name,schema:CategorySchema}])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports : [MongooseModule,CategoryService]
})
export class CategoryModule {}
