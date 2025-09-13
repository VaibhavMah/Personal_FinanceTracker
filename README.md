# Personal Finance Tracker

A full-stack MERN application to track personal finances (income, expenses, categories, reports).

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Atlas or local instance)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/VaibhavMah/Personal_FinanceTracker.git
   cd Personal_FinanceTracker
2.
   ```bash
   cd backend
   npm install

3 . 
   ```bash
   cd ../frontend
   npm install

4.
```bash
   PORT=5000
   MONGO_URI=<your MongoDB Atlas URI>
   JWT_SECRET=<your secret key>
   EMAIL
   EMAIL_PASS

5 .
 RUN
```bash
   cd backend
   npm run dev   # or npm start

   cd frontend
   npm start



📡 API Reference

All protected routes require a JWT token in headers:

Authorization: Bearer <your_token>

Auth

POST /api/auth/register → Create new user
Body: { username, email, password }


POST /api/auth/verify-otp
Body:{email, otp}

POST /api/auth/login → Login existing user
Body: { email, password }
