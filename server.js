require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 10000;   // Render использует 10000 по умолчанию
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE-ME';
const JWT_EXPIRES = '7d';

if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'CHANGE-ME') {
  console.error('FATAL: JWT_SECRET not set!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (e) => console.error('DB error:', e.message));

async function testDb() {
  try {
    const r = await pool.query('SELECT NOW() AS now');
    return { ok: true, now: r.rows[0].now };
  } catch (e) { return { ok: false, error: e.message }; }
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!t) return res.status(401).json({ error: 'Token required' });
  try { req.user = jwt.verify(t, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}

app.get('/health', async (req, res) => {
  const db = await testDb();
  res.status(db.ok ? 200 : 503).json({
    status: db.ok ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
    database: db.ok ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: 'email, password, name required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password min 8 chars' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1,$2,$3,'logist') RETURNING id,email,name,role`,
      [email.toLowerCase(), hash, name]
    );
    const user = r.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ token, user });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email exists' });
    console.error(e); res.status(500).json({ error: 'Register error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email, password required' });
  try {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
    if (!r.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Login error' }); }
});

app.get('/api/auth/me', auth, async (req, res) => {
  const r = await pool.query('SELECT id,email,name,role FROM users WHERE id=$1', [req.user.id]);
  if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(r.rows[0]);
});

app.get('/api/shipments', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const params = []; let sql = 'SELECT * FROM shipments';
    if (status && status !== 'all') { sql += ' WHERE status=$1'; params.push(status); }
    sql += ' ORDER BY created_at DESC';
    const r = await pool.query(sql, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Error' }); }
});

app.post('/api/shipments', auth, async (req, res) => {
  const { name, volume, route, container_count, vessel } = req.body || {};
  if (!name || !volume) return res.status(400).json({ error: 'name, volume required' });
  try {
    const idR = await pool.query(`SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)),0)+1 AS n FROM shipments WHERE id LIKE 'SH-%'`);
    const id = 'SH-' + String(idR.rows[0].n).padStart(3, '0');
    const r = await pool.query(
      `INSERT INTO shipments (id,name,volume,route,container_count,vessel,status,progress)
       VALUES ($1,$2,$3,$4,$5,$6,'Закупка',0) RETURNING *`,
      [id, name, volume, route || '', container_count || 0, vessel || null]);
    await pool.query('INSERT INTO activity_log (icon,text,user_id) VALUES ($1,$2,$3)',
      ['📦', `Создана партия ${id}`, req.user.id]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Error' }); }
});

app.patch('/api/shipments/:id', auth, async (req, res) => {
  const { status, progress, name, volume } = req.body || {};
  try {
    const r = await pool.query(
      `UPDATE shipments SET
        status=COALESCE($1,status), progress=COALESCE($2,progress),
        name=COALESCE($3,name), volume=COALESCE($4,volume), updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [status, progress, name, volume, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.delete('/api/shipments/:id', auth, async (req, res) => {
  try { await pool.query('DELETE FROM shipments WHERE id=$1', [req.params.id]); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Error' }); }
});

app.get('/api/tasks', auth, async (req, res) => {
  try {
    const r = await pool.query(`SELECT t.*, u.name AS assignee_name FROM tasks t LEFT JOIN users u ON u.id=t.assignee_id ORDER BY t.created_at DESC`);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.post('/api/tasks', auth, async (req, res) => {
  const { title, description, priority, due_date, status } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const r = await pool.query(
      `INSERT INTO tasks (title,description,assignee_id,priority,due_date,status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description || '', req.user.id, priority || 'medium', due_date || null, status || 'todo']);
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.patch('/api/tasks/:id', auth, async (req, res) => {
  const { status } = req.body || {};
  try {
    const r = await pool.query('UPDATE tasks SET status=COALESCE($1,status) WHERE id=$2 RETURNING *', [status, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try { await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]); res.json({ ok: true }); }
  catch { res.status(500).json({ error: 'Error' }); }
});

app.post('/api/shipments/:id/comments', auth, async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const r = await pool.query(`INSERT INTO comments (shipment_id,user_id,text) VALUES ($1,$2,$3) RETURNING *`,
      [req.params.id, req.user.id, text]);
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.get('/api/chat/:channel', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT m.*, u.name AS user_name FROM chat_messages m LEFT JOIN users u ON u.id=m.user_id
       WHERE m.channel=$1 ORDER BY m.created_at ASC LIMIT 500`, [req.params.channel]);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.post('/api/chat/:channel', auth, async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const r = await pool.query(`INSERT INTO chat_messages (channel,user_id,text) VALUES ($1,$2,$3) RETURNING *`,
      [req.params.channel, req.user.id, text]);
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.get('/api/activity', auth, async (req, res) => {
  try {
    const r = await pool.query(`SELECT a.*, u.name AS user_name FROM activity_log a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 50`);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res, fp) => { if (fp.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); }
}));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  if (process.env.NODE_ENV === 'production') setTimeout(() => process.exit(1), 1000);
});
process.on('SIGTERM', () => { pool.end(() => process.exit(0)); });

app.listen(PORT, async () => {
  console.log(`LogiCRM started on ${PORT}`);
  const db = await testDb();
  console.log('DB:', db.ok ? 'connected' : 'FAILED ' + db.error);
});
