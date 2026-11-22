
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const monk = require('monk');

// Routes
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const createContactRouter = require('./routes/contact');

// App configuration
const app = express();
const PORT = Number(process.env.PORT || 5000);

const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/gospelhub';

// Upload directories
const uploadsRoot = path.join(__dirname, 'uploads');
const mediaDirectory = path.join(uploadsRoot, 'media');
const coversDirectory = path.join(uploadsRoot, 'covers');

fs.mkdirSync(mediaDirectory, { recursive: true });
fs.mkdirSync(coversDirectory, { recursive: true });

// Security configuration
app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },
    contentSecurityPolicy: false
  })
);



app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://10.15.96.118:5173',
      'http://10.42.0.1:5173'
    ]
  })
);


// Middleware
app.use(express.json({ limit: '1mb' }));

// Serve uploaded media and cover images
app.use(
  '/uploads',
  express.static(uploadsRoot, {
    fallthrough: false,
    maxAge: '1h'
  })
);

// MongoDB connection
const db = monk(mongoUri);
app.locals.db = db;

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await db.command({ ping: 1 });

    res.json({
      success: true,
      message: 'GospelHub API and MongoDB are ready'
    });
  } catch (error) {
    console.error('MongoDB health check failed:', error.message);

    res.status(503).json({
      success: false,
      message: 'API is running but MongoDB is unavailable'
    });
  }
});

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

// Apply login rate limiting
app.use('/api/auth/login', loginLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/contact', createContactRouter(db));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message || err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : 'Unexpected server error'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`GospelHub API: http://localhost:${PORT}`);
  console.log(`Network API: http://10.15.96.118:${PORT}`);
});

// Graceful shutdown
async function shutdown() {
  console.log('\nShutting down GospelHub API...');

  server.close(async () => {
    try {
      await db.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('Shutdown error:', error.message);
      process.exit(1);
    }
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
