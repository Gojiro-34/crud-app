const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testConnection = async () => {
  let retries = 10;
  let delay = 3000;
  const maxDelay = 30000;

  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('Successfully connected to MySQL database');
      return;
    } catch (err) {
      console.error(`Database connection failed. Retries left: ${retries - 1}. Error: ${err.message}`);
      retries -= 1;
      
      if (retries === 0) {
        throw new Error('Could not connect to the database after maximum retries.');
      }
      
      console.log(`Waiting ${delay / 1000}s before retrying...`);
      await new Promise(res => setTimeout(res, delay));
      delay = Math.min(delay * 2, maxDelay);
    }
  }
};

module.exports = {
  pool,
  testConnection
};
