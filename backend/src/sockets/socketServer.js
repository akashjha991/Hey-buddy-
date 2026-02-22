import { Server } from 'socket.io';
import redisAdapter from 'socket.io-redis';
import { env } from '../config/env.js';
import { verifyToken } from '../utils/auth.js';

const redisConn = new URL(env.redisUrl || 'redis://127.0.0.1:6379');

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: env.allowedOrigins, credentials: true }
  });

  io.adapter(
    redisAdapter({
      host: redisConn.hostname,
      port: Number(redisConn.port || 6379)
    })
  );

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      socket.user = verifyToken(token);
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-room-chat', (roomId) => socket.join(roomId));
    socket.on('room-message', ({ roomId, message }) => {
      io.to(roomId).emit('room-message', {
        message,
        roomId,
        sender: socket.user.email,
        ts: new Date().toISOString()
      });
    });
  });

  return io;
};
