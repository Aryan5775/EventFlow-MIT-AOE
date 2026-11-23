
import dns from 'node:dns';

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import api from './routes/api.js';

// Configure DNS before connecting to MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('MongoDB DNS configured:', dns.getServers());

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

// JSON middleware
app.use(express.json({ limit: '1mb' }));

// API rate limiting
app.use('/api', rateLimit({
  windowMs: 900000,
  limit: 400
}));

// Health check
app.get('/api/health', (_q, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api', api);

// Error handling
app.use((err, _req, res, _next) => {
  console.error(err);

  if (
    err.name === 'ValidationError' ||
    err.name === 'CastError'
  ) {
    return res.status(400).json({
      message: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate record.'
    });
  }

  res.status(500).json({
    message: 'Server error. Check backend terminal.'
  });
});

// Environment validation
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Create server/.env from .env.example first.');
  process.exit(1);
}

// MongoDB Atlas connection
try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('MongoDB connected');

  app.listen(process.env.PORT || 5000, () => {
    console.log(
      'EventFlow API running on port ' +
      (process.env.PORT || 5000)
    );
  });

} catch (error) {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
}
