import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock, FiArrowRight } from 'react-icons/fi';
import { clearCart } from '../store/cartSlice';
import AnimatedCreditCard from '../components/AnimatedCreditCard';
import OTPModal from '../components/OTPModal';
import AutocompleteInput from '../components/AutocompleteInput';
import AnimatedOrderButton from '../components/AnimatedOrderButton';
import { indianCities, indianStates } from '../data/indianCities';
import { initiateRazorpayPayment } from '../utils/razorpayService';
import API_BASE_URL from '../utils/api';

const Checkout = () => {
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone) {
      alert('Please enter phone number');
      return;
    }
    
    if (!formData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Handle different payment methods
    if (formData.paymentMethod === 'cod') {
      // For COD, show OTP modal
      setShowOTP(true);
    } else if (formData.paymentMethod === 'razorpay') {
      // For Razorpay payments
      handleRazorpayPayment();
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    
    const orderData = {
      amount: grandTotal,
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const userInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };

    try {
      await initiateRazorpayPayment(
        orderData,
        userInfo,
        handlePaymentSuccess,
        handlePaymentFailure
      );
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Create order in database after successful payment
      await handleOrderComplete(response.razorpay_payment_id);
    } catch (error) {
      console.error('Order creation failed after payment:', error);
      alert('Payment successful but order creation failed. Please contact support.');
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error}`);
    setLoading(false);
  };

  const handleOTPVerify = (otp) => {
    setLoading(true);
    
    // Simulate OTP verification - no timeout needed since validation happens in modal
    setOtpVerified(true);
    setLoading(false);
  };

  const handleOrderComplete = async (paymentId = null) => {
    try {
      // Create order in database
      const orderData = {
        userId: user.id,
        items: items,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        paymentId: paymentId, // Razorpay payment ID
        subtotal: total,
        shipping: 9.99,
        tax: total * 0.08,
        total: total + 9.99 + (total * 0.08),
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`
      };

      const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart from backend (only if user.id exists)
        if (user?.id) {
          try {
            await fetch(`${API_BASE_URL}/api/cart/clear/${user.id}`, {
              method: 'DELETE'
            });
          } catch (cartError) {
            console.log('Cart clear failed, but order was successful:', cartError);
          }
        }
        
        // Clear cart from frontend
        dispatch(clearCart());
        setShowOTP(false);
        
        // Trigger event for admin panel to refresh orders
        window.dispatchEvent(new CustomEvent('newOrderPlaced'));
        
        // Navigate immediately to order confirmation
        navigate('/order-confirmation', { 
          state: { orderSuccess: true },
          replace: true
        });
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  const subtotal = total;
  const shipping = 9.99;
  const tax = total * 0.08;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Step Indicator */}
              <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  2
                </div>
              </div>

              {currentStep === 1 ? (
                <form onSubmit={handleNext} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({...formData, phone: value});
                      }}
                      maxLength="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AutocompleteInput
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      suggestions={indianCities}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <AutocompleteInput
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      suggestions={indianStates}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({...formData, zipCode: value});
                      }}
                      maxLength="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Next</span>
                    <FiArrowRight />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FiCreditCard className="mr-2" />
                      Payment Information
                    </h2>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Select Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, paymentMethod: 'razorpay'})}
                          className={`p-4 border rounded-lg text-center hover:border-primary transition ${formData.paymentMethod === 'razorpay' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                        >
                          💳 Online Payment (Razorpay)
                          <div className="text-xs text-gray-500 mt-1">Card, UPI, Wallets</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                          className={`p-4 border rounded-lg text-center hover:border-primary transition ${formData.paymentMethod === 'cod' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                        >
                          💵 Cash on Delivery
                          <div className="text-xs text-gray-500 mt-1">Pay when delivered</div>
                        </button>
                      </div>
                    </div>

                    {/* Razorpay Payment Message */}
                    {formData.paymentMethod === 'razorpay' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                          You will be redirected to Razorpay secure payment gateway. Supports all major cards, UPI, and digital wallets.
                        </p>
                      </div>
                    )}

                    {/* COD Message */}
                    {formData.paymentMethod === 'cod' && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">
                          Pay ₹{grandTotal.toFixed(2)} in cash when your order is delivered.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <FiLock />
                      <span>
                        {loading ? 'Processing...' : 
                         formData.paymentMethod === 'cod' ? `Place Order ₹${grandTotal.toFixed(2)}` :
                         `Pay ₹${grandTotal.toFixed(2)}`
                        }
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* OTP Modal */}
        <OTPModal
          isOpen={showOTP}
          onClose={() => setShowOTP(false)}
          email={formData.email}
          onVerify={handleOTPVerify}
          AnimatedButton={AnimatedOrderButton}
          onOrderComplete={handleOrderComplete}
          loading={loading}
          otpVerified={otpVerified}
        />
      </div>
    </div>
  );
};

export default Checkout;