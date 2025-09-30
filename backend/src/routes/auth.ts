import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../models/User';

const router = Router();

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['artist', 'visitor'])
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, password, role } = parsed.data;
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const created = await UserModel.create({ name, email, password: hash, role, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` });
  const token = jwt.sign({ sub: created._id.toString(), role: created.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: created._id, name: created.name, email: created.email, role: created.role, avatar: created.avatar } });
});

router.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
});

export default router;


