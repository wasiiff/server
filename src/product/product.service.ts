import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { Category, CategoryDocument } from 'src/category/schemas/category.schema';
import { Notification } from 'src/notifications/schemas/notification.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel : Model<CategoryDocument>,
    private readonly notificationsService : NotificationsService,
    private notificationsGateway: NotificationsGateway
  ) {}

async create(dto: CreateProductDto): Promise<Product> {
  try {
    const name = dto.name;
    const existence = await this.productModel.findOne({ name });

    if (existence) {
      throw new BadRequestException(`Product with name "${name}" already exists`);
    }

    const product = new this.productModel({
      ...dto,
      category: new Types.ObjectId(dto.category),
    });
    await product.save();

     this.notificationsGateway.notifyNewProduct(product.name);
    return product;
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}


async findAllWithFilters(filters: {
  category?: string;
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> {
  const query: any = {};

  // Category filter
  if (filters.category) {
    query.category = new Types.ObjectId(filters.category); // or new Types.ObjectId(filters.category)
  }

  // Color filter
  if (filters.colors && filters.colors.length > 0) {
    query['variants.color'] = { $in: filters.colors };
  }

  // Size filter
  if (filters.sizes && filters.sizes.length > 0) {
    query['variants.sizes'] = { $in: filters.sizes };
  }

  // Price filter
  console.log(filters)
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  return this.productModel.find(query).populate('category').exec();
}

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

async update(id: string, dto: UpdateProductDto): Promise<Product> {
  console.log(dto)
  const updated = await this.productModel.findByIdAndUpdate(
    id,
    { ...dto },
    { new: true },
  );
  if (!updated) throw new NotFoundException('Product not found');

  // If product is on sale, notify all users
  if (updated.onSale) {
   this.notificationsGateway.notifyNewProduct(updated.name);
  }

  return updated;
}


  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }



async getOnSaleProducts(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    this.productModel
      .find({ onSale: true })
      .populate('category')
      .skip(skip)
      .limit(limit)
      .exec(),
    this.productModel.countDocuments({ onSale: true }),
  ]);

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}

async getNewArrivals(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    this.productModel
      .find()
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.productModel.countDocuments(),
  ]);

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}





async getFilters() {
  const colors = await this.productModel.aggregate([
    { $unwind: '$variants' },
    { $group: { _id: null, colors: { $addToSet: '$variants.color' } } },
    { $project: { _id: 0, colors: 1 } },
  ]);

  const sizes = await this.productModel.aggregate([
    { $unwind: '$variants' },
    { $unwind: '$variants.sizes' },
    { $group: { _id: null, sizes: { $addToSet: '$variants.sizes' } } },
    { $project: { _id: 0, sizes: 1 } },
  ]);

  const categories = await this.categoryModel.find().select('name').lean();

  return {
    colors: colors[0]?.colors || [],
    sizes: sizes[0]?.sizes || [],
    categories: categories.map((c) => ({ id: c._id, name: c.name })),
  };
}


}


interface ProductFilters {
  category?: string; 
  colors?: string[]; 
  sizes?: string[];  
  minPrice?: number;
  maxPrice?: number;
}