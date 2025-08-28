import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mealsRouter from './routes/meals.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/meals', mealsRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mealshare';

async function start() {
  try {
    await mongoose.connect(MONGO_URL, { dbName: 'mealshare' });
    console.log('[server] MongoDB connected');
    app.listen(PORT, () => console.log(`[server] Listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('[server] Failed to start', err);
    process.exit(1);
  }
}

start();


