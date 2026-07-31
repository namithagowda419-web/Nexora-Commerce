# Veloura — Where Style Meets Simplicity

A complete, production-ready full-stack luxury e-commerce application built with React + Vite, Node.js + Express.js, MongoDB, Tailwind CSS, and Framer Motion. Features a Deep Plum & Cream luxury design, glassmorphism UI, 3D interactive floating effects, JWT authentication, full shopping bag and checkout workflow, printable order invoices, and an Admin Panel Dashboard with analytics.

---

## 🎨 Color Palette
- **Primary (Deep Plum)**: `#6F4A8E` / `#58386D`
- **Secondary (Soft Lavender)**: `#C8A2C8`
- **Accent (Dusty Mauve)**: `#B08BB8`
- **Background (Warm Cream)**: `#FFF9F5` (Dark Mode: `#18111D`)
- **Card Background**: `#FFFFFF` (Dark Mode: `#231A2B`)
- **Text (Charcoal)**: `#2F2A35`

---

## ⚡ Quick Start Instructions

### 1. Database Setup
Local MongoDB running at:
`mongodb://127.0.0.1:27017/veloura`

### 2. Backend API Server (`http://localhost:5000`)
```bash
cd backend
npm install
npm run dev
```
*The Express server automatically initializes database collections and seeds initial luxury product data on first launch.*

### 3. Frontend Application (`http://localhost:5173`)
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your web browser.*

---

## 🔑 Demo Credentials

### 👑 Admin Account
- **Email**: `admin@veloura.com`
- **Password**: `admin123`
- *Full access to Admin Dashboard Analytics, Product Catalogue CRUD, Order Status Management, and Category Management.*

### 👤 Standard Client Account
- **Email**: `user@veloura.com`
- **Password**: `user123`

*(You can also use the 1-Click Demo Buttons on the Sign In page for instant login!)*

---

## 🎁 Demo Promo Vouchers
- `VELOURA10` — 10% Off
- `LUXURY20` — 20% Off VIP Discount

---

## 🛠️ Tech Stack & Directory Structure
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios, Canvas Confetti.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT Authentication, bcryptjs, Multer, dotenv.

```
c:/Users/Namitha L/Desktop/Project3/
├── backend/
│   ├── config/ (db.js)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── index.css
    ├── .env
    ├── .env.example
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```
