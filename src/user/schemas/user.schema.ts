import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
   
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: 'user', enum: ['user', 'admin','superadmin'] })
  role: string;

   @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, required: false })
  otp?: string;

  @Prop({type:Date,required:false})
  otpExpiry?: Date ;


  @Prop({type:Number,required:false})
  loyaltyPoints ?: number
}

export const UserSchema = SchemaFactory.createForClass(User);
