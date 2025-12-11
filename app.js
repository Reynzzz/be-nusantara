const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');

// Import models
const Event = require('./models/Event');
const News = require('./models/News');
const Product = require('./models/Product');
const About = require('./models/About');
const Gallery = require('./models/Gallery');
const Milestone = require('./models/Milestone');

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const newsRoutes = require('./routes/newsRoutes');
const productRoutes = require('./routes/productRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'https://nusantaramc.org',
  'https://www.nusantaramc.org'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/milestones', milestoneRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Sync database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync models with database (force: false means it won't drop existing tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});