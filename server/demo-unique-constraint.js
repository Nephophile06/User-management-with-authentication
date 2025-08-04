const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',
  database: 'user_management',  
  password: 'tushu',       
  port: 5432,
});

console.log('DATABASE-LEVEL UNIQUE CONSTRAINT DEMONSTRATION (PostgreSQL)\n');
console.log('This demonstrates that the unique constraint is enforced at the DATABASE level, not application level.\n');

(async () => {
  let client;
  
  const testEmail = 'demo@example.com';

  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database');

    console.log('\nTable Structure (email column):');
    const tableInfoRes = await client.query(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'email'`
    );
    
    if (tableInfoRes.rows.length > 0) {
      const emailCol = tableInfoRes.rows[0];
      console.log(`Email column: ${emailCol.column_name} (${emailCol.data_type}) - NOT NULL: ${emailCol.is_nullable === 'NO'}`);
    } else {
        console.log('Email column not found in users table.');
    }
    
    console.log('\nUnique Constraints:');
    const constraintRes = await client.query(
      `SELECT indexname as constraint_name
       FROM pg_indexes
       WHERE schemaname = 'public' AND tablename = 'users' AND indexdef LIKE '%UNIQUE%'`
    );
    
    if (constraintRes.rows.length > 0) {
      console.log(`Unique constraint found: ${constraintRes.rows[0].constraint_name}`);
    } else {
      console.log('No UNIQUE constraint found for the users table.');
    }

    console.log('\nDATABASE-LEVEL CONSTRAINT TEST:');
    
    await client.query('DELETE FROM users WHERE email = $1', [testEmail]);

    console.log('Attempting to insert a new user...');
    const firstInsertRes = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      ['Test User 1', testEmail, 'hashedpassword']
    );
    console.log('First insert successful (ID:', firstInsertRes.rows[0].id, ')');
    
    console.log('\nAttempting second insert with the same email...');
    try {
        await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            ['Test User 2', testEmail, 'hashedpassword']
        );
        console.log('Second insert should have failed but succeeded. Constraint might be missing.');
    } catch (err) {
        if (err.code === '23505') { 
            console.log('✅ DATABASE-LEVEL CONSTRAINT WORKING!');
            console.log('Error Code:', err.code);
            console.log('Error Message:', err.message);
            console.log('This error was thrown by PostgreSQL, not by application code!');
        } else {
            console.error('An unexpected error occurred during the second insert:', err);
        }
    }

  } catch (err) {
    console.error('An error occurred during the demonstration:', err);
  } finally {
    if (client) {
        console.log('\nCleaning up test data...');
        await client.query('DELETE FROM users WHERE email = $1', [testEmail]);
        console.log('Test data cleaned up.');
        
        client.release();
        console.log('\nConnection released.');
    }
    
    await pool.end();
    console.log('Pool has ended.');
  }
})();