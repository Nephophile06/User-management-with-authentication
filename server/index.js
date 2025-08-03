const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./database-sqlite');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const startServer = async () => {
  try {    
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 