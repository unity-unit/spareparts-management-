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

  await connection.end();
  console.log(`Database initialized: ${DB_NAME}`);
}

module.exports = initDatabase;
