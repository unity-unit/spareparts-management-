const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [records] = await pool.execute(
      `SELECT pr.id, pr.plate_number, c.driver_name, c.phone_number, pr.slot_number, ps.slot_status,
        pr.entry_time, pr.exit_time, pr.duration
       FROM parking_record pr
       LEFT JOIN car c ON pr.plate_number = c.plate_number
       LEFT JOIN parking_slot ps ON pr.slot_number = ps.slot_number
       ORDER BY pr.id DESC`
    );
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching parking records', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { plate_number, slot_number, entry_time, exit_time, duration } = req.body;
  if (!plate_number || !slot_number || !entry_time) {
    return res.status(400).json({ message: 'plate_number, slot_number, and entry_time are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO parking_record (plate_number, slot_number, entry_time, exit_time, duration) VALUES (?, ?, ?, ?, ?)',
      [plate_number, slot_number, entry_time, exit_time || null, duration || null]
    );
    res.status(201).json({ message: 'Parking record created', id: result.insertId, data: { plate_number, slot_number, entry_time } });
  } catch (error) {
    console.error('❌ Parking Record Insert Error:', error);
    res.status(500).json({ 
      message: 'Error inserting parking record', 
      error: error.message,
      code: error.code,
      details: error.sqlMessage || 'Check server logs for details'
    });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { plate_number, slot_number, entry_time, exit_time, duration } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE parking_record SET plate_number = ?, slot_number = ?, entry_time = ?, exit_time = ?, duration = ? WHERE id = ?',
      [plate_number, slot_number, entry_time, exit_time || null, duration || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Parking record not found' });
    }
    res.json({ message: 'Parking record updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating parking record', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM parking_record WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Parking record not found' });
    }
    res.json({ message: 'Parking record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting parking record', error: error.message });
  }
});

module.exports = router;
