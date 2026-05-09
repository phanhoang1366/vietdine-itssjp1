import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { decrypt } from './session';
import * as chatService from '../services/chat.service';

let io: Server;

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function initializeSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  // ─── Authentication Middleware ─────────────────────────────
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || '';
      const sessionToken = parseCookie(cookieHeader, 'session');

      if (!sessionToken) {
        return next(new Error('Authentication required'));
      }

      const payload = await decrypt(sessionToken);
      if (!payload) {
        return next(new Error('Invalid session'));
      }

      // Attach user data to socket
      (socket as any).userId = payload.userId;
      (socket as any).roleId = payload.roleId;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  // ─── Connection Handler ────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`🔌 User ${userId} connected via WebSocket`);

    // Join a reservation chat room
    socket.on('join_reservation', async (reservationId: number) => {
      const roomName = `reservation_${reservationId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined room ${roomName}`);

      // Mark messages as read when joining
      await chatService.markMessagesAsRead(reservationId, userId);

      // Notify room that user is online
      socket.to(roomName).emit('user_online', { userId });
    });

    // Leave a reservation chat room
    socket.on('leave_reservation', (reservationId: number) => {
      const roomName = `reservation_${reservationId}`;
      socket.leave(roomName);
    });

    // Send a chat message
    socket.on('send_message', async (data: { reservationId: number; content: string }) => {
      try {
        const message = await chatService.createMessage(
          data.reservationId,
          userId,
          data.content
        );

        const roomName = `reservation_${data.reservationId}`;

        // Broadcast to all users in the room (including sender)
        io.to(roomName).emit('new_message', message);
      } catch (err) {
        console.error('Message send error:', err);
        socket.emit('message_error', { error: 'メッセージの送信に失敗しました' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { reservationId: number; isTyping: boolean }) => {
      const roomName = `reservation_${data.reservationId}`;
      socket.to(roomName).emit('user_typing', {
        userId,
        isTyping: data.isTyping,
      });
    });

    // Mark messages as read
    socket.on('mark_read', async (reservationId: number) => {
      try {
        await chatService.markMessagesAsRead(reservationId, userId);
        const roomName = `reservation_${reservationId}`;
        socket.to(roomName).emit('messages_read', { userId, reservationId });
      } catch (err) {
        console.error('Mark read error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User ${userId} disconnected`);
    });
  });

  return io;
}

// ─── Helpers ───────────────────────────────────────────────────
function parseCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
