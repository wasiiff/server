import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role, Roles } from 'src/common/decorators/roles.decorator';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto,@Request() req) {
    return this.orderService.createOrder(createOrderDto,req.user.userId);
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }


  //  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Put(':id/payment')
  updatePaymentStatus(
    @Param('id') orderId: string,
    @Body() updateDto: UpdatePaymentStatusDto,
  ) {
    return this.orderService.updatePaymentStatus(orderId, updateDto);
  }


  //  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Put(':id/status')
  updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, updateDto);
  }


  //  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN,Role.SUPERADMIN)
   @Get('stats')
  async getOrdersStats() {
    return this.orderService.getOrdersStats();
  }


  //  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Get('dashboard-stats')
  async getDashboardStats() {
    return this.orderService.getDashboardStats();
  }


    @Get("best-sellers")
  async getBestSellers(@Query("limit") limit: number = 5) {
    return this.orderService.getBestSellers(Number(limit));
  }


  @Get(':id')
async getOrderById(@Param('id') orderId: string) {
  return this.orderService.getOrderById(orderId);
}

}
