// Razorpay Payment Service
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (orderData) => {
  try {
    const response = await fetch('http://localhost:5002/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('http://localhost:5002/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      throw new Error('Payment verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const initiateRazorpayPayment = async (orderData, userInfo, onSuccess, onFailure) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order on backend
    const order = await createRazorpayOrder(orderData);

    const options = {
      key: 'rzp_test_RwhEanYSDl7eXY',
      amount: order.order.amount,
      currency: order.order.currency,
      name: 'Shoe Collection',
      description: 'Payment for your order',
      image: '/logo192.png',
      order_id: order.order.id,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verificationResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verificationResult.success) {
            onSuccess(response);
          } else {
            onFailure('Payment verification failed');
          }
        } catch (error) {
          onFailure(error.message);
        }
      },
      prefill: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      notes: {
        address: userInfo.address,
      },
      theme: {
        color: '#000000',
      },
      modal: {
        ondismiss: function() {
          onFailure('Payment cancelled by user');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    onFailure(error.message);
  }
};