const { Pool } = require('pg');
require('dotenv').config();

// The pg library automatically understands the DATABASE_URL format
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For production databases on services like Render, Heroku, etc., 
  // you often need to enable SSL.
  ssl: {
    rejectUnauthorized: false
  }
});

const initializeDatabase = async () => {
  // ... your initializeDatabase function remains the same
  try {
    
    // Test the connection
    const client = await pool.connect();
    console.log('Database connected successfully!');
    client.release();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
        last_login TIMESTAMP,
        registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // The UNIQUE constraint in the table definition makes this separate index redundant.
    // You can remove it, but it doesn't hurt to have it.
    // await pool.query(`
    //   CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique 
    //   ON users (email)
    // `);
    
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase
};