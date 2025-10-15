require('dotenv/config');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./dist/routes/auth');
const artworkRoutes = require('./dist/routes/artworks');
const exhibitionRoutes = require('./dist/routes/exhibitions');
const profileRoutes = require('./dist/routes/profile');
const artistRoutes = require('./dist/routes/artists');

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
