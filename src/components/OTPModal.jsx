import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiShield } from 'react-icons/fi';

const OTPModal = ({ isOpen, onClose, email, onVerify, AnimatedButton, onOrderComplete, loading, otpVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');
  
  // Generate new OTP when modal opens
  useEffect(() => {
    if (isOpen) {
      generateNewOTP();
    }
  }, [isOpen]);
  
  const generateNewOTP = async () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentOTP(newOTP);
    
    try {
      // Send OTP via email
      const response = await fetch('http://localhost:5002/api/email/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: newOTP
        })
      });
      
      if (response.ok) {
        console.log('OTP sent successfully to email');
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timer]);

  useEffect(() => {
    if (otpVerified) {
      startAnimation();
    }
  }, [otpVerified]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      if (!AnimatedButton) {
        // Check against current OTP instead of hardcoded
        if (otpString === currentOTP) {
          onVerify(otpString);
        } else {
          alert('Invalid OTP. Please try again.');
        }
      }
    }
  };

  const handleAnimatedVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      // Check against current OTP instead of hardcoded
      if (otpString === currentOTP) {
        onVerify(otpString);
        startAnimation();
      } else {
        alert('Invalid OTP. Please try again.');
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
        return;
      }
    } else {
      alert('Please enter complete 6-digit OTP');
    }
  };

  const startAnimation = () => {
    const button = document.querySelector('.order-button');
    if (!button) return;
    
    button.classList.add('animating');
    
    // Box loads after 0.5s
    setTimeout(() => {
      button.classList.add('loading');
    }, 500);
    
    // Truck drives away after 1.4s
    setTimeout(() => {
      button.classList.add('driving');
    }, 1400);
    
    // Show success after truck animation
    setTimeout(() => {
      button.classList.add('success');
      button.classList.remove('animating', 'loading', 'driving');
    }, 2600);
    
    // Complete order
    setTimeout(() => {
      onOrderComplete();
    }, 4500);
  };

  const handleResend = () => {
    generateNewOTP(); // Generate new OTP
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    // Focus first input
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FiShield className="text-green-500" size={24} />
            <h2 className="text-xl font-bold">Verify OTP</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">
            We've sent a 6-digit OTP to
          </p>
          <p className="font-semibold text-lg">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              maxLength="1"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          {!canResend ? (
            <p className="text-gray-500">
              Resend OTP in <span className="font-semibold text-primary">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnimatedVerify}
            disabled={otp.join('').length !== 6}
            className="order-button"
          >
            <span className="default-text">Verify & Place Order</span>
            <span className="success-text">Order Placed!</span>
            
            <div className="truck">
              <div className="truck-body">
                <div className="truck-cargo"></div>
                <div className="truck-connector"></div>
                <div className="truck-cab">
                  <div className="truck-window"></div>
                  <div className="headlight"></div>
                </div>
                <div className="bumper"></div>
                <div className="wheel wheel-back"></div>
                <div className="wheel wheel-mid"></div>
                <div className="wheel wheel-front"></div>
              </div>
              <div className="box"></div>
              <div className="light-beam"></div>
            </div>
          </button>
        </div>
        
        <style jsx>{`
          .order-button {
            appearance: none;
            border: 0;
            background: #2b3044;
            color: #fff;
            min-width: 260px;
            height: 60px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            position: relative;
            outline: none;
            overflow: hidden;
            transition: transform 0.1s ease;
            box-shadow: 0 10px 20px rgba(43, 48, 68, 0.2);
          }
          
          .order-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .order-button::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: #2b3044;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.5s ease;
            opacity: 0.5;
          }
          
          .order-button.animating::before {
            transform: scaleX(1);
          }
          
          .default-text, .success-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s, transform 0.3s;
            white-space: nowrap;
            z-index: 10;
          }
          
          .success-text {
            opacity: 0;
            transform: translate(-50%, 20px);
            color: #ffffff;
            font-weight: bold;
          }
          
          .order-button.animating {
            background: transparent;
            box-shadow: none;
            cursor: default;
          }
          
          .order-button.animating .default-text {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          
          .order-button.success {
            background: #10b981;
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
          }
          
          .order-button.success::before {
            transform: scaleX(0);
            transition: none;
          }
          
          .order-button.success .default-text {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          
          .order-button.success .success-text {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
          
          .truck {
            position: absolute;
            width: 100px;
            height: 40px;
            bottom: 4px;
            left: calc(50% - 50px);
            transform: scale(0);
            z-index: 2;
          }
          
          .truck-body {
            position: absolute;
            height: 100%;
            width: 100%;
          }
          
          .truck-cargo {
            position: absolute;
            bottom: 8px;
            left: 0;
            width: 65px;
            height: 35px;
            background: #4f46e5;
            border-radius: 4px;
            z-index: 2;
            overflow: hidden;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
          }
          
          .truck-cargo::after {
            content: '';
            position: absolute;
            top: 0;
            left: 10px;
            width: 4px;
            height: 100%;
            background: rgba(0,0,0,0.1);
            box-shadow: 10px 0 0 rgba(0,0,0,0.1), 20px 0 0 rgba(0,0,0,0.1);
          }
          
          .truck-cab {
            position: absolute;
            bottom: 8px;
            right: 0;
            width: 32px;
            height: 28px;
            background: #e11d48;
            border-radius: 4px 8px 4px 4px;
            z-index: 1;
          }
          
          .truck-connector {
            position: absolute;
            bottom: 12px;
            left: 63px;
            width: 6px;
            height: 4px;
            background: #333;
          }
          
          .truck-window {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 14px;
            height: 10px;
            background: #93c5fd;
            border-radius: 0 4px 0 0;
          }
          
          .headlight {
            position: absolute;
            bottom: 4px;
            right: -2px;
            width: 4px;
            height: 6px;
            background: #fcd34d;
            border-radius: 2px;
            box-shadow: 0 0 5px #fcd34d;
          }
          
          .bumper {
            position: absolute;
            bottom: 0px;
            right: -2px;
            width: 36px;
            height: 4px;
            background: #cbd5e1;
            border-radius: 2px;
          }
          
          .wheel {
            position: absolute;
            bottom: 0;
            width: 14px;
            height: 14px;
            background: #1e293b;
            border-radius: 50%;
            border: 2px solid #fff;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .wheel::after {
            content: '';
            width: 4px;
            height: 4px;
            background: #94a3b8;
            border-radius: 50%;
          }
          
          .wheel-back { left: 10px; }
          .wheel-mid { left: 45px; }
          .wheel-front { right: 4px; }
          
          .order-button.animating .wheel, .order-button.driving .wheel {
            animation: spin 0.6s linear infinite;
          }
          
          .box {
            position: absolute;
            width: 20px;
            height: 20px;
            background: #fbbf24;
            border: 2px solid #d97706;
            border-radius: 2px;
            bottom: 12px;
            left: -30px;
            z-index: 1;
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #78350f;
            font-weight: bold;
          }
          
          .box::before {
            content: '';
            width: 12px;
            height: 2px;
            background: rgba(0,0,0,0.1);
            position: absolute;
          }
          
          .light-beam {
            position: absolute;
            bottom: 10px;
            right: -40px;
            width: 0;
            height: 20px;
            background: linear-gradient(to right, rgba(255, 255, 255, 0.4), transparent);
            transform-origin: left;
            opacity: 0;
          }
          
          .order-button.animating .truck {
            animation: truck-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          
          .order-button.loading .box {
            animation: box-load 0.6s ease-out forwards;
          }
          
          .order-button.driving .truck {
            animation: truck-drive 1.2s ease-in forwards;
          }
          
          .order-button.driving .light-beam {
            animation: light-flash 0.5s forwards;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes truck-enter {
            0% { transform: scale(0) translateX(-100px); opacity: 0; }
            70% { transform: scale(1) translateX(10px); opacity: 1; }
            100% { transform: scale(1) translateX(0); opacity: 1; }
          }
          
          @keyframes box-load {
            0% { opacity: 0; transform: translateX(0); }
            20% { opacity: 1; }
            100% { opacity: 1; transform: translateX(45px); }
          }
          
          @keyframes truck-drive {
            0% { transform: translateX(0); }
            20% { transform: translateX(-5px); }
            100% { transform: translateX(400px); }
          }
          
          @keyframes light-flash {
            0% { width: 0; opacity: 0; }
            50% { width: 60px; opacity: 1; }
            100% { width: 0; opacity: 0; transform: translateX(50px); }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default OTPModal;