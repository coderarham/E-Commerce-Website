import { createSlice } from '@reduxjs/toolkit';
import { productService } from '../utils/productService';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filteredItems: [],
    categories: ['All', 'men', 'women', 'kids'],
    loading: false,
    searchTerm: '',
    selectedCategory: 'All',
    sortBy: 'name',
    filters: {
      priceRange: [0, 500],
      selectedSizes: [],
      selectedCategories: [],
      selectedFootwearTypes: [],
      selectedBrands: []
    }
  },
  reducers: {
    setProducts: (state, action) => {
      // Normalize products to ensure all required fields exist
      const normalizedProducts = action.payload.map(product => ({
        ...product,
        price: product.price || product.salePrice,
        image: product.image || product.image1 || product.images?.[0],
        _id: product._id || product.id,
        category: product.category?.toLowerCase() || 'all',
        sizes: product.sizes || [],
        collection: product.collection || 'general'
      }));
      state.items = normalizedProducts;
      state.filteredItems = normalizedProducts;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredItems = state.items.filter(product => {
        const searchMatch = product.name.toLowerCase().includes(action.payload.toLowerCase());
        const categoryMatch = state.selectedCategory === 'All' || 
          product.category === state.selectedCategory.toLowerCase() ||
          product.category === state.selectedCategory;
        return searchMatch && categoryMatch;
      });
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredItems = state.items.filter(product => {
        const categoryMatch = action.payload === 'All' || 
          product.category === action.payload.toLowerCase() ||
          product.category === action.payload;
        const searchMatch = product.name.toLowerCase().includes(state.searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
      });
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.filteredItems.sort((a, b) => {
        if (action.payload === 'price-low') return a.price - b.price;
        if (action.payload === 'price-high') return b.price - a.price;
        if (action.payload === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
    },

    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
      applyFilters(state);
    },
    toggleSize: (state, action) => {
      const size = action.payload;
      if (state.filters.selectedSizes.includes(size)) {
        state.filters.selectedSizes = state.filters.selectedSizes.filter(s => s !== size);
      } else {
        state.filters.selectedSizes.push(size);
      }
      applyFilters(state);
    },
    toggleFilterCategory: (state, action) => {
      const category = action.payload;
      if (state.filters.selectedCategories.includes(category)) {
        state.filters.selectedCategories = state.filters.selectedCategories.filter(c => c !== category);
      } else {
        state.filters.selectedCategories.push(category);
      }
      applyFilters(state);
    },
    toggleFootwearType: (state, action) => {
      const type = action.payload;
      if (state.filters.selectedFootwearTypes.includes(type)) {
        state.filters.selectedFootwearTypes = state.filters.selectedFootwearTypes.filter(t => t !== type);
      } else {
        state.filters.selectedFootwearTypes.push(type);
      }
      applyFilters(state);
    },
    toggleBrand: (state, action) => {
      const brand = action.payload;
      if (state.filters.selectedBrands.includes(brand)) {
        state.filters.selectedBrands = state.filters.selectedBrands.filter(b => b !== brand);
      } else {
        state.filters.selectedBrands.push(brand);
      }
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = {
        priceRange: [0, 500],
        selectedSizes: [],
        selectedCategories: [],
        selectedFootwearTypes: [],
        selectedBrands: []
      };
      applyFilters(state);
    }
  },
});

// Helper function to apply all filters
const applyFilters = (state) => {
  state.filteredItems = state.items.filter(product => {
    // Price filter
    const priceMatch = product.price >= state.filters.priceRange[0] && product.price <= state.filters.priceRange[1];
    
    // Size filter
    const sizeMatch = state.filters.selectedSizes.length === 0 || 
      state.filters.selectedSizes.some(size => product.sizes?.includes(size));
    
    // Category filter
    const categoryMatch = state.filters.selectedCategories.length === 0 || 
      state.filters.selectedCategories.includes(product.category);
    
    // Footwear type filter
    const typeMatch = state.filters.selectedFootwearTypes.length === 0 || 
      state.filters.selectedFootwearTypes.some(type => 
        product.type?.includes(type.toLowerCase().replace(/[\s-]/g, '-')) ||
        product.category?.toLowerCase().includes(type.toLowerCase())
      );
    
    // Brand filter
    const brandMatch = state.filters.selectedBrands.length === 0 || 
      state.filters.selectedBrands.includes(product.brand);
    
    // Search term filter
    const searchMatch = product.name.toLowerCase().includes(state.searchTerm.toLowerCase());
    
    // Selected category filter (from main category selector)
    const mainCategoryMatch = state.selectedCategory === 'All' || 
      product.category === state.selectedCategory.toLowerCase() ||
      product.category === state.selectedCategory;
    
    return priceMatch && sizeMatch && categoryMatch && typeMatch && brandMatch && searchMatch && mainCategoryMatch;
  });
};

// Async action to load products from MongoDB
export const loadProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const products = await productService.getAllProducts();
    dispatch(setProducts(products));
  } catch (error) {
    console.error('Failed to load products:', error);
    dispatch(setLoading(false));
  }
};

export const { 
  setProducts, 
  setLoading, 
  setSearchTerm, 
  setCategory, 
  setSortBy,
  setPriceRange,
  toggleSize,
  toggleFilterCategory,
  toggleFootwearType,
  toggleBrand,
  clearFilters
} = productsSlice.actions;
export default productsSlice.reducer;