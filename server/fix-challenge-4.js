const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bugrank_auth',
  password: '1234',
  port: 5432
});

async function fixChallenge4() {
  try {
    const testCase = {
      input: '',
      expectedOutput: 'Circle area: 78.5\n'
    };
    
    const result = await pool.query(
      `UPDATE challenges 
       SET test_cases = $1 
       WHERE id = $2`,
      [JSON.stringify(testCase), 'challenge-4']
    );
    console.log('✅ Challenge 4 test case updated successfully!');
    console.log(`   Rows affected: ${result.rowCount}`);
    
    // Verify the update
    const verify = await pool.query('SELECT test_cases FROM challenges WHERE id = $1', ['challenge-4']);
    console.log('   New test case:', verify.rows[0].test_cases);
  } catch (error) {
    console.error('❌ Error updating challenge:', error.message);
  } finally {
    await pool.end();
  }
}

fixChallenge4();
