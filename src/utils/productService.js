const API_BASE_URL = 'http://localhost:5002/api';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      // Always try to fetch from MongoDB API first
      const response = await fetch(`${API_BASE_URL}/products`);
      if (response.ok) {
        const products = await response.json();
        console.log('Loading products from MongoDB:', products.length);
        return products;
      }
    } catch (error) {
      console.error('Error fetching products from MongoDB API:', error);
    }
    
    // Fallback to localStorage if API fails
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
      const products = JSON.parse(adminProducts);
      if (products.length > 0) {
        console.log('Loading products from localStorage:', products.length);
        return products;
      }
    }
    
    console.log('No products found in MongoDB or localStorage');
    return [];
  }
};