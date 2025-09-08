import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      variant: {
        color: { type: String, required: true },
        size: { type: String, required: true },
        image: { type: String, required: false },
      },
    },
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
    variant: {
      color: string;
      size: string;
      image?: string;
    };
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
