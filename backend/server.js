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
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('./utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET';

/* =======================
   APP SETUP
   ======================= */

console.log('JWT secret loaded:', !!process.env.JWT_SECRET);


const app = express();

const rootDir = path.join(__dirname, '..');

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/assets', express.static(path.join(rootDir, 'assets')));
app.use('/styles', express.static(path.join(rootDir, 'styles')));
app.use('/scripts', express.static(path.join(rootDir, 'scripts')));

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
  PAGE ROUTES
  ======================= */
app.get('/', (req, res) => res.render('index'));
app.get('/services', (req, res) => res.render('services'));
app.get('/products', (req, res) => res.render('products'));
app.get('/training', (req, res) => res.render('training'));
app.get('/industries', (req, res) => res.render('industries'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));

app.get('/admin/login', (req, res) => res.render('admin-login'));
app.get('/admin/dashboard', (req, res) => res.render('admin-dashboard'));
app.get('/admin/enquiries', (req, res) => res.render('admin-enquiries'));

/* Legacy .html redirects */
app.get('/index.html', (req, res) => res.redirect('/'));
app.get('/services.html', (req, res) => res.redirect('/services'));
app.get('/products.html', (req, res) => res.redirect('/products'));
app.get('/training.html', (req, res) => res.redirect('/training'));
app.get('/industries.html', (req, res) => res.redirect('/industries'));
app.get('/about.html', (req, res) => res.redirect('/about'));
app.get('/contact.html', (req, res) => res.redirect('/contact'));
app.get('/admin-login.html', (req, res) => res.redirect('/admin/login'));
app.get('/admin-dashboard.html', (req, res) => res.redirect('/admin/dashboard'));
app.get('/admin-enquiries.html', (req, res) => res.redirect('/admin/enquiries'));

/* =======================
   PRODUCTS
   ======================= */
app.get('/api/products', (req, res) => {
  let sql = 'SELECT * FROM products';
  let params = [];

  // Filter by category if provided
  if (req.query.category && req.query.category !== '') {
    sql += ' WHERE category_id = ?';
    params.push(req.query.category);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
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
app.post('/api/enquiries', async (req, res) => {
  const { product_id, name, email, phone, message } = req.body;

  // Validation
  if (!product_id || !name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO product_enquiries
    (product_id, name, email, phone, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [product_id, name, email, phone || '', message],
    async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save enquiry' });
      }

      // Get product name
      db.query('SELECT name FROM products WHERE id = ?', [product_id], async (err, products) => {
        const productName = products && products[0] ? products[0].name : 'Unknown Product';

        // Send email to admin
        try {
          await sendMail({
            to: process.env.ADMIN_EMAIL || 'admin@tendywoodlands.com',
            subject: `New Product Enquiry: ${productName}`,
            html: `
              <h2>New Product Enquiry</h2>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            `
          });
        } catch (mailErr) {
          console.error('Email error:', mailErr);
        }

        // Send acknowledgment to customer
        try {
          await sendMail({
            to: email,
            subject: `Enquiry Confirmation - ${productName} - Tendy Woodlands Services`,
            html: `
              <h2>Thank You, ${name}!</h2>
              <p>We have received your enquiry about <strong>${productName}</strong>.</p>
              <p>Our team will review your request and get back to you as soon as possible.</p>
              <br>
              <p>Best regards,<br>Tendy Woodlands Services Team</p>
            `
          });
        } catch (mailErr) {
          console.error('Email error:', mailErr);
        }

        res.json({ success: true, message: 'Thank you for your enquiry!' });
      });
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
   PUBLIC CONTACT FORM
   ======================= */
app.post('/api/contact', (req, res) => {
  const { name, company, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, message' });
  }

  // Find or create client record
  db.query('SELECT id FROM clients WHERE email = ?', [email], (err, rows) => {
    if (err) {
      console.error('Database error (client lookup):', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const handleInsertRequest = (clientId) => {
      const sql = `
        INSERT INTO contact_requests
        (client_id, name, company, email, phone, message)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [clientId, name, company || '', email, '', message],
        async (err, result) => {
          if (err) {
            console.error('Database error (insert request):', err);
            return res.status(500).json({ error: 'Failed to save contact request' });
          }

          // Send email to admin
          try {
            await sendMail({
              to: process.env.ADMIN_EMAIL || 'admin@tendywoodlands.com',
              subject: `New Contact Request from ${name}`,
              html: `
                <h2>New Contact Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              `
            });
          } catch (mailErr) {
            console.error('Email error:', mailErr);
          }

          // Send acknowledgment to customer
          try {
            await sendMail({
              to: email,
              subject: 'We received your message - Tendy Woodlands Services',
              html: `
                <h2>Thank You, ${name}!</h2>
                <p>We have received your message and appreciate you reaching out.</p>
                <p>Our team will review your inquiry and get back to you shortly.</p>
                <br>
                <p>Best regards,<br>Tendy Woodlands Services Team</p>
              `
            });
          } catch (mailErr) {
            console.error('Email error:', mailErr);
          }

          res.json({ success: true, message: 'Thank you! We have received your message.' });
        }
      );
    };

    if (rows && rows.length) {
      // existing client
      handleInsertRequest(rows[0].id);
    } else {
      // create new client
      db.query(
        'INSERT INTO clients (name, company, email) VALUES (?, ?, ?)',
        [name, company || '', email],
        (err, result) => {
          if (err) {
            console.error('Database error (insert client):', err);
            return res.status(500).json({ error: 'Failed to create client' });
          }

          handleInsertRequest(result.insertId);
        }
      );
    }
  });
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
