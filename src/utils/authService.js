const API_BASE_URL = 'http://localhost:5002/api';

export const authService = {
  // Register with email and password
  register: async (email, password, name, phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const result = await response.json();
      
      // Dispatch event for admin panel to refresh
      window.dispatchEvent(new CustomEvent('userRegistered'));
      
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
};