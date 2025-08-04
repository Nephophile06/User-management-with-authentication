// Use the 'pg' library for PostgreSQL
const { Pool } = require('pg');

// --- ⚠️ Configuration ---
// IMPORTANT: Replace these placeholder values with your actual database credentials.
const pool = new Pool({
  user: 'postgres',       // e.g., 'postgres'
  host: 'localhost',
  database: 'user_management',  // e.g., 'task4db'
  password: 'tushu',       // e.g., 'admin123'
  port: 5432,
});

console.log('DATABASE-LEVEL UNIQUE CONSTRAINT DEMONSTRATION (PostgreSQL)\n');
console.log('This demonstrates that the unique constraint is enforced at the DATABASE level, not application level.\n');

// Use an async IIFE (Immediately Invoked Function Expression) to use await
(async () => {
  let client;
  
  // ✅ FIX: Define testEmail here so it's available in both the try and finally blocks.
  const testEmail = 'demo@example.com';

  try {
    // A client is an active connection from the pool.
    client = await pool.connect();
    console.log('Connected to PostgreSQL database');

    // --- PostgreSQL uses the information_schema for introspection ---
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
    // ✅ FIX: Improved query to reliably find unique constraints and indexes.
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
    
    // Cleanup any old test data before starting the test
    await client.query('DELETE FROM users WHERE email = $1', [testEmail]);

    // --- First Insert ---
    console.log('Attempting to insert a new user...');
    const firstInsertRes = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      ['Test User 1', testEmail, 'hashedpassword']
    );
    console.log('First insert successful (ID:', firstInsertRes.rows[0].id, ')');
    
    // --- Second (Failing) Insert ---
    console.log('\nAttempting second insert with the same email...');
    try {
        await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            ['Test User 2', testEmail, 'hashedpassword']
        );
        // This line should NOT be reached
        console.log('Second insert should have failed but succeeded. Constraint might be missing.');
    } catch (err) {
        // PostgreSQL throws a specific error code for unique violations
        if (err.code === '23505') { // 23505 is the error code for unique_violation
            console.log('✅ DATABASE-LEVEL CONSTRAINT WORKING!');
            console.log('Error Code:', err.code);
            console.log('Error Message:', err.message);
            console.log('This error was thrown by PostgreSQL, not by application code!');
        } else {
            // Handle other potential errors
            console.error('An unexpected error occurred during the second insert:', err);
        }
    }

  } catch (err) {
    console.error('An error occurred during the demonstration:', err);
  } finally {
    // --- Cleanup ---
    if (client) {
        console.log('\nCleaning up test data...');
        // This now works because testEmail is in scope.
        await client.query('DELETE FROM users WHERE email = $1', [testEmail]);
        console.log('Test data cleaned up.');
        
        // Release the client back to the pool
        client.release();
        console.log('\nConnection released.');
    }
    
    // Close all connections in the pool
    await pool.end();
    console.log('Pool has ended.');
  }
})();