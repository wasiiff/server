import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "./schemas/category.schema";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  // Create Category
  async create(name: string): Promise<Category> {
    const exists = await this.categoryModel.findOne({ name });
    if (exists) {
      throw new ConflictException("Category already exists");
    }
    const category = new this.categoryModel({ name });
    return category.save();
  }

  // Get all categories
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ createdAt: -1 }).exec();
  }

  // Get one category
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  // Update Category
  async update(id: string, name: string): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  // Delete Category
  async delete(id: string): Promise<{ message: string }> {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) throw new NotFoundException("Category not found");
    return { message: "Category deleted successfully" };
  }
}
