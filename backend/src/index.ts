import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import artworkRoutes from './routes/artworks';
import exhibitionRoutes from './routes/exhibitions';
import profileRoutes from './routes/profile';
import artistRoutes from './routes/artists';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'rang-manch-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/exhibitions', exhibitionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/artists', artistRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rang_manch';
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


