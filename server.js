// ================================================================
// ប្រព័ន្ធគ្រប់គ្រងស្ថិតិភ្ញៀវទេសចរ - Choeung Ek Genocidal Center
// Backend Server: Node.js + Express + MySQL
// ================================================================

const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'choeungek_secret_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24h
}));

// ── Database Connection Pool ────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'choeungek_tourists',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

// ── Auth Middleware ─────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized' });
};

// ── Activity Log Helper ─────────────────────────────────────────
async function logActivity(userId, action, details) {
  try {
    await pool.execute(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [userId, action, details, '127.0.0.1']
    );
  } catch (e) { /* non-blocking */ }
}

// ================================================================
// AUTH ROUTES
// ================================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ success: false, message: 'Missing credentials' });
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0)
      return res.json({ success: false, message: 'Invalid username or password' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: 'Invalid username or password' });
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    await logActivity(user.id, 'LOGIN', `User ${username} logged in`);
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  await logActivity(req.session.userId, 'LOGOUT', 'User logged out');
  req.session.destroy();
  res.json({ success: true });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: { id: req.session.userId, username: req.session.username, role: req.session.role } });
});

// ================================================================
// DASHBOARD ROUTES
// ================================================================

// GET /api/dashboard/summary
app.get('/api/dashboard/summary', requireAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [[todayForeign]] = await pool.execute(
      'SELECT COALESCE(SUM(total_visitors),0) AS total, COALESCE(SUM(female_visitors),0) AS female FROM foreign_visitors WHERE visit_date = ?', [today]);
    const [[todayLocal]] = await pool.execute(
      'SELECT COALESCE(SUM(total_visitors),0) AS total, COALESCE(SUM(female_visitors),0) AS female FROM local_visitors WHERE visit_date = ?', [today]);
    const [[totalFemale]] = await pool.execute(
      'SELECT (SELECT COALESCE(SUM(female_visitors),0) FROM foreign_visitors) + (SELECT COALESCE(SUM(female_visitors),0) FROM local_visitors) AS total');
    res.json({
      success: true,
      data: {
        today_foreign: +todayForeign.total,
        today_local: +todayLocal.total,
        today_total: +todayForeign.total + +todayLocal.total,
        today_female: +todayForeign.female + +todayLocal.female,
        total_female: +totalFemale.total
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/dashboard/monthly?year=2026
app.get('/api/dashboard/monthly', requireAuth, async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const [foreign] = await pool.execute(
      'SELECT MONTH(visit_date) AS month, SUM(total_visitors) AS total, SUM(female_visitors) AS female FROM foreign_visitors WHERE YEAR(visit_date)=? GROUP BY MONTH(visit_date)', [year]);
    const [local] = await pool.execute(
      'SELECT MONTH(visit_date) AS month, SUM(total_visitors) AS total, SUM(female_visitors) AS female FROM local_visitors WHERE YEAR(visit_date)=? GROUP BY MONTH(visit_date)', [year]);
    res.json({ success: true, foreign, local });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/dashboard/top-countries?limit=10
app.get('/api/dashboard/top-countries', requireAuth, async (req, res) => {
  try {
    const limit = +req.query.limit || 10;
    const [rows] = await pool.execute(
      'SELECT country_name, SUM(total_visitors) AS total FROM foreign_visitors GROUP BY country_name ORDER BY total DESC LIMIT ?', [limit]);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/dashboard/top-provinces?limit=10
app.get('/api/dashboard/top-provinces', requireAuth, async (req, res) => {
  try {
    const limit = +req.query.limit || 10;
    const [rows] = await pool.execute(
      'SELECT province_name, SUM(total_visitors) AS total FROM local_visitors GROUP BY province_name ORDER BY total DESC LIMIT ?', [limit]);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ================================================================
// FOREIGN VISITORS CRUD
// ================================================================

// GET /api/foreign?from=&to=&search=&page=1&limit=20
app.get('/api/foreign', requireAuth, async (req, res) => {
  try {
    const { from, to, search, page = 1, limit = 20 } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (from) { where += ' AND visit_date >= ?'; params.push(from); }
    if (to)   { where += ' AND visit_date <= ?'; params.push(to); }
    if (search) { where += ' AND country_name LIKE ?'; params.push(`%${search}%`); }

    const offset = (+page - 1) * +limit;
    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM foreign_visitors ${where}`, params);
    const [rows] = await pool.execute(
      `SELECT * FROM foreign_visitors ${where} ORDER BY visit_date DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, +limit, offset]);
    res.json({ success: true, data: rows, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/foreign
app.post('/api/foreign', requireAuth, async (req, res) => {
  const { visit_date, country_name, total_visitors, female_visitors, note } = req.body;
  if (!visit_date || !country_name || !total_visitors)
    return res.json({ success: false, message: 'Missing required fields' });
  try {
    const [result] = await pool.execute(
      'INSERT INTO foreign_visitors (visit_date, country_name, total_visitors, female_visitors, note, created_by) VALUES (?,?,?,?,?,?)',
      [visit_date, country_name, +total_visitors, +(female_visitors||0), note||'', req.session.userId]);
    await logActivity(req.session.userId, 'INSERT_FOREIGN', `Added ${country_name}: ${total_visitors} visitors`);
    res.json({ success: true, id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/foreign/:id
app.put('/api/foreign/:id', requireAuth, async (req, res) => {
  const { visit_date, country_name, total_visitors, female_visitors, note } = req.body;
  try {
    await pool.execute(
      'UPDATE foreign_visitors SET visit_date=?, country_name=?, total_visitors=?, female_visitors=?, note=? WHERE id=?',
      [visit_date, country_name, +total_visitors, +(female_visitors||0), note||'', req.params.id]);
    await logActivity(req.session.userId, 'UPDATE_FOREIGN', `Updated record #${req.params.id}`);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /api/foreign/:id
app.delete('/api/foreign/:id', requireAuth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM foreign_visitors WHERE id = ?', [req.params.id]);
    await logActivity(req.session.userId, 'DELETE_FOREIGN', `Deleted record #${req.params.id}`);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ================================================================
// LOCAL VISITORS CRUD
// ================================================================

app.get('/api/local', requireAuth, async (req, res) => {
  try {
    const { from, to, search, page = 1, limit = 20 } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (from) { where += ' AND visit_date >= ?'; params.push(from); }
    if (to)   { where += ' AND visit_date <= ?'; params.push(to); }
    if (search) { where += ' AND province_name LIKE ?'; params.push(`%${search}%`); }
    const offset = (+page - 1) * +limit;
    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM local_visitors ${where}`, params);
    const [rows] = await pool.execute(
      `SELECT * FROM local_visitors ${where} ORDER BY visit_date DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, +limit, offset]);
    res.json({ success: true, data: rows, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/local', requireAuth, async (req, res) => {
  const { visit_date, province_name, total_visitors, female_visitors, note } = req.body;
  if (!visit_date || !province_name || !total_visitors)
    return res.json({ success: false, message: 'Missing required fields' });
  try {
    const [result] = await pool.execute(
      'INSERT INTO local_visitors (visit_date, province_name, total_visitors, female_visitors, note, created_by) VALUES (?,?,?,?,?,?)',
      [visit_date, province_name, +total_visitors, +(female_visitors||0), note||'', req.session.userId]);
    await logActivity(req.session.userId, 'INSERT_LOCAL', `Added ${province_name}: ${total_visitors} visitors`);
    res.json({ success: true, id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put('/api/local/:id', requireAuth, async (req, res) => {
  const { visit_date, province_name, total_visitors, female_visitors, note } = req.body;
  try {
    await pool.execute(
      'UPDATE local_visitors SET visit_date=?, province_name=?, total_visitors=?, female_visitors=?, note=? WHERE id=?',
      [visit_date, province_name, +total_visitors, +(female_visitors||0), note||'', req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/local/:id', requireAuth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM local_visitors WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ================================================================
// REPORTS & EXPORT
// ================================================================

// GET /api/reports?from=&to=&type=all|foreign|local
app.get('/api/reports', requireAuth, async (req, res) => {
  try {
    const { from, to, type = 'all' } = req.query;
    const fromD = from || '2000-01-01';
    const toD   = to   || '2099-12-31';
    let foreign = [], local = [];
    if (type !== 'local') {
      [foreign] = await pool.execute(
        'SELECT *, "foreign" AS visitor_type, country_name AS location FROM foreign_visitors WHERE visit_date BETWEEN ? AND ? ORDER BY visit_date DESC',
        [fromD, toD]);
    }
    if (type !== 'foreign') {
      [local] = await pool.execute(
        'SELECT *, "local" AS visitor_type, province_name AS location FROM local_visitors WHERE visit_date BETWEEN ? AND ? ORDER BY visit_date DESC',
        [fromD, toD]);
    }
    const combined = [...foreign, ...local].sort((a,b) => b.visit_date.localeCompare(a.visit_date));
    const totals = {
      total_visitors: combined.reduce((s,r) => s + +r.total_visitors, 0),
      female_visitors: combined.reduce((s,r) => s + +r.female_visitors, 0),
      count: combined.length
    };
    res.json({ success: true, data: combined, totals });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/export/excel?from=&to=
app.get('/api/export/excel', requireAuth, async (req, res) => {
  try {
    const { from = '2000-01-01', to = '2099-12-31' } = req.query;
    const [foreign] = await pool.execute(
      'SELECT * FROM foreign_visitors WHERE visit_date BETWEEN ? AND ? ORDER BY visit_date DESC', [from, to]);
    const [local] = await pool.execute(
      'SELECT * FROM local_visitors WHERE visit_date BETWEEN ? AND ? ORDER BY visit_date DESC', [from, to]);

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Choeung Ek Tourist System';

    // Sheet 1: Foreign
    const ws1 = wb.addWorksheet('ភ្ញៀវបរទេស');
    ws1.addRow(['ថ្ងៃ','ប្រទេស','ភ្ញៀវសរុប','ភ្ញៀវស្រី','ភ្ញៀវប្រុស','កំណត់']);
    foreign.forEach(r => ws1.addRow([r.visit_date, r.country_name, r.total_visitors, r.female_visitors, r.total_visitors - r.female_visitors, r.note]));

    // Sheet 2: Local
    const ws2 = wb.addWorksheet('ភ្ញៀវជាតិ');
    ws2.addRow(['ថ្ងៃ','ខេត្ត','ភ្ញៀវសរុប','ភ្ញៀវស្រី','ភ្ញៀវប្រុស','កំណត់']);
    local.forEach(r => ws2.addRow([r.visit_date, r.province_name, r.total_visitors, r.female_visitors, r.total_visitors - r.female_visitors, r.note]));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=visitors_${from}_${to}.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ================================================================
// ACTIVITY LOGS
// ================================================================
app.get('/api/logs', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT l.*, u.username FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Serve Frontend ──────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏛️  ប្រព័ន្ធគ្រប់គ្រងស្ថិតិភ្ញៀវទេសចរ`);
  console.log(`✅  Server running at http://localhost:${PORT}`);
  console.log(`📅  Started: ${new Date().toLocaleString()}\n`);
});

module.exports = app;
