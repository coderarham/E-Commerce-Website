import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiTruck } from 'react-icons/fi';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Redirect if not coming from successful order
    if (!location.state?.orderSuccess) {
      navigate('/shop');
      return;
    }
    
    // Stop confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleViewOrders = () => {
    navigate('/profile');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="animate-pulse text-6xl text-center pt-20">
            🎉
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, type: "spring" }}
            className="mb-6"
          >
            <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully! 🎉
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FiPackage className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Your order is being prepared</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiTruck className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">We'll send you tracking details via email</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleViewOrders}
              className="flex-1 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition font-semibold"
            >
              View My Orders
            </button>
            <button
              onClick={handleContinueShopping}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;