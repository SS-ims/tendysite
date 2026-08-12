# Tendy Woodlands Services - Setup Guide

## Project Overview

This is a fully functional website for Tendy Woodlands Services with:
- ✅ Product listing system
- ✅ Customer enquiry forms (stores in database)
- ✅ Contact form (stores in database)
- ✅ Email notifications to admin and customers
- ✅ Admin dashboard to manage enquiries
- ✅ Admin authentication system

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **MySQL/MariaDB** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Gmail Account** with 2FA enabled (for email notifications)

## Installation & Setup

### 1. Database Setup

1. Open MySQL command line or MySQL Workbench
2. Import the database schema:
   ```bash
   mysql -u root -p < backend/database.sql
   ```
3. When prompted, enter your MySQL password (default in schema is `1984`)

### 2. Environment Configuration

1. In the `backend` folder, copy `.env.example` to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` with your settings:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=1984
   DB_NAME=tendy_db
   JWT_SECRET=generate-a-strong-secret-key
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-gmail-app-password
   ADMIN_EMAIL=admin@tendywoodlands.com
   SERVER_PORT=3000
   ```

### 3. Gmail Setup (for Email Notifications)

1. Go to [Gmail Security Settings](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password and paste it in `.env` as `MAIL_PASS`

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Start the Server

```bash
cd backend
npm start
```

Server will run at: `http://localhost:3000`

## Features

### Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Services | `/services` | Service offerings |
| Products | `/products` | Product catalog with enquiry forms |
| Training | `/training` | Training programs |
| Industries | `/industries` | Industry-specific solutions |
| About | `/about` | Company information |
| Contact | `/contact` | General contact form |

### Admin Features

| Feature | URL | Auth |
|---------|-----|------|
| Admin Login | `/admin/login` | Public |
| Dashboard | `/admin/dashboard` | Protected |
| Enquiries | `/admin/enquiries` | Protected |

**Default Admin Credentials:**
- Email: `admin@tendywoodlands.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials immediately in production!

### API Endpoints

#### Public Endpoints

**POST /api/contact** - Contact form submission
```json
{
  "name": "John Doe",
  "company": "ABC Ltd",
  "email": "john@example.com",
  "message": "I'd like to know more..."
}
```

**POST /api/enquiries** - Product enquiry
```json
{
  "product_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "message": "Is this available?"
}
```

**GET /api/products** - Get all products
**GET /api/categories** - Get product categories
**POST /api/admin/login** - Admin login

#### Protected Endpoints (Requires JWT Token)

**GET /api/admin/enquiries** - Get all enquiries
**PATCH /api/admin/enquiries/:id/status** - Update enquiry status
**GET /api/admin/dashboard** - Get dashboard statistics

## Database Schema

### Tables

- **admins** - Admin users
- **categories** - Product categories
- **products** - Product listing
- **product_enquiries** - Customer enquiries about products
- **contact_requests** - General contact form submissions

## File Structure

```
tendysite/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── .env.example           # Example configuration
│   ├── database.sql           # Database schema & sample data
│   ├── hash.js               # Password hashing utility
│   └── utils/
│       └── mailer.js         # Email utility
├── scripts/
│   ├── products.js           # Product page JavaScript
│   ├── admin-dashboard.js    # Admin dashboard JavaScript
│   ├── admin-enquiries.js    # Admin enquiries page JavaScript
│   └── tendycite.js          # Global utilities
├── styles/
│   └── styles.css            # Global styles
├── views/                    # EJS templates
├── assets/                   # Images and media
└── [HTML files]             # Public pages (rendered via EJS)
```

## Email Flow

### Contact Form
User submits → Saved to `contact_requests` → Email sent to admin + auto-reply to user

### Product Enquiry
User submits → Saved to `product_enquiries` → Email sent to admin + auto-reply to user

### Admin Actions
- View enquiries in dashboard
- Update status (new → contacted → closed)
- Admin can manually email customers from their email client

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Change admin email and password
- [ ] Update `ADMIN_EMAIL` to your business email
- [ ] Configure production domain/URL
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure email authentication properly
- [ ] Test contact and enquiry forms
- [ ] Monitor error logs

## Troubleshooting

### Emails not sending?
- Check `MAIL_USER` and `MAIL_PASS` in `.env`
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Gmail
- Look for error messages in server console

### Database connection failed?
- Verify MySQL is running
- Check credentials in `.env` match your MySQL setup
- Ensure `tendy_db` database exists (run `database.sql`)

### Admin login not working?
- Check JWT_SECRET is set in `.env`
- Verify admin user exists in database
- Default: admin@tendywoodlands.com / admin123

### Products not showing?
- Verify products table has data (check `database.sql` sample data)
- Check browser console for API errors
- Verify `/api/products` returns data

## Support

For issues or questions, review the server logs:
```bash
# Terminal shows server startup messages
# Check for "MySQL connected" and no errors
```

## License

© 2024 Tendy Woodlands Services - All rights reserved.
