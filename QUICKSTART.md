# 🚀 Quick Start Guide - KrishiDirect

## Prerequisites
- Node.js 16+ installed
- PostgreSQL database running
- Terminal/Command Prompt access

## Setup Instructions

### 1. Environment Configuration
Create `.env` file in `backend/` folder:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/krishidirect"
JWT_SECRET="your_secure_random_string_here"
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd web
npm install
```

### 3. Database Setup
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Server running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```
✅ App running on http://localhost:5173

## 🎮 Test the Application

### Create Test Accounts

**Farmer Account:**
1. Go to http://localhost:5173/signup
2. Name: "Rajesh Kumar"
3. Role: Farmer
4. Email: farmer@test.com
5. Password: test123

**Buyer Account:**
1. Go to http://localhost:5173/signup
2. Name: "Priya Sharma"
3. Role: Buyer
4. Email: buyer@test.com
5. Password: test123

### Test Farmer Flow
1. Login as farmer@test.com
2. Click "+ Add New Crop Listing"
3. Fill in product details:
   - Name: "Organic Tomatoes"
   - Category: Vegetables
   - Price: 45
   - Unit: kg
   - Quantity: 100
   - Location: "Nashik, Maharashtra"
   - Image: https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800
4. Submit and view in Dashboard

### Test Buyer Flow
1. Login as buyer@test.com
2. Navigate to Products page
3. Use filters to browse products
4. Click "Place Order" on any product
5. Enter quantity (e.g., 5 kg)
6. Confirm order

### Test Order Management
1. Logout buyer
2. Login as farmer@test.com
3. Go to Dashboard
4. See pending order in yellow box
5. Click "Accept Order"
6. Order status updates

## 🔍 API Testing with cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"farmer"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Create Product (requires token):**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Fresh Apples","price":80,"quantity":50,"unit":"kg","category":"Fruits"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

**Place Order (requires token):**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"items":[{"productId":"product_id_here","quantity":5,"price":80}]}'
```

**Accept Order (farmer token required):**
```bash
curl -X PATCH http://localhost:5000/api/orders/order_id_here \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FARMER_JWT_TOKEN" \
  -d '{"status":"accepted"}'
```

## 🐛 Troubleshooting

### Port Already in Use
**Backend (5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Just close the terminal or press Ctrl+C
```

### Database Connection Error
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database "krishidirect" exists:
```bash
psql -U postgres
CREATE DATABASE krishidirect;
\q
```

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

### Frontend Build Errors
```bash
cd web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📂 Project Structure
```
KrishiDirect/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database queries
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Auth & error handling
│   │   └── app.ts          # Express setup
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── web/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── hooks/          # Custom hooks
│   │   ├── api/            # Axios config
│   │   └── App.tsx         # Main app
│   └── package.json
└── FEATURES.md             # Complete feature list
```

## 🎯 Key Features Available
✅ User registration with role selection  
✅ JWT authentication  
✅ Farmer dashboard with order management  
✅ Product listing with images  
✅ Advanced marketplace filters  
✅ In-card order placement  
✅ Order status tracking  
✅ Responsive design  

## 📖 Additional Resources
- **Backend API**: http://localhost:5000/api
- **Frontend**: http://localhost:5173
- **Prisma Studio**: `npx prisma studio` (database GUI)
- **API Documentation**: See [FEATURES.md](FEATURES.md)

## 🤝 Support
For issues or questions:
1. Check browser console for errors (F12)
2. Check backend terminal for server errors
3. Verify all environment variables are set
4. Ensure database migrations are up to date

---

Happy coding! 🌾🚀
