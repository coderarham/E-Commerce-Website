# 🏠 Localhost Razorpay Testing Guide

## ✅ Ready to Test on Localhost!

### 🚀 Start Servers:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
npm start
```

### 🔑 Replace Test Keys:
1. **Get Real Test Keys** from [Razorpay Dashboard](https://dashboard.razorpay.com)
2. **Update .env files** with your actual test keys:

**Backend (.env):**
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET
```

**Frontend (.env):**
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY
```

### 💳 Test Payment Details:

**Test Cards (Always Work):**
```
✅ Success Card: 4111 1111 1111 1111
❌ Failed Card: 4000 0000 0000 0002
📅 Expiry: 12/25 (any future date)
🔒 CVV: 123 (any 3 digits)
```

**Test UPI:**
```
✅ Success: success@razorpay
❌ Failed: failure@razorpay
```

### 🌐 Localhost URLs:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5002
- **Checkout**: http://localhost:3000/checkout

### 🎯 Test Flow:
1. Add products to cart
2. Go to checkout
3. Fill shipping details
4. Select payment method (Card/UPI/Wallets)
5. Use test payment details
6. Complete payment
7. Order created successfully!

## 🔧 No Domain/SSL Required for Test Mode!

**Razorpay Test Mode Features:**
- ✅ Works on localhost
- ✅ No HTTPS required
- ✅ No domain verification
- ✅ Instant setup
- ✅ All payment methods available
- ✅ Real payment flow simulation

## 🚨 Important Notes:
- Test mode mein **real money** nahi katega
- **Test keys** sirf localhost/development ke liye
- Production mein **live keys** use karein
- Test payments **automatically succeed/fail** based on test data

**Happy Testing! 🎉**