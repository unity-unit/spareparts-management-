const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const carRoutes = require('./routes/car');
const slotRoutes = require('./routes/parkingslot');
const recordRoutes = require('./routes/parkingrecord');
const paymentRoutes = require('./routes/payment');
const initDatabase = require('./initDb');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cars', carRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/payments', paymentRoutes);

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
