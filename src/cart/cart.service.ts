import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  //  Helper: Consistent response format
  private formatResponse(success: boolean, message: string, cart: any = null) {
    return { success, message, cart };
  }

  //  Get user cart
  async getUserCart(userId: string) {
    console.log(userId)
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();
    console.log(cart)
    if (!cart) {
      return this.formatResponse(true, 'Your cart is empty', { items: [] });
    }

    return this.formatResponse(true, 'Cart loaded successfully', cart);
  }

  //  Add product to cart with variant support
  async addToCart(userId: string, dto: AddToCartDto) {
    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    // Check if the product with same variant already exists
    const productIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === dto.product &&
        item.variant.color === dto.color &&
        item.variant.size === dto.size
    );

    if (productIndex > -1) {
      // If exists, increase quantity
      cart.items[productIndex].quantity += dto.quantity;
    } else {
      // Otherwise, push new item
      cart.items.push({
        product: new Types.ObjectId(dto.product),
        quantity: dto.quantity,
        variant: {
          color: dto.color,
          size: dto.size,
          image: dto.image || undefined,
        },
      });
    }

    await cart.save();
    return this.formatResponse(true, 'Item added to cart', cart);
  }

  //  Remove product by productId and variant
  async removeFromCart(userId: string, productId: string, color: string, size: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const itemExists = cart.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.variant.color === color &&
        item.variant.size === size
    );
    if (!itemExists) throw new NotFoundException('Item not found in your cart');

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant.color === color &&
          item.variant.size === size
        )
    );

    await cart.save();
    return this.formatResponse(true, 'Item removed from cart', cart);
  }

  //  Clear entire cart
  async clearCart(userId: string) {
    const cart = await this.cartModel.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true },
    );

    if (!cart) throw new NotFoundException('Cart not found');

    return this.formatResponse(true, 'Your cart has been cleared', cart);
  }

  //  Increase product quantity for specific variant
  async increaseQuantity(userId: string, productId: string, color: string, size: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');
    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.color === color &&
        item.variant.size === size
    );
    if (!item) throw new NotFoundException('Item not found in your cart');

    item.quantity += 1;
    await cart.save();

    return this.formatResponse(true, 'Item quantity increased', cart);
  }

  //  Decrease product quantity for specific variant
  async decreaseQuantity(userId: string, productId: string, color: string, size: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');
console.log(cart.items[0].product, productId);
console.log(cart.items[0].variant.color, color);
console.log(cart.items[0].variant.size, size);
    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.color === color &&
        item.variant.size === size
    );
    if (!item) throw new NotFoundException('Item not found in your cart');

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(
        (i) =>
          !(
            i.product.toString() === productId &&
            i.variant.color === color &&
            i.variant.size === size
          )
      );
    }

    await cart.save();
    return this.formatResponse(true, 'Item quantity decreased', cart);
  }
}
