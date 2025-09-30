import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { ExhibitionModel } from '../models/Exhibition';

const router = Router();

const CreateExhibitionSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  endDate: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['upcoming', 'past']),
  registrationOpen: z.boolean().default(true),
  featured: z.boolean().default(false),
  image: z.string().min(1),
  artworks: z.array(z.string()).default([])
});

router.get('/', async (_req, res) => {
  const list = await ExhibitionModel.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.post('/', requireAuth, requireRole('artist'), async (req: AuthRequest, res) => {
  const parsed = CreateExhibitionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await ExhibitionModel.create({ ...parsed.data, artistId: req.user!.id });
  res.status(201).json(created);
});

export default router;


