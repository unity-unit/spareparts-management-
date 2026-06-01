const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { slot_number, slot_status } = req.body;
  if (!slot_number || !slot_status) {
    return res.status(400).json({ message: 'slot_number and slot_status are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO parking_slot (slot_number, slot_status) VALUES (?, ?)',
      [slot_number, slot_status]
    );
    res.status(201).json({ message: 'Parking slot inserted successfully', data: { slot_number, slot_status } });
  } catch (error) {
    console.error('❌ Parking Slot Insert Error:', error);
    res.status(500).json({ 
      message: 'Error inserting parking slot', 
      error: error.message,
      code: error.code,
      details: error.sqlMessage || 'Check server logs for details'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const [slots] = await pool.execute('SELECT slot_number, slot_status FROM parking_slot ORDER BY slot_number');
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching parking slots', error: error.message });
  }
});

module.exports = router;
