import cron from 'node-cron';
import { Room } from '../models/Room.js';

export const startRoomExpiryCron = () => {
  cron.schedule('*/1 * * * *', async () => {
    await Room.updateMany(
      { status: { $ne: 'expired' }, dateTime: { $lte: new Date() } },
      { $set: { status: 'expired' } }
    );
  });
};
