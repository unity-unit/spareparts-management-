const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = '8h';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length) return res.status(409).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Auth Register Error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
  try {
    const [rows] = await pool.execute('SELECT id, password_hash FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  } catch (error) {
    console.error('Auth Login Error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
