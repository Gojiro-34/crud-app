require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const { testConnection, pool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Mount tasks router
app.use('/api/tasks', tasksRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Apply error handler middleware (must be last)
app.use(errorHandler);

// Test database connection then start server
testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
