# MongoDB Backend Setup Guide

## 1. Install MongoDB

### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

### Alternative - MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/atlas
2. Create free account and cluster
3. Get connection string and update `.env` file

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 3. Start Backend Server

```bash
cd backend
npm run dev
```

Server will run on http://localhost:5000

## 4. Start Frontend

```bash
npm start
```

Frontend will run on http://localhost:3000

## 5. Test the Setup

1. Create a new account on the website
2. Add items to cart
3. Check MongoDB database:
   - Database: `ecommerce`
   - Collections: `users`, `carts`

## 6. MongoDB Collections Structure

### Users Collection:
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Carts Collection:
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "items": [
    {
      "productId": "1",
      "name": "Nike Air Max",
      "price": 120,
      "image": "image_url",
      "size": "9",
      "quantity": 2
    }
  ],
  "totalAmount": 240,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Your cart data is now saved in MongoDB and persists across sessions!