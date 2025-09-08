import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ProductModule,
    CartModule,
    NotificationsModule,
    UserModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
