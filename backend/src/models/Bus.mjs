import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    numberPlate: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, default: 50 },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Bus', busSchema);


