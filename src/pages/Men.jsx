import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Men = () => {
  const { items, loading } = useSelector(state => state.products);
  const [searchParams] = useSearchParams();
  const [openFilters, setOpenFilters] = useState({});
  const [selectedType, setSelectedType] = useState('');

  // Filter products for men's category
  let menProducts = items.filter(product => product.category === 'men' || product.gender === 'men');
  
  // Apply type filter if selected
  if (selectedType) {
    menProducts = menProducts.filter(product => 
      product.type === selectedType || 
      product.category?.toLowerCase() === selectedType.toLowerCase()
    );
  }

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setSelectedType(type);
    }
  }, [searchParams]);

  const toggleFilter = (filterName) => {
    setOpenFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Men's Collection</h1>
          <p className="text-lg text-secondary">Discover premium footwear designed for the modern man</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Filters</h3>
              
              {/* Price Filter */}
              <div className="border-b border-main pb-4 mb-4">
                <button 
                  onClick={() => toggleFilter('price')}
                  className="w-full flex justify-between items-center font-semibold"
                >
                  <span>Price</span>
                  <span>{openFilters.price ? '-' : '+'}</span>
                </button>
                {openFilters.price && (
                  <div className="mt-2">
                    <input type="range" className="w-full" min="50" max="500" />
                    <div className="flex justify-between text-sm text-secondary mt-1">
                      <span>₹50</span>
                      <span>₹500</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-main pb-4 mb-4">
                <button 
                  onClick={() => toggleFilter('size')}
                  className="w-full flex justify-between items-center font-semibold"
                >
                  <span>Size</span>
                  <span>{openFilters.size ? '-' : '+'}</span>
                </button>
                {openFilters.size && (
                  <div className="mt-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[6, 7, 8, 9, 10, 11, 12, 13, 14].map(size => (
                        <button key={size} className="border border-main rounded p-2 text-main hover:bg-gray-200 dark:hover:bg-gray-700">
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Type Filter */}
              <div className="border-b border-main pb-4 mb-4">
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-input text-main bg-card"
                >
                  <option value="">All Types</option>
                  <option value="sandals">Sandals</option>
                  <option value="flip-flops">Flip-Flops</option>
                  <option value="slippers">Slippers</option>
                  <option value="boots">Boots</option>
                  <option value="formal-shoes">Formal Shoes</option>
                  <option value="casual-shoes">Casual Shoes</option>
                  <option value="loafers">Loafers</option>
                  <option value="sneakers">Sneakers</option>
                  <option value="sports-shoes">Sports Shoes</option>
                </select>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setSelectedType('')}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {menProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
                {menProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-secondary text-lg">No men's products found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Men;