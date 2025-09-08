// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001', // Next.js frontend
    methods: ['GET', 'POST'],
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // Track connected sockets
  private onlineUsers = new Map<string, string>();
  private onlineAdmins = new Set<string>();

  // When a client registers
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string; role: 'admin' | 'user' },
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId, role } = data;
    if (role === 'admin') this.onlineAdmins.add(socket.id);
    else this.onlineUsers.set(userId, socket.id);
    console.log(`Registered ${role}: ${userId} -> ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.onlineAdmins.delete(socket.id);
    for (const [userId, sid] of this.onlineUsers.entries()) {
      if (sid === socket.id) this.onlineUsers.delete(userId);
    }
    console.log('Client disconnected:', socket.id);
  }

  // Emit notifications

  notifyNewProduct(productName: string) {
    const payload = { message: `New product added: ${productName}`, type: 'newProduct' };
    this.onlineUsers.forEach((socketId) => this.server.to(socketId).emit('newProduct', payload));
  }

  notifyProductOnSale(productName: string) {
    const payload = { message: `Product on sale: ${productName}`, type: 'productOnSale' };
    this.onlineUsers.forEach((socketId) => this.server.to(socketId).emit('productOnSale', payload));
  }

  notifyNewOrder(orderId: string) {
    const payload = { message: `New order placed: #${orderId}`, type: 'newOrder' };
    this.onlineAdmins.forEach((socketId) => this.server.to(socketId).emit('newOrder', payload));
  }
}
