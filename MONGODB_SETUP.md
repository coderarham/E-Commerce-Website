# 🗄️ MongoDB Quick Setup Guide

## Option 1: MongoDB Atlas (Cloud - Easiest)

### Steps:
1. **Go to**: https://mongodb.com/atlas
2. **Sign up** for free account
3. **Create cluster** (free tier)
4. **Create database user**
5. **Whitelist IP**: 0.0.0.0/0 (for development)
6. **Get connection string**

### Update .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

## Option 2: Local MongoDB

### Windows Installation:
```bash
# Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Or use MongoDB Compass (GUI)
# https://www.mongodb.com/try/download/compass
```

### Connection String (Already Set):
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

## 🚀 Test Connection:
```bash
cd backend
npm start
# Should show: "Connected to MongoDB Atlas!"
```

## 🔧 If Still Issues:
Use this temporary in-memory setup for testing:

```javascript
// In server.js - temporary fix
const mongoose = require('mongoose');

// Comment out the MongoDB connection for now
// mongoose.connect(process.env.MONGODB_URI)

console.log('Running without database for testing');
```

**Recommendation: Use MongoDB Atlas for easiest setup!** 🎯