const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'PSSMS';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    multipleStatements: true
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.query(`USE \`${DB_NAME}\``);

  const schemaPath = path.join(__dirname, 'schema.sql');
  const rawSchema = fs.readFileSync(schemaPath, 'utf8');
  const schema = rawSchema
    .replace(/CREATE DATABASE IF NOT EXISTS [^;]+;?/gi, '')
    .replace(/USE [^;]+;?/gi, '');

  if (schema.trim()) {
    await connection.query(schema);
  }

  // Optional: seed an admin user when SEED_ADMIN=true and credentials provided
  const seedAdmin = process.env.SEED_ADMIN === 'true';
  const seedUser = process.env.SEED_ADMIN_USERNAME || 'admin';
  const seedPass = process.env.SEED_ADMIN_PASSWORD || 'adminpass';
  if (seedAdmin) {
    try {
      // hash password using bcryptjs if available, otherwise insert plain (less secure)
      let hash = null;
      try {
        const bcrypt = require('bcryptjs');
        hash = await bcrypt.hash(seedPass, 10);
      } catch (e) {
        console.warn('bcryptjs not available, inserting plaintext password for seeded admin');
      }

      const [existing] = await connection.query('SELECT id FROM users WHERE username = ?', [seedUser]);
      if (!existing || existing.length === 0) {
        if (hash) {
          await connection.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [seedUser, hash, 'admin']);
        } else {
          await connection.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [seedUser, seedPass, 'admin']);
        }
        console.log(`Seeded admin user: ${seedUser}`);
      } else {
        console.log('Admin user already exists, skipping seed');
      }
    } catch (err) {
      console.error('Error seeding admin user:', err.message || err);
    }
  }

  await connection.end();
  console.log(`Database initialized: ${DB_NAME}`);
}

module.exports = initDatabase;
