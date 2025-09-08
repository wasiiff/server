import { IsNotEmpty, IsString, IsNumber, IsArray, IsObject, IsOptional } from 'class-validator';

export class CreateOrderDto {
//   @IsNotEmpty()
//   @IsString()
//   user: string;

  @IsArray()
  products: {
    product: string;
    variant: string;
    size: string;
    quantity: number;
    price: number;
  }[];

  @IsNumber()
  totalAmount: number;

  @IsObject()
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };

  @IsOptional()
  @IsObject()
  paymentInfo?: {
    method: string;
    status: string;
    transactionId?: string;
    paidAt?: Date;
  };
}

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string; // pending, completed, failed

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  paidAt?: Date;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string; // pending, confirmed, shipped, delivered, cancelled
}
