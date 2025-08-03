const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'user_management.db');

const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection failed:', err);
        reject(err);
        return;
      }
            
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
          console.error('Failed to create users table:', err);
          reject(err);
          return;
        }
        
        db.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  });
};

const getConnection = () => {
  return new sqlite3.Database(dbPath);
};

const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      const db = getConnection();
      
      if (sql.includes('RETURNING')) {
        const [baseQuery, returningClause] = sql.split('RETURNING');
        const cleanQuery = baseQuery.trim();
        
        db.run(cleanQuery, params, function(err) {
          if (err) {
            db.close();
            reject(err);
            return;
          }
          
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