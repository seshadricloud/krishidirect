import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function setupChatHandlers(io: Server) {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content, productId } = data;
        const db = await getPrisma();

        // Save message to database
        const message = await db.message.create({
          data: {
            senderId: socket.userId!,
            recipientId,
            content,
            productId: productId || null,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            }
          }
        });

        // Emit to recipient
        io.to(`user:${recipientId}`).emit('new_message', message);
        
        // Confirm to sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Mark messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { messageIds } = data;
        const db = await getPrisma();

        await db.message.updateMany({
          where: {
            id: { in: messageIds },
            recipientId: socket.userId!,
          },
          data: {
            isRead: true,
          }
        });

        socket.emit('messages_marked_read', { messageIds });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { recipientId } = data;
      io.to(`user:${recipientId}`).emit('user_typing', {
        userId: socket.userId,
      });
    });

    socket.on('stop_typing', (data) => {
      const { recipientId } = data;
      io.to(`user:${recipientId}`).emit('user_stop_typing', {
        userId: socket.userId,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}
