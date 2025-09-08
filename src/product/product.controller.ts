import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './schemas/product.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @Get('new-arrivals')
getNewArrivals(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  const pageNumber = page ? parseInt(page, 10) : 1;
  const limitNumber = limit ? parseInt(limit, 10) : 10;

  return this.productService.getNewArrivals(pageNumber, limitNumber);
}
  @Get('on-sale')
  getOnSaleProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.getOnSaleProducts(Number(page), Number(limit));
  }
 @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('colors') colors?: string,   
    @Query('sizes') sizes?: string,   
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<Product[]> {
    const colorArray = colors ? colors.split(',') : [];
    const sizeArray = sizes ? sizes.split(',') : [];
    return this.productService.findAllWithFilters({
      category,
      colors: colorArray,
      sizes: sizeArray,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }


  //  @UseGuards(RolesGuard)
  //   @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req
  ): Promise<Product> {
    console.log('Dto : ' + dto);
    console.log('Body' + req.body)
    return this.productService.update(id, dto);
  }


  //  @UseGuards(RolesGuard)
  // @Roles(Role.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productService.remove(id);
  }


  @Get('filters') 
  async getFilters() {
    return this.productService.getFilters();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }






}
