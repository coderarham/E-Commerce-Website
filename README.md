# Shoe Collection - E-Commerce Platform

A complete e-commerce platform with separate frontend and backend applications.

## Project Structure

```
ecommerce/
├── frontend/           # React frontend application
│   ├── src/           # React components, pages, store
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
├── backend/           # Node.js backend API
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   ├── package.json   # Backend dependencies
│   └── server.js      # Express server
└── README.md          # This file
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Files
- Backend: `backend/.env` (MongoDB, email credentials)
- Frontend: `frontend/.env` (Firebase config)

## Deployment
- **Backend**: Deployed on Render (https://ecommerce-backend-afig.onrender.com)
- **Frontend**: Ready for Vercel deployment

For detailed setup instructions, see the README files in each folder.