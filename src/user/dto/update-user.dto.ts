import { IsOptional, IsEmail, IsAlphanumeric, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsAlphanumeric()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
