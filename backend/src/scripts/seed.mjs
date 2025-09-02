import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.mjs';
import Bus from '../models/Bus.mjs';
import Route from '../models/Route.mjs';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sbms';
  await mongoose.connect(uri);

  await Promise.all([User.deleteMany({}), Bus.deleteMany({}), Route.deleteMany({})]);

  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@sbms.edu', passwordHash, role: 'admin' });
  const driver = await User.create({ name: 'Driver Dan', email: 'driver@sbms.edu', passwordHash, role: 'driver' });
  const student = await User.create({ name: 'Student Sue', email: 'student@sbms.edu', passwordHash, role: 'student' });

  const route = await Route.create({
    name: 'Route A',
    stops: [
      { name: 'Stop 1', location: { type: 'Point', coordinates: [77.5946, 12.9716] }, sequence: 1 },
      { name: 'Stop 2', location: { type: 'Point', coordinates: [77.6, 12.98] }, sequence: 2 },
      { name: 'Campus', location: { type: 'Point', coordinates: [77.59, 12.99] }, sequence: 3 }
    ]
  });

  const bus = await Bus.create({ numberPlate: 'KA-01-AB-1234', capacity: 45, driver: driver._id, route: route._id });

  await User.findByIdAndUpdate(student._id, { assignedBus: bus._id });

  console.log('Seeded users:', { admin: admin.email, driver: driver.email, student: student.email });
  console.log('Seeded bus:', bus.numberPlate);
  console.log('Seeded route:', route.name);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });


