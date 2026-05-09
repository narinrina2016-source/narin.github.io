# 🏛️ ប្រព័ន្ធគ្រប់គ្រងស្ថិតិភ្ញៀវទេសចរ
## មជ្ឈមណ្ឌលប្រល័យពូជសាសន៍ជើងឯក

---

## 📁 រចនាសម្ព័ន្ធ Folder Structure

```
choeungek-tourist-stats/
├── server.js              ← Express backend server
├── package.json           ← Node dependencies
├── database.sql           ← MySQL schema + sample data
├── .env                   ← Environment variables
├── public/                ← Built React frontend (after npm run build)
│   └── index.html
├── frontend/              ← React source code
│   ├── src/
│   │   └── App.jsx        ← Main React component (tourist-stats-app.jsx)
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ ការតំឡើង (Installation)

### ជំហាន 1: Install Node.js
```bash
# Download from https://nodejs.org (version 18+)
node --version   # should show v18+
npm --version
```

### ជំហាន 2: Install MySQL
```bash
# Windows: https://dev.mysql.com/downloads/installer/
# macOS:   brew install mysql
# Linux:   sudo apt install mysql-server
```

### ជំហាន 3: Clone / Setup Project
```bash
mkdir choeungek-tourist-stats
cd choeungek-tourist-stats
# Copy all project files here
```

### ជំហាន 4: Install Dependencies
```bash
npm install
```

### ជំហាន 5: Import Database
```bash
mysql -u root -p < database.sql
# Enter your MySQL root password when prompted
```

### ជំហាន 6: Create .env File
```bash
# Create file named .env in project root:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=choeungek_tourists
SESSION_SECRET=choeungek_secret_key_2026
PORT=3000
```

### ជំហាន 7: Setup React Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### ជំហាន 8: Start Server
```bash
npm start
# OR for development with auto-reload:
npm run dev
```

### ចូលប្រើ (Access)
```
URL:      http://localhost:3000
Username: admin
Password: admin123
```

---

## 🚀 Deployment Guide

### Option A: Railway (Free Tier)
```bash
# 1. Push code to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/choeungek-tourists
git push -u origin main

# 2. Go to https://railway.app
# 3. New Project → Deploy from GitHub
# 4. Add MySQL service (Railway provides it)
# 5. Set environment variables in Railway dashboard
# 6. Deploy!
```

### Option B: Render.com
```bash
# 1. Push to GitHub (same as above)
# 2. Go to https://render.com → New Web Service
# 3. Connect GitHub repo
# 4. Build Command: npm install
# 5. Start Command: npm start
# 6. Add environment variables
# 7. Add PostgreSQL database (or use Railway for MySQL)
```

### Option C: VPS / Local Server
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name "choeungek"
pm2 startup   # auto-start on reboot
pm2 save
```

### Option D: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t choeungek-tourists .
docker run -p 3000:3000 --env-file .env choeungek-tourists
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| POST   | /api/auth/login   | Login              |
| POST   | /api/auth/logout  | Logout             |
| GET    | /api/auth/me      | Get current user   |

### Foreign Visitors
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | /api/foreign         | List with filters   |
| POST   | /api/foreign         | Add record          |
| PUT    | /api/foreign/:id     | Update record       |
| DELETE | /api/foreign/:id     | Delete record       |

### Local Visitors
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | /api/local           | List with filters   |
| POST   | /api/local           | Add record          |
| PUT    | /api/local/:id       | Update record       |
| DELETE | /api/local/:id       | Delete record       |

### Dashboard
| Method | Endpoint                   | Description          |
|--------|----------------------------|----------------------|
| GET    | /api/dashboard/summary     | Today's stats        |
| GET    | /api/dashboard/monthly     | Monthly chart data   |
| GET    | /api/dashboard/top-countries | Top 10 countries   |
| GET    | /api/dashboard/top-provinces | Top 10 provinces   |

### Reports & Export
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /api/reports          | Combined report data  |
| GET    | /api/export/excel     | Download Excel file   |
| GET    | /api/logs             | Activity logs         |

---

## 🔐 Security Notes

- Change default admin password after first login
- Use strong SESSION_SECRET in production
- Enable HTTPS with SSL certificate in production
- Regular MySQL backups recommended:

```bash
# Auto backup script (add to cron)
mysqldump -u root -p choeungek_tourists > backup_$(date +%Y%m%d).sql
```

---

## 📞 Support

System developed for: **មជ្ឈមណ្ឌលប្រល័យពូជសាសន៍ជើងឯក**
Technology Stack: Node.js + Express + MySQL + React + Chart.js

---

*Version 1.0.0 | 2026*
