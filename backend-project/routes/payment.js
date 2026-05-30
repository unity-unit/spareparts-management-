const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { parking_record_id, amount_paid, payment_date } = req.body;
  if (!parking_record_id || amount_paid == null || !payment_date) {
    return res.status(400).json({ message: 'parking_record_id, amount_paid, and payment_date are required' });
  }
  try {
    await pool.execute(
      'INSERT INTO payment (parking_record_id, amount_paid, payment_date) VALUES (?, ?, ?)',
      [parking_record_id, amount_paid, payment_date]
    );
    res.status(201).json({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting payment', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [payments] = await pool.execute(
      `SELECT p.id, p.parking_record_id, p.amount_paid, p.payment_date,
              pr.plate_number, pr.slot_number
       FROM payment p
       LEFT JOIN parking_record pr ON p.parking_record_id = pr.id
       ORDER BY p.id DESC`
    );
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

module.exports = router;
