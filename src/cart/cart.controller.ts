import { Controller, Get, Post, Delete, Patch, Body, Param, Req, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

class VariantDto {
  color: string;
  size: string;
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  // Get user's cart
  @Get()
  async getCart(@Request() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  // Add product to cart
  @Post()
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    console.log(req.user)
    return this.cartService.addToCart(req.user.userId, dto);
  }

  // Remove product from cart (with variant info)
  @Delete(':productId')
  async removeFromCart(
    @Request() req,
    @Param('productId') productId: string,
    @Body() variant: VariantDto,
  ) {
    return this.cartService.removeFromCart(req.user.userId, productId, req.body.color, req.body.size);
  }

  // Clear entire cart
  @Delete()
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }

  // Increase product quantity (with variant info)
  @Patch('increase/:productId')
  async increaseQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body() variant: VariantDto,
  ) {
    console.log(variant)
    console.log(req.body)
    return this.cartService.increaseQuantity(req.user.userId, productId, req.body.color, req.body.size);
  }

  // Decrease product quantity (with variant info)
  @Patch('decrease/:productId')
  async decreaseQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body() variant: VariantDto,
  ) {
    return this.cartService.decreaseQuantity(req.user.userId, productId, req.body.color, req.body.size);
  }
}
