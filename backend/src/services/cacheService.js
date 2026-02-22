import { redisClient } from '../config/redis.js';

export const buildNearbyRoomsCacheKey = ({ lon, lat, radiusKm }) =>
  `nearby:${lon.toFixed(3)}:${lat.toFixed(3)}:${radiusKm}`;

export const getCached = async (key) => {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCached = async (key, value, ttlSeconds = 60) => {
  await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

export const invalidateNearbyCache = async () => {
  const stream = redisClient.scanStream({ match: 'nearby:*', count: 100 });
  stream.on('data', (keys) => {
    if (keys.length) redisClient.del(keys);
  });
};
