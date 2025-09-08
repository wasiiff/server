import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.email, dto.password);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

 @Post("verify-otp")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

    @Post("resend-otp")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.email);
  }
}
