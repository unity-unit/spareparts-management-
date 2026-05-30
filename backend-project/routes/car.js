const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { plate_number, driver_name, phone_number } = req.body;
  if (!plate_number || !driver_name || !phone_number) {
    return res.status(400).json({ message: 'plate_number, driver_name, and phone_number are required' });
  }
  try {
    await pool.execute(
      'INSERT INTO car (plate_number, driver_name, phone_number) VALUES (?, ?, ?)',
      [plate_number, driver_name, phone_number]
    );
    res.status(201).json({ message: 'Car inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting car', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [cars] = await pool.execute('SELECT plate_number, driver_name, phone_number FROM car ORDER BY plate_number');
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
});

module.exports = router;
