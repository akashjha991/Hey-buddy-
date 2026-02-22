import { Router } from 'express';
import { body } from 'express-validator';
import { updateLocation } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.patch(
  '/location',
  requireAuth,
  body('lat').isFloat({ min: -90, max: 90 }),
  body('lon').isFloat({ min: -180, max: 180 }),
  validate,
  updateLocation
);

export default router;
