const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

/* ================================
   CORS CONFIG (FIXED & SAFE)
================================ */
const allowedOrigins = [
  'http://localhost:3000',
  'https://e-commerce-website-9p0o.onrender.com',
  'https://e-commerce-frontend-c8jg.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

/* ================================
   MIDDLEWARES
================================ */
app.use(express.json());

/* ================================
   MONGODB CONNECTION
================================ */
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

/* ================================
   ROUTES
================================ */
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const emailRoutes = require('./routes/email');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);

/* ================================
   HEALTH CHECK ROUTES
================================ */
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 Shoe Collection Backend API',
    status: 'Running',
    time: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ message: '✅ Backend working perfectly!' });
});

/* ================================
   SERVER START
================================ */
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
