import { StatusCodes } from 'http-status-codes';
import { Room } from '../models/Room.js';
import {
  buildNearbyRoomsCacheKey,
  getCached,
  invalidateNearbyCache,
  setCached
} from '../services/cacheService.js';
import { joinRoomWithLock } from '../services/roomService.js';

export const createRoom = async (req, res) => {
  const { title, sport, dateTime, radiusKm, maxSlots, lat, lon } = req.body;
  const room = await Room.create({
    title,
    sport,
    dateTime,
    radiusKm,
    maxSlots,
    slotsAvailable: maxSlots - 1,
    participants: [req.user.userId],
    creator: req.user.userId,
    location: { type: 'Point', coordinates: [lon, lat] },
    expiresAt: new Date(dateTime)
  });

  await invalidateNearbyCache();
  return res.status(StatusCodes.CREATED).json({ room });
};

export const findNearbyRooms = async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const radiusKm = Number(req.query.radiusKm || 5);

  const key = buildNearbyRoomsCacheKey({ lat, lon, radiusKm });
  const cached = await getCached(key);
  if (cached) return res.json({ source: 'cache', rooms: cached });

  const rooms = await Room.find({
    status: 'open',
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lon, lat] },
        $maxDistance: radiusKm * 1000
      }
    }
  })
    .populate('creator', 'name')
    .lean();

  await setCached(key, rooms, 60);
  return res.json({ source: 'db', rooms });
};

export const joinRoom = async (req, res) => {
  const room = await joinRoomWithLock({ roomId: req.params.roomId, userId: req.user.userId });
  await invalidateNearbyCache();
  return res.status(StatusCodes.OK).json({ room, message: 'Joined room' });
};
