import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = jwt.sign({ uid: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: String(user._id), email, name: user.name || '' } });
  } catch (e) {
    res.status(500).json({ error: 'registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ uid: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: String(user._id), email, name: user.name || '' } });
  } catch (e) {
    res.status(500).json({ error: 'login failed' });
  }
});

export default router;


