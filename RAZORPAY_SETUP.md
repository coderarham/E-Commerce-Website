# Razorpay Integration Setup Guide

## 🚀 Razorpay Payment Gateway Integration

Aapke ecommerce project mein Razorpay payment gateway successfully integrate ho gaya hai. Yahan complete setup instructions hain:

## 📋 Prerequisites

1. **Razorpay Account**: [Razorpay Dashboard](https://dashboard.razorpay.com) par account banayein
2. **API Keys**: Test/Live mode ke liye API keys generate karein

## 🔧 Setup Steps

### 1. Razorpay Dashboard Setup

1. **Razorpay Account Create Karein**:
   - https://dashboard.razorpay.com par jaayein
   - Sign up karein ya login karein

2. **API Keys Generate Karein**:
   - Dashboard → Settings → API Keys
   - Test Mode ke liye keys generate karein
   - Key ID aur Key Secret copy karein

3. **Webhook Setup (Optional)**:
   - Settings → Webhooks
   - Endpoint URL: `http://your-domain.com/api/payment/webhook`
   - Events select karein: payment.captured, payment.failed

### 2. Environment Variables Setup

#### Backend (.env file):
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

#### Frontend (.env file):
```env
# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

### 3. Installation Complete

Packages already installed hain:
- ✅ Frontend: `razorpay` package
- ✅ Backend: `razorpay` package
- ✅ Routes configured
- ✅ Service files created

## 🎯 Features Implemented

### Payment Methods Supported:
- 💳 **Credit/Debit Cards** - Razorpay checkout
- 📱 **UPI** - Razorpay UPI integration
- 🟢 **Google Pay** - Razorpay wallet
- 🟣 **PhonePe** - Razorpay wallet
- 🔵 **Paytm** - Razorpay wallet
- 💵 **Cash on Delivery** - OTP verification

### Security Features:
- ✅ Payment signature verification
- ✅ Secure API endpoints
- ✅ Order validation
- ✅ Error handling

## 🔄 Payment Flow

1. **User selects payment method**
2. **For Online Payments**:
   - Razorpay order created on backend
   - Razorpay checkout opens
   - Payment processed
   - Signature verified
   - Order saved in database
3. **For COD**:
   - OTP verification
   - Order saved directly

## 📱 Testing

### Test Cards (Razorpay Test Mode):
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

### Test UPI:
```
UPI ID: success@razorpay
```

## 🚀 Going Live

### Production Setup:
1. **KYC Complete karein** Razorpay dashboard mein
2. **Live API Keys** generate karein
3. **Environment variables** update karein:
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_live_key
   RAZORPAY_KEY_SECRET=your_live_secret
   ```
4. **Domain whitelist** karein Razorpay dashboard mein

## 📊 Order Management

### Admin Panel Features:
- ✅ Order tracking with payment status
- ✅ Payment ID stored in orders
- ✅ Refund processing capability
- ✅ Real-time order updates

## 🛠️ API Endpoints

### Payment Routes:
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature
- `GET /api/payment/payment/:paymentId` - Get payment details
- `POST /api/payment/refund` - Process refund

## 🔍 Troubleshooting

### Common Issues:

1. **Payment fails**:
   - Check API keys in .env files
   - Verify internet connection
   - Check browser console for errors

2. **Signature verification fails**:
   - Ensure Key Secret is correct
   - Check webhook URL if using webhooks

3. **Order not created**:
   - Check backend server is running
   - Verify database connection
   - Check API endpoint URLs

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Integration Guide**: https://razorpay.com/docs/payments/payment-gateway/web-integration/
- **Support**: https://razorpay.com/support/

## 🎉 Success!

Aapka Razorpay integration complete hai! Ab aap:
- ✅ Multiple payment methods accept kar sakte hain
- ✅ Secure payments process kar sakte hain  
- ✅ Orders track kar sakte hain
- ✅ Refunds process kar sakte hain

**Happy Selling! 🛒💰**