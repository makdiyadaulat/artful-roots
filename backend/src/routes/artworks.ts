import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { ArtworkModel } from '../models/Artwork';
import { UserModel } from '../models/User';
import { CommentModel } from '../models/Comment';

const router = Router();

const CreateArtworkSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  medium: z.string().optional(),
  size: z.string().optional(),
  price: z.number().nonnegative(),
  image: z.string().min(1),
  description: z.string().optional()
});

router.get('/', async (_req, res) => {
  const list = await ArtworkModel.find({}).sort({ createdAt: -1 }).lean();
  res.json(list);
});

router.post('/', requireAuth, requireRole('artist'), async (req: AuthRequest, res) => {
  const parsed = CreateArtworkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const me = await UserModel.findById(req.user!.id).select('name').lean<{ name: string }>();
  if (!me) return res.status(404).json({ error: 'User not found' });
  const created = await ArtworkModel.create({
    ...parsed.data,
    artistId: req.user!.id,
    artist: me.name,
  });
  res.status(201).json(created);
});

router.get('/:id', async (req, res) => {
  const a = await ArtworkModel.findById(req.params.id).lean();
  if (!a) return res.status(404).json({ error: 'Not found' });
  const comments = await CommentModel.find({ artworkId: req.params.id })
    .sort({ createdAt: -1 })
    .lean();
  const mapped = comments.map((c: any) => ({
    id: c._id.toString(),
    user: c.userName,
    avatar: c.userAvatar,
    text: c.text,
    date: new Date(c.createdAt).toISOString().split('T')[0],
  }));
  const aAny: any = a;
  res.json({ ...aAny, id: aAny._id, comments: mapped });
});

// Comments: list
router.get('/:id/comments', async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id).select('_id').lean();
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  const comments = await CommentModel.find({ artworkId: req.params.id })
    .sort({ createdAt: -1 })
    .lean();
  const mapped = comments.map((c: any) => ({
    id: c._id.toString(),
    user: c.userName,
    avatar: c.userAvatar,
    text: c.text,
    date: new Date(c.createdAt).toISOString().split('T')[0],
  }));
  res.json(mapped);
});

// Comments: create
const CreateCommentSchema = z.object({
  text: z.string().min(1),
});

router.post('/:id/comments', requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreateCommentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const artwork = await ArtworkModel.findById(req.params.id).select('_id').lean();
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  const me = await UserModel.findById(req.user!.id).select('name avatar').lean<{ name: string; avatar: string }>();
  if (!me) return res.status(404).json({ error: 'User not found' });
  const created = await CommentModel.create({
    artworkId: req.params.id,
    userId: req.user!.id,
    userName: me.name,
    userAvatar: me.avatar,
    text: parsed.data.text,
  });
  res.status(201).json({
    id: created._id.toString(),
    user: me.name,
    avatar: me.avatar,
    text: created.text,
    date: new Date(created.createdAt!).toISOString().split('T')[0],
  });
});

// Comments: delete
router.delete('/:id/comments/:commentId', requireAuth, async (req: AuthRequest, res) => {
  const [comment, artwork] = await Promise.all([
    CommentModel.findById(req.params.commentId),
    ArtworkModel.findById(req.params.id).select('artistId'),
  ]);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  const isOwner = comment.userId?.toString() === req.user!.id;
  const isArtist = artwork.artistId?.toString() === req.user!.id;
  if (!isOwner && !isArtist) return res.status(403).json({ error: 'Forbidden' });
  await comment.deleteOne();
  res.json({ ok: true });
});

router.put('/:id', requireAuth, requireRole('artist'), async (req: AuthRequest, res) => {
  const updated = await ArtworkModel.findOneAndUpdate(
    { _id: req.params.id, artistId: req.user!.id },
    req.body,
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole('artist'), async (req: AuthRequest, res) => {
  const deleted = await ArtworkModel.findOneAndDelete({ _id: req.params.id, artistId: req.user!.id }).lean();
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json(deleted);
});

export default router;


