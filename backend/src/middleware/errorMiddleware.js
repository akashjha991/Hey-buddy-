import { StatusCodes } from 'http-status-codes';

export const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || 'Server error' });
};
