import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  // @Prop({ type: Number, default: 0, min: 0, max: 5 })
  // ratings: number;

  @Prop({
    type: [
      {
        color: { type: String, required: true, trim: true },
        images: [{ type: String, required: true }],
        sizes: [{ type: String }],
      },
    ],
    default: [],
  })
  variants: {
    color: string;
    images: string[];
    sizes: string[];
  }[];

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, min: 0, max: 5, required: true },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  reviews: {
    user: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];

  @Prop({
    type: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
      },
    ],
    default: [],
  })
  faqs: {
    question: string;
    answer: string;
  }[];

  @Prop({ type: Boolean, default: false })
  onSale: boolean;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  discountPercentage: number;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  @Prop({
    type: String,
    required: true,
    enum: ["money", "loyalty_points", "hybrid"],
  })
  type: "money" | "loyalty_points" | "hybrid";

@Prop({ type: Types.ObjectId, ref: "Category", required: true })
category: Types.ObjectId;

  @Prop({ type: Number, default: 0, min: 0 })
  loyaltyPoints: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
