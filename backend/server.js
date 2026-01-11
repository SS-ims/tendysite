/* =======================
   IMPORTS
   ======================= */
   require('dotenv').config();

console.log('ENV CHECK:', {
  jwt: !!process.env.JWT_SECRET,
  mailUser: !!process.env.MAIL_USER,
  mailPass: !!process.env.MAIL_PASS,
  adminEmail: !!process.env.ADMIN_EMAIL
});



const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'CHANGE_THIS_SECRET';

/* =======================
   APP SETUP
   ======================= */

console.log('JWT secret loaded:', !!process.env.JWT_SECRET);


const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/* =======================
   AUTH MIDDLEWARE
   ======================= */
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const token = auth.split(' ')[1];
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/* =======================
   DATABASE CONNECTION
   ======================= */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1984',
  database: 'tendy_db'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('MySQL connected');
});

/* =======================
   TEST ROUTE
   ======================= */
app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* =======================
   PRODUCTS
   ======================= */
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =======================
   CATEGORIES
   ======================= */
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =======================
   PUBLIC ENQUIRIES
   ======================= */
app.post('/api/enquiries', (req, res) => {
  const { product_id, name, email, phone, message } = req.body;

  const sql = `
    INSERT INTO product_enquiries
    (product_id, name, email, phone, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [product_id, name, email, phone, message],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

/* =======================
   ADMIN LOGIN
   ======================= */
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM admins WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json(err);
      if (!results.length)
        return res.status(401).json({ error: 'Invalid credentials' });

      const admin = results[0];
      const valid = await bcrypt.compare(password, admin.password_hash);

      if (!valid)
        return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { adminId: admin.id },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({ token });
    }
  );
});

/* =======================
   ADMIN ENQUIRIES
   ======================= */
app.get('/api/admin/enquiries', requireAdmin, (req, res) => {
  const sql = `
    SELECT
      e.id,
      e.name,
      e.email,
      e.phone,
      e.message,
      e.status,
      e.created_at,
      p.name AS product_name
    FROM product_enquiries e
    JOIN products p ON e.product_id = p.id
    ORDER BY e.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.patch('/api/admin/enquiries/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;

  db.query(
    'UPDATE product_enquiries SET status = ? WHERE id = ?',
    [status, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

/* =======================
   ADMIN DASHBOARD
   ======================= */
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(status = 'new') AS newCount,
      SUM(status = 'contacted') AS contacted,
      SUM(status = 'closed') AS closed
    FROM product_enquiries
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
});

/* =======================
   SERVER START
   ======================= */
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
