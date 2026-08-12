# Testing Guide - Verify Everything Works

## ✅ Pre-Testing Checklist

Before testing, ensure:
- [ ] MySQL is running
- [ ] `database.sql` has been imported
- [ ] `.env` file is created with correct credentials
- [ ] `npm install` has been run in backend folder
- [ ] Server started with `npm start`
- [ ] Server shows "MySQL connected" message

---

## 🧪 Test Suite

### TEST 1: Server & Database Connection
**Purpose:** Verify backend can start and connect to database

**Steps:**
1. Open terminal in `backend` folder
2. Run: `npm start`
3. Look for messages:
   ```
   MySQL connected
   Server running at http://localhost:3000
   ```

**✅ PASS** if you see both messages with no errors
**❌ FAIL** if you see MySQL connection error

**Troubleshoot:**
- Check MySQL is running: `mysql -u root -p`
- Verify DB credentials in `.env` match your setup
- Run `mysql -u root -p < database.sql` again

---

### TEST 2: API - Get Products
**Purpose:** Verify product API works

**Steps:**
1. Open browser to: http://localhost:3000/api/products
2. Should see JSON array of products:
   ```json
   [
     {
       "id": 1,
       "category_id": 1,
       "name": "HACCP System Implementation",
       "price": "5000.00",
       ...
     },
     ...
   ]
   ```

**✅ PASS** if you see 4 sample products
**❌ FAIL** if you see empty array or error

**Troubleshoot:**
- Verify `database.sql` was imported correctly
- Check data in MySQL: `SELECT * FROM products;`
- Look for server errors in terminal

---

### TEST 3: API - Get Categories
**Purpose:** Verify category API works

**Steps:**
1. Open browser to: http://localhost:3000/api/categories
2. Should see:
   ```json
   [
     {"id": 1, "name": "Consultation"},
     {"id": 2, "name": "Training"},
     {"id": 3, "name": "Audit"}
   ]
   ```

**✅ PASS** if you see 3 categories
**❌ FAIL** if empty or error

---

### TEST 4: Frontend - Products Page
**Purpose:** Verify products load on frontend

**Steps:**
1. Visit: http://localhost:3000/products
2. Wait 2-3 seconds
3. Should see:
   - Product grid with cards
   - 4 products displayed
   - Category filter dropdown with 3 options
   - Each product has name, price, and "View Details" button

**✅ PASS** if all products visible with no errors
**❌ FAIL** if products don't load or errors in console (F12)

**Troubleshoot:**
- Open browser console: F12 → Console tab
- Look for errors about `/api/products`
- Check server terminal for errors

---

### TEST 5: Product Filtering
**Purpose:** Verify category filter works

**Steps:**
1. On `/products` page
2. Select "Training" from category dropdown
3. Grid should filter to show only "Food Safety Training"
4. Select "All Categories" to show all again

**✅ PASS** if filtering works correctly
**❌ FAIL** if all products still show or errors

---

### TEST 6: Contact Form Submission
**Purpose:** Verify contact form saves to database

**Steps:**
1. Visit: http://localhost:3000/contact
2. Fill form:
   - Name: "Test User"
   - Company: "Test Company"
   - Email: "test@example.com"
   - Message: "This is a test message"
3. Click "Send Message"
4. Should see success alert
5. Check MySQL:
   ```bash
   mysql -u root -p tendy_db
   SELECT * FROM contact_requests ORDER BY id DESC LIMIT 1;
   ```

**✅ PASS** if data appears in database
**❌ FAIL** if data not saved or error message

**Troubleshoot:**
- Check server logs for errors
- Verify form fields match API requirements

---

### TEST 7: Contact Form Email (Optional)
**Purpose:** Verify emails are sent

**Setup:**
- Must have Gmail configured in `.env`
- Gmail 2FA enabled
- App Password generated

**Steps:**
1. Submit contact form (TEST 6)
2. Check your inbox for confirmation email
3. Check admin email inbox for notification

**✅ PASS** if 2 emails received (one to you, one to admin)
**❌ FAIL** if no emails received

**Troubleshoot:**
- Check spam folder
- Verify MAIL_USER & MAIL_PASS in `.env`
- Test with: `node backend/test-mail.js`
- Check server logs for SMTP errors

---

### TEST 8: Product Enquiry Form
**Purpose:** Verify product enquiry saves and sends emails

**Steps:**
1. Visit: http://localhost:3000/products
2. Click "View Details" on first product
3. In modal, click "Enquire"
4. Fill enquiry form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "555-1234"
   - Message: "I'm interested in this product"
5. Click submit
6. Should see success message
7. Check MySQL:
   ```bash
   SELECT * FROM product_enquiries ORDER BY id DESC LIMIT 1;
   ```

**✅ PASS** if data saved and emails sent
**❌ FAIL** if form doesn't submit or no database entry

---

### TEST 9: Admin Login
**Purpose:** Verify admin authentication works

**Steps:**
1. Visit: http://localhost:3000/admin/login
2. Enter credentials:
   - Email: `admin@tendywoodlands.com`
   - Password: `admin123`
3. Click "Login"
4. Should redirect to dashboard and see statistics

**✅ PASS** if login succeeds and redirects
**❌ FAIL** if login fails with error

**Troubleshoot:**
- Check admin exists in database: `SELECT * FROM admins;`
- Verify JWT_SECRET is set in `.env`
- Look for error messages

---

### TEST 10: Admin Dashboard
**Purpose:** Verify dashboard shows correct statistics

**Steps:**
1. Login as admin (TEST 9)
2. Should see dashboard with:
   - Total enquiries count
   - New enquiries count
   - Contacted enquiries count
   - Closed enquiries count

**Expected after TEST 6 & 8:**
- Total: 1 (from product enquiry)
- New: 1
- Contacted: 0
- Closed: 0

**✅ PASS** if statistics display correctly
**❌ FAIL** if dashboard blank or counts wrong

---

### TEST 11: Admin Enquiries List
**Purpose:** Verify enquiries can be viewed

**Steps:**
1. Click "Enquiries" in admin menu
2. Should see list of all product enquiries
3. Should see:
   - Product name
   - Customer name
   - Email
   - Phone
   - Status (new/contacted/closed)
   - Date received

**✅ PASS** if enquiry from TEST 8 appears in list
**❌ FAIL** if list empty or errors

---

### TEST 12: Update Enquiry Status
**Purpose:** Verify status updates work

**Steps:**
1. In enquiries list (TEST 11)
2. Click on an enquiry
3. Change status from "new" to "contacted"
4. Click update/save
5. Verify in MySQL:
   ```bash
   SELECT id, status FROM product_enquiries LIMIT 1;
   ```

**✅ PASS** if status changes in database
**❌ FAIL** if status doesn't update or error

---

### TEST 13: Admin Logout
**Purpose:** Verify session handling works

**Steps:**
1. In admin area
2. Click logout (or manually clear browser storage)
3. Try to access `/admin/dashboard`
4. Should redirect to login page

**✅ PASS** if redirected to login
**❌ FAIL** if can still access admin pages

---

## 📊 Test Results Template

Print or use this to track your testing:

```
TEST RESULTS - Tendy Woodlands Services
========================================

Date: _______________
Tester: ______________

1. Server & Database     [ ] PASS [ ] FAIL
2. API - Products       [ ] PASS [ ] FAIL
3. API - Categories     [ ] PASS [ ] FAIL
4. Frontend - Products  [ ] PASS [ ] FAIL
5. Product Filtering    [ ] PASS [ ] FAIL
6. Contact Form         [ ] PASS [ ] FAIL
7. Contact Email        [ ] PASS [ ] FAIL
8. Product Enquiry      [ ] PASS [ ] FAIL
9. Admin Login          [ ] PASS [ ] FAIL
10. Admin Dashboard     [ ] PASS [ ] FAIL
11. Admin Enquiries     [ ] PASS [ ] FAIL
12. Update Status       [ ] PASS [ ] FAIL
13. Admin Logout        [ ] PASS [ ] FAIL

Overall: ___/13 Tests Passed

Issues Found:
_________________________________
_________________________________
_________________________________
```

---

## 🔍 Debugging Tips

### Check Server Console
Always watch the terminal where `npm start` is running for errors:
```
[ERROR] MySQL connection failed
[ERROR] SMTP connection refused
[ERROR] API error details
```

### Browser Console (F12)
1. Press F12 in browser
2. Click "Console" tab
3. Look for red error messages
4. Network tab shows API calls and responses

### MySQL Check Commands
```bash
# Connect to database
mysql -u root -p

# Use database
USE tendy_db;

# Check data
SELECT * FROM products;
SELECT * FROM contact_requests;
SELECT * FROM product_enquiries;
SELECT * FROM admins;

# Check specific record
SELECT * FROM contact_requests WHERE id = 1;
```

### Test Email Sending
```bash
cd backend
node test-mail.js
# Enter test email address
# Check inbox for test email
```

### View Server Logs
```bash
# In backend folder during npm start
# All console logs appear here
```

---

## ✅ Full Test Pass Success

If all 13 tests pass, your application is fully functional:
- ✅ Frontend displays correctly
- ✅ Products and categories load
- ✅ Forms capture data
- ✅ Data persists in database
- ✅ Admin can view submissions
- ✅ Emails send (if configured)
- ✅ Authentication works

**You're ready to:**
- Customize products with real data
- Configure with real business email
- Update admin credentials
- Deploy to production

---

## 📝 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| "MySQL connection failed" | Start MySQL, check .env credentials |
| Products don't show | Run database.sql, check /api/products in browser |
| Forms don't submit | Check server console for errors, verify .env |
| Emails don't send | Verify Gmail App Password, check 2FA enabled |
| Admin login fails | Reset password with hash.js, check JWT_SECRET |
| Page showing errors | Press F12, check console for API errors |

---

## 🎯 Next Steps After Testing

1. **If all tests pass:** Proceed to SETUP.md for customization
2. **If some tests fail:** Use troubleshooting section above
3. **Ready for production:** Follow DEPLOYMENT.md
4. **Add real data:** Update products, categories, admin email

Good luck! 🚀
