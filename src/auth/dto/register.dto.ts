import { IsEmail, IsNotEmpty, MinLength, IsAlphanumeric } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
