const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the server directory
const dbPath = path.join(__dirname, 'user_management.db');

// Initialize database tables and create unique index
const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    console.log('🔧 Setting up SQLite database...');
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Connected to SQLite database');
      
      // Create users table with unique index on email
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
          last_login DATETIME,
          registration_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Failed to create users table:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Users table created successfully');
        console.log('✅ Unique constraint on email field');
        
        db.close((err) => {
          if (err) {
            console.error('❌ Failed to close database:', err);
            reject(err);
            return;
          }
          console.log('✅ Database setup complete!');
          resolve();
        });
      });
    });
  });
};

// Create a connection pool-like interface for SQLite
const getConnection = () => {
  return new sqlite3.Database(dbPath);
};

// Mock pool interface to maintain compatibility with existing code
const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      const db = getConnection();
      
      // Handle RETURNING clause for SQLite
      if (sql.includes('RETURNING')) {
        // Split the query to handle RETURNING
        const [baseQuery, returningClause] = sql.split('RETURNING');
        const cleanQuery = baseQuery.trim();
        
        db.run(cleanQuery, params, function(err) {
          if (err) {
            db.close();
            reject(err);
            return;
          }
          
          // Get the inserted/updated data
          const selectFields = returningClause.trim();
          const selectQuery = `SELECT ${selectFields} FROM users WHERE id = ?`;
          
          db.get(selectQuery, [this.lastID], (err, row) => {
            db.close();
            if (err) {
              reject(err);
            } else {
              resolve({ 
                rows: row ? [row] : [],
                rowCount: this.changes 
              });
            }
          });
        });
      } else if (sql.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sql, params, (err, rows) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve({ rows });
          }
        });
      } else {
        db.run(sql, params, function(err) {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve({ 
              rows: [{ id: this.lastID }],
              rowCount: this.changes 
            });
          }
        });
      }
    });
  }
};

module.exports = {
  pool,
  initializeDatabase
}; 