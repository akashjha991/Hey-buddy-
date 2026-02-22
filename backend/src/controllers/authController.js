import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User.js';
import { comparePassword, hashPassword, signToken } from '../utils/auth.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(StatusCodes.CONFLICT).json({ message: 'Email already in use' });
  }

  const user = await User.create({ name, email, password: await hashPassword(password) });
  const token = signToken({ userId: user._id, email: user.email });
  req.session.userId = user._id.toString();

  return res.status(StatusCodes.CREATED).json({ token, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  req.session.userId = user._id.toString();
  const token = signToken({ userId: user._id, email: user.email });

  return res.json({ token, user });
};
