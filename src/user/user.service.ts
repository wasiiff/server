import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Points } from './user.controller';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

 
  async create(username: string, email: string, password: string, role = 'user') {
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) throw new ConflictException('Email already in use');

    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) throw new ConflictException('Username already in use');

    if (password.length < 6) {
      throw new ConflictException('Password must be at least 6 characters long');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const created = new this.userModel({ username, email, password: hashed, role });
    return created.save();
  }


  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }


  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }


 async findByUsername(username: string) {
  return await this.userModel.findOne({ username }).exec(); 
}


async getLoyaltyPointsByUserId(userId:string){
  const user = this.findById(userId);
  const loyaltyPoints = (await user).loyaltyPoints;

  return {loyaltyPoints}
}


async updateLoyaltyPoints(userId: string, points: Points) {
  const user = await this.userModel.findByIdAndUpdate(
    userId,
    { $inc: { loyaltyPoints: -points.points } }, // deduct points
    { new: true } // return updated document
  );

  if (!user) throw new NotFoundException("User not found");

  // Prevent negative points
  if (user.loyaltyPoints! < 0) {
    user.loyaltyPoints = 0;
    await user.save();
  }

  return { loyaltyPoints: user.loyaltyPoints };
}

 
  async validatePassword(email: string, plain: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    const isMatch = await bcrypt.compare(plain, user.password);
    if (!isMatch) return null;
    return user;
  }

  
  async findAll() {
    return this.userModel.find().select('-password').exec();
  }


  async updateUser(id: string, updateData: Partial<User>) {
    if (updateData.password) {
      if ((updateData.password as string).length < 6) {
        throw new ConflictException('Password must be at least 6 characters long');
      }
      const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
      updateData.password = await bcrypt.hash(updateData.password as string, saltRounds);
    }
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }


  async exists(email?: string, username?: string) {
    const query: any = {};
    if (email) query.email = email;
    if (username) query.username = username;

    return this.userModel.exists(query);
  }
}
