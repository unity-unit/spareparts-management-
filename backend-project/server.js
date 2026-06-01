const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const carRoutes = require('./routes/car');
const slotRoutes = require('./routes/parkingslot');
const recordRoutes = require('./routes/parkingrecord');
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const initDatabase = require('./initDb');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Public auth routes
app.use('/api/auth', authRoutes);

// Protect API routes with JWT middleware
app.use('/api/cars', authMiddleware, carRoutes);
app.use('/api/slots', authMiddleware, slotRoutes);
app.use('/api/records', authMiddleware, recordRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: 'An unexpected error occurred',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PSSMS backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });
