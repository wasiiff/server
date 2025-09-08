import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    NotificationsModule,
  ],
  providers: [NotificationsGateway],
})
export class AppModule {}
