const API_BASE_URL = 'http://localhost:5001/api';

export const cartAPI = {
  getCart: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
      if (!response.ok) throw new Error('Server not running');
      return response.json();
    } catch (error) {
      console.error('Cart API error:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  addItem: async (userId, item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item })
      });
      if (!response.ok) throw new Error('Server not running');
      return response.json();
    } catch (error) {
      console.error('Add to cart API error:', error);
      throw error;
    }
  },

  updateItem: async (userId, productId, size, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, size, quantity })
      });
      if (!response.ok) throw new Error('Server not running');
      return response.json();
    } catch (error) {
      console.error('Update cart API error:', error);
      throw error;
    }
  },

  removeItem: async (userId, productId, size) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, size })
      });
      if (!response.ok) throw new Error('Server not running');
      return response.json();
    } catch (error) {
      console.error('Remove from cart API error:', error);
      throw error;
    }
  },

  clearCart: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Server not running');
      return response.json();
    } catch (error) {
      console.error('Clear cart API error:', error);
      throw error;
    }
  }
};

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }
};