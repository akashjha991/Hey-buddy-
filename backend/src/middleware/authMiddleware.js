import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/auth.js';

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing token' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};
