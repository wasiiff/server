import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { generateOtp } from 'helper/otp.util';
import { MailerService } from 'src/common/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService,private mailerService: MailerService) {}

 async register(username: string, email: string, password: string) {
  // Trim inputs
  username = username.trim();
  email = email.trim().toLowerCase();
  password = password.trim();

  // Check required fields
  if (!username || !email || !password) {
    throw new BadRequestException('All fields (username, email, password) are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException('Invalid email format');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new BadRequestException('Password must be at least 6 characters long');
  }

  // Check if email already exists
  const existingEmail = await this.userService.findByEmail(email);

  if (existingEmail) {
    // If user exists and verified → return message to verify account
    if (existingEmail.isVerified) {
      throw new BadRequestException('User already exists.');
    }

    // If user exists but NOT verified → resend OTP instead of creating new user
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    existingEmail.otp = otp;
    existingEmail.otpExpiry = otpExpiry;
    await existingEmail.save();

    await this.mailerService.sendMail(
      email,
      'Verify your email',
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    const { password: _, otp: __, otpExpiry: ___, ...safe } = existingEmail.toObject();
    return safe;
  }

  // Check if username already exists
  const existingUsername = await this.userService.findByUsername(username);
  if (existingUsername) {
    throw new BadRequestException('Username is already taken');
  }

  // Create new user
  const user = await this.userService.create(username, email, password);

  // Generate OTP for new user
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  user.isVerified = false;
  await user.save();

  // Send OTP email
  await this.mailerService.sendMail(
    email,
    'Verify your email',
    `Your OTP is ${otp}. It will expire in 5 minutes.`
  );

  // Remove sensitive fields before returning
  const { password: _, otp: __, otpExpiry: ___, ...safe } = user.toObject();
  return safe;
}


  async validateUser(email: string, password: string) {
    const user = await this.userService.validatePassword(email, password);
    if (!user) return null;
    return user;
  }

 async login(email: string, password: string) {
  email = email.trim().toLowerCase();
  password = password.trim();

  const user = await this.validateUser(email, password);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  if (!user.isVerified) {
    throw new UnauthorizedException('Please verify your email using OTP first.');
  }

  const payload = {
    sub: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    },
  };
}





  async verifyOtp(email: string, otp: string) {
  const user = await this.userService.findByEmail(email);
  if (!user) throw new BadRequestException('User not found');

  if (user.isVerified) throw new BadRequestException('User already verified');

  if (!user.otp || !user.otpExpiry) {
    throw new BadRequestException('No OTP found. Please request a new one.');
  }

  if (user.otp !== otp) throw new BadRequestException('Invalid OTP');

  if (new Date() > user.otpExpiry) throw new BadRequestException('OTP expired');

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: 'Email verified successfully. You can now log in.' };
}


async resendOtp(email: string) {
  const user = await this.userService.findByEmail(email);
  if (!user) throw new BadRequestException('User not found');

  if (user.isVerified) throw new BadRequestException('User already verified');

  if (user.otpExpiry && new Date() < user.otpExpiry) {
    throw new BadRequestException('You can request a new OTP only after the current one expires');
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await this.mailerService.sendMail(
    email,
    'Resend OTP',
    `Your new OTP is ${otp}. It will expire in 5 minutes.`
  );

  return { message: 'New OTP sent to your email' };
}


}
