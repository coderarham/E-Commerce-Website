import React, { useState } from 'react';
import './AnimatedOrderButton.css';

const AnimatedOrderButton = ({ onComplete, loading, disabled, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = () => {
    if (isAnimating || disabled || loading) return;
    
    setIsAnimating(true);

    // Start truck animation
    setTimeout(() => {
      // Truck drives away
      const button = document.querySelector('.animated-order-button');
      button?.classList.add('driving');
    }, 1400);

    // Complete animation and show success
    setTimeout(() => {
      setShowSuccess(true);
      
      // Call completion callback after showing success
      setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 3000);
    }, 2600);
  };

  return (
    <button 
      className={`animated-order-button ${isAnimating ? 'animating' : ''} ${showSuccess ? 'success' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading || isAnimating}
    >
      <span className="default-text">
        {loading ? 'Processing...' : children}
      </span>
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
  );
};

export default AnimatedOrderButton;