# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Clone or Open Project
```bash
cd c:\Users\sims\Documents\work_site\tendysite\backend
```

### Step 2: Create Environment File
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Edit `.env` with your settings (see SETUP.md for Gmail setup)

### Step 3: Set Up Database
```bash
# Using MySQL command line
mysql -u root -p < database.sql
```

### Step 4: Install & Run
```bash
npm install
npm start
```

Visit: http://localhost:3000

---

## 📋 Key Features

### Customer Features
- **Browse Products** → View all products with details
- **Filter Products** → Filter by category
- **Submit Enquiries** → Enquire about specific products
- **Contact Form** → Send general messages
- **Auto Emails** → Confirmation emails sent to customers

### Admin Features
- **Login** → http://localhost:3000/admin/login
  - Email: admin@tendywoodlands.com
  - Password: admin123
- **Dashboard** → View enquiry statistics
- **Manage Enquiries** → View all customer messages
- **Update Status** → Track enquiry progress

---

## 🔧 Configuration

### Customize Admin Credentials

Edit in MySQL:
```sql
UPDATE admins SET email = 'your-email@gmail.com' WHERE id = 1;
-- Password hash for 'newpassword123' (use hash.js to generate)
```

Or use the hash utility:
```bash
node backend/hash.js
# Enter password when prompted
# Copy output hash to database
```

### Customize Admin Email

Edit `.env`:
```
ADMIN_EMAIL=your-business-email@company.com
```

### Add More Products

Edit `database.sql` and add to INSERT statements, or add via MySQL:
```sql
INSERT INTO products (category_id, name, short_description, description, price, image) VALUES
  (1, 'Product Name', 'Short desc', 'Full description', 1000.00, 'image.jpg');
```

---

## 📧 Email Configuration Details

### Gmail SMTP (Recommended)
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy 16-char password to `.env` as `MAIL_PASS`

### Outlook/Office 365
```
MAIL_HOST=outlook.office365.com
MAIL_PORT=587
MAIL_USER=your-email@outlook.com
MAIL_PASS=your-password
```

### Custom SMTP
Update `backend/utils/mailer.js` with your provider's settings

---

## 🔐 Security Checklist

- [ ] Changed JWT_SECRET to a strong random value
- [ ] Changed default admin password
- [ ] Updated admin email
- [ ] Verified Gmail App Password works
- [ ] Set NODE_ENV=production in `.env`
- [ ] Use HTTPS in production
- [ ] Set strong database passwords

---

## 📱 Admin Panel Overview

### Login Page
- Email & password authentication
- JWT token-based sessions
- 2-hour session timeout

### Dashboard
- Total enquiries count
- New enquiries count
- Contacted enquiries count
- Closed enquiries count

### Enquiries List
- View all customer enquiries
- Sort by date (newest first)
- See product name, customer info
- Update status: new → contacted → closed
- Email customer directly using your email client

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "MySQL connected" doesn't appear | Check DB credentials in `.env` |
| Emails not sending | Verify Gmail App Password is correct |
| Admin login fails | Check email/password or reset using MySQL |
| Products don't show | Ensure `database.sql` was imported |
| Form submissions fail | Check browser console for API errors |

---

## 📂 File Locations

| File | Purpose |
|------|---------|
| `backend/server.js` | Main API server |
| `backend/.env` | Configuration (create from .env.example) |
| `backend/database.sql` | Database schema |
| `backend/utils/mailer.js` | Email sender |
| `scripts/products.js` | Product page logic |
| `scripts/tendycite.js` | Contact form |
| `styles/styles.css` | Styling |

---

## 🚢 Deployment

See `DEPLOYMENT.md` for:
- Hosting options
- Domain setup
- Production database migration
- Email service providers
- Scaling considerations

---

## ✉️ Support

For issues, check:
1. Server console for errors
2. Browser console (F12) for client errors
3. MySQL connection settings
4. Email credentials in `.env`
