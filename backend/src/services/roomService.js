import crypto from 'crypto';
import mongoose from 'mongoose';
import { Room } from '../models/Room.js';
import { redisClient } from '../config/redis.js';

const LOCK_TTL = 5000;

const releaseLock = async (key, token) => {
  const script = `
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    else
      return 0
    end`;
  await redisClient.eval(script, 1, key, token);
};

export const joinRoomWithLock = async ({ roomId, userId }) => {
  const lockKey = `room:lock:${roomId}`;
  const token = crypto.randomUUID();
  const locked = await redisClient.set(lockKey, token, 'PX', LOCK_TTL, 'NX');
  if (!locked) {
    throw new Error('Room is busy, retry');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findOne({
      _id: roomId,
      status: 'open',
      slotsAvailable: { $gt: 0 },
      participants: { $ne: userId }
    }).session(session);

    if (!room) throw new Error('Room unavailable or already joined');

    room.participants.push(userId);
    room.slotsAvailable -= 1;
    if (room.slotsAvailable === 0) room.status = 'full';

    await room.save({ session });
    await session.commitTransaction();
    return room;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
    await releaseLock(lockKey, token);
  }
};
