# Cloudinary Setup Guide

## 1. Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard

## 2. Get API Credentials
1. In Dashboard, find "API Keys" section
2. Copy:
   - Cloud Name
   - API Key  
   - API Secret

## 3. Update Backend Environment
Update `backend/.env` file:
```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 4. Install Dependencies
```bash
cd backend
npm install
```

## 5. Start Services
1. Backend: `cd backend && node server.js`
2. Frontend: `npm start`

## 6. Access Admin Dashboard
- Go to: http://localhost:5000/admin/dashboard
- Add products with image upload
- Images will be stored in Cloudinary

## 7. Features
- ✅ Upload product images to Cloudinary
- ✅ Add/Edit/Delete products
- ✅ Manage product details (name, price, sizes, etc.)
- ✅ Real-time product management

Your product images will now be stored in Cloudinary cloud storage!