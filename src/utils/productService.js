import API_BASE_URL from './api';

const API_URL = `${API_BASE_URL}/api`;

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      console.log('Fetching products from:', `${API_URL}/products`);
      const response = await fetch(`${API_URL}/products`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const products = await response.json();
          console.log('Loading products from MongoDB:', products.length);
          return products;
        } else {
          console.error('API returned non-JSON response');
        }
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products from MongoDB API:', error.message);
    }
    
    // Fallback to localStorage if API fails
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
      try {
        const products = JSON.parse(adminProducts);
        if (products.length > 0) {
          console.log('Loading products from localStorage:', products.length);
          return products;
        }
      } catch (error) {
        console.error('Error parsing localStorage products:', error);
      }
    }
    
    console.log('No products found in MongoDB or localStorage');
    return [];
  }
};
