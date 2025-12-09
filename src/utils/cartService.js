const API_BASE_URL = 'http://localhost:5002/api';

export const cartService = {
  getCart: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
      return response.ok ? await response.json() : { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error getting cart:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  addItem: async (userId, product, size) => {
    try {
      const item = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        quantity: 1
      };
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item })
      });
      return response.ok ? await response.json() : { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  updateQuantity: async (userId, productId, size, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, size, quantity })
      });
      return response.ok ? await response.json() : { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  removeItem: async (userId, productId, size) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, size })
      });
      return response.ok ? await response.json() : { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  clearCart: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear/${userId}`, {
        method: 'DELETE'
      });
      return response.ok ? { items: [], totalAmount: 0 } : { items: [], totalAmount: 0 };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { items: [], totalAmount: 0 };
    }
  }
};

export const clearUserCart = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear/${userId}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};