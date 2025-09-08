import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  // User who placed the order
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  // Products in the order
  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      variant: { type: String, required: true }, 
      size: { type: String, required: true },   
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },  
    },
  ])
  products: {
    product: Product;
    variant: string;
    size: string;
    quantity: number;
    price: number;
  }[];

  // Total amount of the order
  @Prop({ required: true })
  totalAmount: number;

  // Shipping address
  @Prop({ type: Object, required: true })
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };

  // Payment info
  @Prop({ type: Object })
  paymentInfo: {
    method: string; // e.g., "card", "cash"
    status: string; // e.g., "pending", "completed", "failed"
    transactionId?: string;
    paidAt?: Date;
  };

  // Order status
  @Prop({ default: 'pending' }) // pending, confirmed, shipped, delivered, cancelled
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
