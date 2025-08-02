const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import our modules
const { initializeDatabase } = require('./database-sqlite');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes); // Authentication routes (login/register)
app.use('/api/users', userRoutes); // User management routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting User Management Server...');
    
    // Set up database tables and unique index
    await initializeDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 