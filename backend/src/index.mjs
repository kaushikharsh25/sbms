import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import apiRoutes from './routes/index.mjs';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => { res.json({ status: 'ok' }); });
app.use('/api', apiRoutes);

const PORT = Number(process.env.PORT || 4000);
let MONGODB_URI = process.env.MONGODB_URI || '';

async function start() {
  if (!MONGODB_URI) {
    console.log('No MONGODB_URI provided. Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    MONGODB_URI = mongod.getUri('sbms');
  }
  await mongoose.connect(MONGODB_URI);
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`SBMS backend listening on ${PORT}`));
}

start().catch((e) => { console.error(e); process.exit(1); });
