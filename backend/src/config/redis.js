import Redis from 'ioredis';
import { env } from './env.js';

const baseClient = new Redis(env.redisUrl, { maxRetriesPerRequest: null });

baseClient.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Redis error', err.message);
});

export const redisClient = baseClient;
export const redisPubClient = baseClient.duplicate();
export const redisSubClient = baseClient.duplicate();
