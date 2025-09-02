import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
    sequence: { type: Number, required: true }
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    stops: [stopSchema]
  },
  { timestamps: true }
);

routeSchema.index({ 'stops.location': '2dsphere' });

export default mongoose.model('Route', routeSchema);


