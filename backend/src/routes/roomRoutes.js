import { Router } from 'express';
import { body, query } from 'express-validator';
import { createRoom, findNearbyRooms, joinRoom } from '../controllers/roomController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  body('title').notEmpty(),
  body('sport').notEmpty(),
  body('dateTime').isISO8601(),
  body('radiusKm').isInt({ min: 1, max: 5 }),
  body('maxSlots').isInt({ min: 2 }),
  body('lat').isFloat({ min: -90, max: 90 }),
  body('lon').isFloat({ min: -180, max: 180 }),
  validate,
  createRoom
);

router.get(
  '/nearby',
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lon').isFloat({ min: -180, max: 180 }),
  query('radiusKm').optional().isInt({ min: 1, max: 5 }),
  validate,
  findNearbyRooms
);

router.post('/:roomId/join', requireAuth, joinRoom);

export default router;
