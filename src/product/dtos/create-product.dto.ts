import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

class VariantDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  sizes?: string[];
}

class FAQDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsNumber()
  // @Min(0)
  // @Max(5)
  // ratings?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FAQDto)
  @IsOptional()
  faqs?: FAQDto[];

@IsBoolean()
@IsOptional()
@Type(() => Boolean)  
onSale?: boolean;

@IsNumber()
@Min(0)
@Max(100)
@IsOptional()
@Type(() => Number)  
discountPercentage?: number;


  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsEnum(["money", "loyalty_points", "hybrid"])
  type: "money" | "loyalty_points" | "hybrid";

  // @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  loyaltyPoints?: number;
}
