require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    console.log('Подключаюсь к БД...');
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Схема применена!');
    const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Таблицы:', r.rows.map(x => x.table_name).join(', '));
  } catch (e) {
    console.error('Ошибка:', e.message);
  } finally {
    await pool.end();
  }
})();