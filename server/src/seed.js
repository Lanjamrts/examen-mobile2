import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Meal from './models/Meal.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mealshare';

async function run() {
  await mongoose.connect(MONGO_URL, { dbName: 'mealshare' });
  console.log('[seed] Connected');

  const now = Date.now();
  const docs = [
    {
      titre: 'Pâtes bolognaise',
      description: 'Portions maison à partager',
      quartier: 'Centre-ville',
      portions: 2,
      limiteHeure: new Date(now + 2 * 60 * 60 * 1000),
      reserved: false,
    },
    {
      titre: 'Couscous',
      description: 'Restes du dîner, très bon',
      quartier: 'Quartier Nord',
      portions: 3,
      limiteHeure: new Date(now + 4 * 60 * 60 * 1000),
      reserved: false,
    },
  ];

  await Meal.deleteMany({});
  await Meal.insertMany(docs);
  console.log('[seed] Seeded', docs.length, 'meals');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error('[seed] Failed', e);
  process.exit(1);
});


