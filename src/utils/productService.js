import API_BASE_URL from './api';

const API_URL = `${API_BASE_URL}/api`;

export const productService = {
  // Test backend connection
  testConnection: async () => {
    try {
      console.log('Testing backend connection to:', `${API_URL}/test`);
      const response = await fetch(`${API_URL}/test`);
      const data = await response.text();
      console.log('Backend test response:', data);
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      // Test connection first
      const isConnected = await productService.testConnection();
      if (!isConnected) {
        console.log('Backend not reachable, using fallback');
        return getDemoProducts();
      }

      // Always try to fetch from MongoDB API first
      console.log('Fetching products from:', `${API_URL}/products`);
      const response = await fetch(`${API_URL}/products`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const products = await response.json();
          console.log('Loading products from MongoDB:', products.length);
          return products;
        } else {
          console.error('API returned non-JSON response (likely HTML error page)');
          const text = await response.text();
          console.log('Response text:', text.substring(0, 200));
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
    
    // Return demo products if everything fails
    console.log('No products found, returning demo products');
    return getDemoProducts();
  }
};

// Demo products for fallback
const getDemoProducts = () => {
  return [
    {
      _id: 'demo1',
      name: 'Nike Air Max 270',
      price: 12995,
      images: ['https://via.placeholder.com/400x400?text=Nike+Air+Max'],
      category: 'Running',
      brand: 'Nike',
      description: 'Comfortable running shoes with Air Max technology'
    },
    {
      _id: 'demo2', 
      name: 'Adidas Ultraboost 22',
      price: 15999,
      images: ['https://via.placeholder.com/400x400?text=Adidas+Ultraboost'],
      category: 'Running',
      brand: 'Adidas',
      description: 'Premium running shoes with Boost cushioning'
    },
    {
      _id: 'demo3',
      name: 'Puma RS-X',
      price: 8999,
      images: ['https://via.placeholder.com/400x400?text=Puma+RS-X'],
      category: 'Casual',
      brand: 'Puma', 
      description: 'Retro-inspired lifestyle sneakers'
    }
  ];
};