// API Configuration
const API_BASE_URL = 'http://localhost:5002';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/api/products`,
  
  // Cart endpoints
  CART: `${API_BASE_URL}/api/cart`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
  
  // Email endpoints
  EMAIL: `${API_BASE_URL}/api/email`,
  
  // Payment endpoints
  PAYMENT: `${API_BASE_URL}/api/payment`
};

export default API_BASE_URL;