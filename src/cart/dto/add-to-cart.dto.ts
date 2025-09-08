// dto/add-to-cart.dto.ts
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  image?: string; // optional
}
