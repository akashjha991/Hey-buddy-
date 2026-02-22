import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post(
  '/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  register
);

router.post('/login', body('email').isEmail(), body('password').notEmpty(), validate, login);

export default router;
