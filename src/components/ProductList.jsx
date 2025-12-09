import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from './ProductCard';
import { 
  setPriceRange, 
  toggleSize, 
  toggleFilterCategory, 
  toggleFootwearType, 
  toggleBrand, 
  clearFilters 
} from '../store/productsSlice';

const ProductList = () => {
  const { filteredItems, loading, filters: storeFilters } = useSelector(state => state.products);
  const dispatch = useDispatch();
  const [uiFilters, setUiFilters] = useState({
    price: false,
    size: false,
    categories: false,
    footwear: false,
    brand: false
  });
  const [priceRange, setPriceRangeLocal] = useState([199, 49999]);

  const toggleFilter = (filterName) => {
    setUiFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newRange = [priceRange[0], value];
    setPriceRangeLocal(newRange);
    dispatch(setPriceRange(newRange));
  };

  const handleSizeToggle = (size) => {
    dispatch(toggleSize(size));
  };

  const handleCategoryToggle = (category) => {
    dispatch(toggleFilterCategory(category));
  };

  const handleFootwearToggle = (type) => {
    dispatch(toggleFootwearType(type));
  };

  const handleBrandToggle = (brand) => {
    dispatch(toggleBrand(brand));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPriceRangeLocal([199, 49999]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-card p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-main">Filters</h3>
            
            {/* Price Filter */}
            <div className="border-b border-main pb-4 mb-4">
              <button 
                onClick={() => toggleFilter('price')}
                className="w-full flex justify-between items-center font-semibold text-main"
              >
                <span>Price</span>
                <span>{uiFilters.price ? '-' : '+'}</span>
              </button>
              {uiFilters.price && (
                <div className="mt-2">
                  <input 
                    type="range" 
                    min="199" 
                    max="49999" 
                    value={priceRange[1]} 
                    onChange={handlePriceChange}
                    className="w-full" 
                  />
                  <div className="flex justify-between text-sm text-secondary mt-1">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="border-b border-main pb-4 mb-4">
              <button 
                onClick={() => toggleFilter('size')}
                className="w-full flex justify-between items-center font-semibold text-main"
              >
                <span>Size</span>
                <span>{uiFilters.size ? '-' : '+'}</span>
              </button>
              {uiFilters.size && (
                <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                  {[6,7,8,9,10,11,12,13].map(size => (
                    <button 
                      key={size} 
                      onClick={() => handleSizeToggle(size)}
                      className={`border rounded p-2 text-main transition-colors ${
                        storeFilters.selectedSizes.includes(size) 
                          ? 'bg-accent text-white border-accent' 
                          : 'border-main hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Filter */}
            <div className="border-b border-main pb-4 mb-4">
              <button 
                onClick={() => toggleFilter('categories')}
                className="w-full flex justify-between items-center font-semibold text-main"
              >
                <span>Categories</span>
                <span>{uiFilters.categories ? '-' : '+'}</span>
              </button>
              {uiFilters.categories && (
                <div className="mt-2 space-y-2">
                  {['men', 'women', 'kids'].map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={storeFilters.selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 rounded text-accent focus:ring-accent" 
                      />
                      <span className="text-main capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="border-b border-main pb-4 mb-4">
              <button 
                onClick={() => toggleFilter('brand')}
                className="w-full flex justify-between items-center font-semibold text-main"
              >
                <span>Brand</span>
                <span>{uiFilters.brand ? '-' : '+'}</span>
              </button>
              {uiFilters.brand && (
                <div className="mt-2 space-y-2">
                  {['PUMA', 'Nike', 'adidas', 'Bata', 'Campus', 'Paragon', 'Ajanta', 'Titas',"Aqualite","Relaxo"].map(brand => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={storeFilters.selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="h-4 w-4 rounded text-accent focus:ring-accent" 
                      />
                      <span className="text-main">{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <button 
                onClick={handleClearFilters}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>
        
        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-secondary text-lg">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;