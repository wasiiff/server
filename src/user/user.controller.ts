import { Controller, Get, UseGuards, Param, Patch, Delete, Body, Request, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role, Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // current logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('loyaltypoints')
  async LoyaltyPoints(
    @Request() req
  ){
     return this.userService.getLoyaltyPointsByUserId(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-points')
  async updatePoints(@Request() req,@Body() points:Points){
     return this.userService.updateLoyaltyPoints(req.user.userId,points)
  }

  // admin: list all users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // admin: update user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto as any);
  }

  // admin: delete user
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}



export type Points = {
  points : number
}