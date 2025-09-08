import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private gateway: NotificationsGateway,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createNotification(userId: string, message: string, type: string) {
    const notification = new this.notificationModel({ userId, message, type });
    await notification.save();

    // Send event based on type
    // this.gateway.notifyUser(userId, {
    //   _id: notification._id,
    //   message,
    //   type,
    //   createdAt: notification.createdAt,
    //   read: notification.read,
    // });

    return notification;
  }

  async notifyAll(message: string, type: 'newProduct' | 'productOnSale') {
    // this.gateway.notifyAll(type, { message, type });
    // Optionally save in DB for all users if needed
  }

  async notifyAdmins(message: string) {
    const admins = await this.userModel.find({ role: 'admin' }).lean();
    const adminIds = admins.map((a) => a._id.toString());

    // this.gateway.notifyAdmins(adminIds, { message, type: 'newOrder' });

    return Promise.all(
      adminIds.map((id) =>
        this.notificationModel.create({ userId: id, message, type: 'newOrder' })
      )
    );
  }

  async notifyOrderStatus(userId: string, message: string) {
    // this.gateway.notifyUser(userId, { message, type: 'orderStatusUpdate' });

    return this.notificationModel.create({
      userId,
      message,
      type: 'orderStatusUpdate',
    });
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany({ userId }, { read: true });
    return { message: 'All marked as read' };
  }
}
