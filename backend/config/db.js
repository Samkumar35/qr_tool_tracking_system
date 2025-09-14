const { Pool } = require('pg');
require('dotenv').config();

// 1. Define the connection pool using your connection string
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

// 2. Create a function to check the connection
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('❌ Unable to connect to the database:');
    console.error(error.message);
  }
};

// 3. Run the connection check automatically
checkConnection();

// 4. Export the pool for the rest of your application to use
module.exports = pool;