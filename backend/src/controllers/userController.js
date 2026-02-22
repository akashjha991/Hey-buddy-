import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User.js';

export const updateLocation = async (req, res) => {
  const { lat, lon } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { location: { type: 'Point', coordinates: [lon, lat] } },
    { new: true }
  );

  return res.status(StatusCodes.OK).json({ user });
};
