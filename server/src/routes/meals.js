import { Router } from 'express';
import Meal from '../models/Meal.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().sort({ createdAt: -1 }).lean();
    res.json(meals.map(m => ({ ...m, id: String(m._id) })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// POST /api/meals
router.post('/', requireAuth, async (req, res) => {
  try {
    const { titre, description, quartier, portions, limiteHeure } = req.body;
    if (!titre || !description || !quartier || !limiteHeure) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const meal = await Meal.create({
      titre,
      description,
      quartier,
      portions: Math.max(1, Number(portions || 1)),
      limiteHeure: new Date(limiteHeure),
    });
    res.status(201).json({ ...meal.toObject(), id: String(meal._id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// PATCH /api/meals/:id/reserve
router.patch('/:id/reserve', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findByIdAndUpdate(
      id,
      { $set: { reserved: true } },
      { new: true }
    );
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json({ ...meal.toObject(), id: String(meal._id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reserve meal' });
  }
});

export default router;


