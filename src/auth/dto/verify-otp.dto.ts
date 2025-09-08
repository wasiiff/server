import { IsEmail, IsNotEmpty, Length, IsString } from "class-validator";

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6, { message: "OTP must be 6 digits" })
  otp: string;
}
