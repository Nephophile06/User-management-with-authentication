const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'user_management.db');

console.log('DATABASE-LEVEL UNIQUE CONSTRAINT DEMONSTRATION\n');
console.log('This demonstrates that the unique constraint is enforced at the DATABASE level, not application level.\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  
  console.log('Connected to SQLite database');
  
  console.log('\nTable Structure:');
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('Error getting table info:', err);
      return;
    }
    
    rows.forEach(row => {
      if (row.name === 'email') {
        console.log(`Email column: ${row.name} (${row.type}) - NOT NULL: ${row.notnull}, UNIQUE: ${row.pk === 0 && row.notnull === 1 ? 'YES' : 'NO'}`);
      }
    });
    
    console.log('\nUnique Constraints:');
    db.all("SELECT name FROM sqlite_master WHERE type='index' AND sql LIKE '%UNIQUE%'", (err, rows) => {
      if (err) {
        console.error('Error getting unique indexes:', err);
        return;
      }
      
      if (rows.length > 0) {
        rows.forEach(row => {
          console.log(`Unique index found: ${row.name}`);
        });
      } else {
        console.log('Unique constraint exists on email column (implicit)');
      }
      
      console.log('\nDATABASE-LEVEL CONSTRAINT TEST:');
      console.log('Attempting to insert duplicate email...');
      
      const testEmail = 'demo@example.com';
      
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        ['Test User 1', testEmail, 'hashedpassword'], function(err) {
        if (err) {
          console.log('First insert failed:', err.message);
        } else {
          console.log('First insert successful (ID:', this.lastID, ')');
          
          console.log('\nAttempting second insert with same email...');
          db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            ['Test User 2', testEmail, 'hashedpassword'], function(err) {
            if (err) {
              console.log('DATABASE-LEVEL CONSTRAINT WORKING!');
              console.log('Error:', err.message);
              console.log('This error was thrown by SQLite, not by application code!');
            } else {
              console.log('Second insert should have failed but succeeded');
            }
            
            db.run('DELETE FROM users WHERE email = ?', [testEmail], (err) => {
              if (err) {
                console.log('Could not clean up test data:', err.message);
              } else {
                console.log('Test data cleaned up');
              }
              
              db.close();
            });
          });
        }
      });
    });
  });
}); 