import { Router } from 'express';
import { UserModel } from '../models/User';

const router = Router();

router.get('/', async (_req, res) => {
  const artists = await UserModel.find({ role: 'artist' }).select('name avatar role banner specialty location followers artworksCount totalLikes bio skills joined social').lean();
  res.json(artists);
});

router.get('/:id', async (req, res) => {
  const artist = await UserModel.findById(req.params.id).select('name avatar role banner specialty location followers artworksCount totalLikes bio skills joined social').lean();
  if (!artist) return res.status(404).json({ error: 'Artist not found' });
  res.json(artist);
});

export default router;


