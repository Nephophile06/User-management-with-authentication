const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'user_management',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize database tables and create unique index (REQUIREMENT #1)
const initializeDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');
    
    // Create users table with unique index on email
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
        last_login TIMESTAMP,
        registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create unique index on email field (REQUIREMENT #1)
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique 
      ON users (email)
    `);

    console.log('✅ Database setup complete!');
    console.log('✅ Unique index created on email field');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase
}; 