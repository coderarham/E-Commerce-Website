const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://e-commerce-website-9p0o.onrender.com'
  : 'http://localhost:5002';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,

  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: `${API_BASE_URL}/api/cart`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  EMAIL: `${API_BASE_URL}/api/email`,
  PAYMENT: `${API_BASE_URL}/api/payment`
};

export default API_BASE_URL;
