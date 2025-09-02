import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true, index: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
    speedKph: { type: Number },
    heading: { type: Number }
  },
  { timestamps: true }
);

locationSchema.index({ location: '2dsphere' });

export default mongoose.model('Location', locationSchema);


