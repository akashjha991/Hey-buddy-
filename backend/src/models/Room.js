import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    radiusKm: { type: Number, required: true, min: 1, max: 5 },
    maxSlots: { type: Number, required: true, min: 2 },
    slotsAvailable: { type: Number, required: true, min: 0 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: { type: [Number], required: true }
    },
    status: {
      type: String,
      enum: ['open', 'full', 'expired'],
      default: 'open'
    },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

roomSchema.index({ location: '2dsphere' });
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Room = mongoose.model('Room', roomSchema);
