import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const u = await UserModel.findById(req.user!.id).lean<any>();
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    banner: u.banner,
    specialty: u.specialty,
    location: u.location,
    followers: u.followers,
    artworksCount: u.artworksCount,
    totalLikes: u.totalLikes,
    bio: u.bio,
    skills: u.skills,
    joined: u.joined,
    social: u.social,
  });
});

router.put('/', requireAuth, async (req: AuthRequest, res) => {
  const allowed: any = {};
  if (typeof req.body.name === 'string') allowed.name = req.body.name;
  if (typeof req.body.email === 'string') allowed.email = req.body.email;
  if (typeof req.body.avatar === 'string') allowed.avatar = req.body.avatar;
  if (typeof req.body.banner === 'string') allowed.banner = req.body.banner;
  if (typeof req.body.specialty === 'string') allowed.specialty = req.body.specialty;
  if (typeof req.body.location === 'string') allowed.location = req.body.location;
  if (typeof req.body.bio === 'string') allowed.bio = req.body.bio;
  if (Array.isArray(req.body.skills)) allowed.skills = req.body.skills;
  if (typeof req.body.joined === 'string') allowed.joined = req.body.joined;
  if (req.body.social && typeof req.body.social === 'object') {
    allowed.social = {};
    if (typeof req.body.social.instagram === 'string') allowed.social.instagram = req.body.social.instagram;
    if (typeof req.body.social.website === 'string') allowed.social.website = req.body.social.website;
    if (typeof req.body.social.twitter === 'string') allowed.social.twitter = req.body.social.twitter;
  }
  const u = await UserModel.findByIdAndUpdate(req.user!.id, allowed, { new: true }).lean<any>();
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    banner: u.banner,
    specialty: u.specialty,
    location: u.location,
    followers: u.followers,
    artworksCount: u.artworksCount,
    totalLikes: u.totalLikes,
    bio: u.bio,
    skills: u.skills,
    joined: u.joined,
    social: u.social,
  });
});

export default router;


