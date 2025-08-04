const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initializeDatabase = async () => {
  try {
    
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
    
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase
};