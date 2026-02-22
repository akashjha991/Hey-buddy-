import http from 'http';
import app from './app.js';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';
import { initSocketServer } from './sockets/socketServer.js';
import { startRoomExpiryCron } from './cron/roomExpiryCron.js';

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocketServer(server);
  startRoomExpiryCron();

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on ${env.port}`);
  });
};

start();
