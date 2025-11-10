const API_BASE_URL = 'http://localhost:5001/api';

export const cartService = {
  // Get user's cart
  getCart: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
      if (!response.ok) throw new Error('Failed to get cart');
      return await response.json();
    } catch (error) {
      console.error('Error getting cart:', error);
      return { items: [], totalAmount: 0 };
    }
  },

  // Add item to cart
  addItem: async (userId, product, size) => {
    try {
      const item = {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity: 1
      };
      
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item })
      });
      
      if (!response.ok) throw new Error('Failed to add item');
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update item quantity
  updateQuantity: async (userId, productId, size, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, size, quantity })
      });
      
      if (!response.ok) throw new Error('Failed to update quantity');
      return await response.json();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (userId, productId, size) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, size })
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      return await response.json();
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to clear cart');
      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};