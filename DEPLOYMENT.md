# Deployment Guide

## Local Development to Production

This guide covers deploying your Tendy Woodlands website to production.

---

## 🏠 Hosting Options

### Option 1: Heroku (Easy, Free Tier Available)
**Pros:** Simple deploy, free tier, good for small projects
**Cons:** Limited free tier, slower cold starts

1. Create Heroku account: https://heroku.com
2. Install Heroku CLI
3. In project root:
   ```bash
   heroku create your-app-name
   heroku config:set JWT_SECRET=<your-secret>
   heroku config:set MAIL_USER=<your-email>
   heroku config:set MAIL_PASS=<your-app-password>
   heroku config:set ADMIN_EMAIL=<admin-email>
   heroku addons:create jawsdb:kitefin  # MySQL database
   git push heroku main
   ```

### Option 2: AWS (Scalable, Paid)
**Pros:** Scalable, reliable, production-grade
**Cons:** More complex setup, cost

Services needed:
- EC2 for Node.js server
- RDS for MySQL database
- Route 53 for domain
- CloudFront for CDN

### Option 3: DigitalOcean (Simple, Affordable)
**Pros:** Simple UI, affordable pricing
**Cons:** Requires more manual configuration

1. Create Droplet (2GB RAM minimum)
2. Install Node.js & MySQL
3. Clone project and run server
4. Use Nginx as reverse proxy
5. Configure firewall and SSL

### Option 4: VPS (Linode, Vultr)
Similar to DigitalOcean but with different pricing/performance options.

---

## 🔐 Pre-Deployment Checklist

### Environment Variables
```bash
# .env (NEVER commit this to git)
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
DB_HOST=<production-db-host>
DB_USER=<production-db-user>
DB_PASSWORD=<strong-password>
DB_NAME=tendy_db
MAIL_USER=<your-business-email@gmail.com>
MAIL_PASS=<16-char-app-password>
ADMIN_EMAIL=<your-admin-email@company.com>
SERVER_PORT=3000
```

### Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database
- [ ] Create production database
- [ ] Run `database.sql` schema
- [ ] Change admin password using `hash.js`
- [ ] Update admin email
- [ ] Add production data/products
- [ ] Set up database backups

### Security
- [ ] Update default admin credentials
- [ ] Configure HTTPS/SSL certificate
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Add security headers
- [ ] Update CORS origin settings

---

## 📋 Step-by-Step Deployment (DigitalOcean Example)

### 1. Create Droplet
- Choose: Ubuntu 20.04+ with 2GB RAM
- Add SSH key for authentication
- Note your IP address

### 2. Connect to Server
```bash
ssh root@your_server_ip
```

### 3. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### 4. Set Up MySQL
```bash
# Secure MySQL
mysql_secure_installation

# Create database and user
mysql -u root -p << EOF
CREATE DATABASE tendy_db;
CREATE USER 'tendy_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON tendy_db.* TO 'tendy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
```

### 5. Import Database Schema
```bash
mysql -u tendy_user -p tendy_db < /path/to/database.sql
```

### 6. Deploy Application
```bash
# Clone repository (or upload files)
cd /var/www
git clone <your-repo> tendysite
cd tendysite/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables
```

### 7. Configure PM2
```bash
# Start application
pm2 start server.js --name "tendysite"

# Auto-start on reboot
pm2 startup
pm2 save
```

### 8. Configure Nginx (Reverse Proxy)
Create `/etc/nginx/sites-available/tendysite`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/tendysite /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 9. Set Up SSL/HTTPS (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 10. Set Up Firewall
```bash
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
```

---

## 🔄 Database Backups

### Automated Daily Backups
Create `/opt/backup-tendy.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/tendy_db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mysqldump -u tendy_user -p'your_password' tendy_db > $BACKUP_DIR/tendy_db_$TIMESTAMP.sql
gzip $BACKUP_DIR/tendy_db_$TIMESTAMP.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

Add to crontab:
```bash
crontab -e
# Add: 2 3 * * * /opt/backup-tendy.sh
```

---

## 📊 Monitoring & Maintenance

### Monitor Application
```bash
pm2 logs tendysite
pm2 status
pm2 monit
```

### Check Server Resources
```bash
# CPU, Memory, Disk
top
df -h
free -m
```

### View Nginx Access/Errors
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🚨 Troubleshooting Deployment

### Application won't start
```bash
pm2 logs tendysite
# Check .env file exists with correct values
# Check database connection
```

### Database connection fails
```bash
# Test connection
mysql -u tendy_user -p -h localhost tendy_db
# Check .env DB credentials match
```

### Emails not sending
- Verify Gmail App Password in `.env`
- Check Gmail 2FA is enabled
- Look for SMTP errors in logs
- Test with `test-mail.js`: `node backend/test-mail.js`

### SSL certificate issues
```bash
# Renew certificate
certbot renew
# Check renewal auto-scheduling
systemctl status certbot.timer
```

---

## 📈 Performance Optimization

### Enable Caching
```javascript
// In server.js, add:
app.use((req, res, next) => {
  res.header('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Database Connection Pool
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

### Add CDN for Static Assets
- Consider CloudFlare or AWS CloudFront
- Upload images to S3 or similar
- Update image URLs in templates

---

## 🔗 Domain Setup

1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Update nameservers to point to your hosting:
   - DigitalOcean: ns1/ns2/ns3.digitalocean.com
   - Heroku: Use automatic DNS
3. Create A record pointing to server IP
4. Create CNAME for www subdomain
5. Set up SSL certificate (Let's Encrypt)

---

## 📞 Production Email Setup

### Gmail (Free)
- App Password approach (covered in SETUP.md)
- Limit: 500 emails/day
- Good for: Small projects

### SendGrid
- Professional email service
- 100 free emails/day
- Update mailer.js to use SendGrid API

### AWS SES
- Affordable
- High email limits
- Requires domain verification

---

## 🔄 Update & Maintenance

### Update Application
```bash
cd /var/www/tendysite
git pull
npm install
pm2 restart tendysite
```

### Update Packages
```bash
npm update
npm audit
npm audit fix
```

### Monitor for Security Updates
```bash
# Check for vulnerabilities
npm audit
npm outdated
```

---

## 📝 Logging & Monitoring

### Centralized Logging (Optional)
- Loggly
- Papertrail
- ELK Stack

### Error Tracking
- Sentry.io (recommended for production)
- Rollbar
- BugSnag

---

## 🎯 Success Checklist

- [ ] Domain pointing to server
- [ ] SSL certificate active (HTTPS)
- [ ] Admin can login
- [ ] Contact forms work and send emails
- [ ] Product enquiries work and send emails
- [ ] Database backups configured
- [ ] PM2 auto-start configured
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backups tested

---

## 📞 Support & Resources

- PM2 Docs: https://pm2.keymetrics.io/docs
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- Nginx Docs: https://nginx.org/en/docs/
- MySQL Docs: https://dev.mysql.com/doc/
- Node.js Best Practices: https://nodejs.org/en/docs/guides/
