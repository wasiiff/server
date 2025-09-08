import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./schemas/category.schema";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role, Roles } from "src/common/decorators/roles.decorator";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


   @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.SUPERADMIN)
  // Create category
  @Post()
  async create(@Body("name") name: string): Promise<Category> {
    return this.categoryService.create(name);
  }

  // Get all categories
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  // Get category by id
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

   @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.SUPERADMIN)
  // Update category
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body("name") name: string
  ): Promise<Category> {
    return this.categoryService.update(id, name);
  }


   @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.SUPERADMIN)
  // Delete category
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<{ message: string }> {
    return this.categoryService.delete(id);
  }
}
