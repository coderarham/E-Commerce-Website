import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Kids = () => {
  const { items, loading } = useSelector(state => state.products);
  const [searchParams] = useSearchParams();
  const [openFilters, setOpenFilters] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const getAllBrands = () => {
    const defaultBrands = ['PUMA', 'Nike', 'adidas', 'Bata', 'Campus', 'Paragon', 'Ajanta', 'Titas', 'Aqualite', 'Relaxo'];
    const customBrands = JSON.parse(localStorage.getItem('customBrands') || '[]');
    return [...defaultBrands, ...customBrands].sort();
  };

  useEffect(() => {
    setAvailableBrands(getAllBrands());
  }, []);

  // Filter products for kids category with all filters
  let kidsProducts = items.filter(product => {
    const isKidsProduct = product.category === 'kids' || product.gender === 'kids';
    if (!isKidsProduct) return false;

    const typeMatch = (selectedTypes.length === 0 && !selectedType) || 
      selectedTypes.includes(product.type) ||
      product.type === selectedType || 
      product.category?.toLowerCase() === selectedType.toLowerCase();
    
    const brandMatch = selectedBrands.length === 0 || 
      selectedBrands.includes(product.brand);
    
    return typeMatch && brandMatch;
  });

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kids Collection</h1>
          <p className="text-lg text-secondary">Fun and comfortable shoes for kids</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Filters</h3>
              
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
                    <input type="range" className="w-full" min="30" max="100" />
                    <div className="flex justify-between text-sm text-secondary mt-1">
                      <span>₹30</span>
                      <span>₹100</span>
                    </div>
                  </div>
                )}
              </div>

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
                      {[9, 10, 11, 12, 13, 1, 2, 3, 4, 5].map(size => (
                        <button key={size} className="border border-main rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="border-b border-main pb-4 mb-4">
                <button 
                  onClick={() => toggleFilter('brand')}
                  className="w-full flex justify-between items-center font-semibold"
                >
                  <span>Brand</span>
                  <span>{openFilters.brand ? '-' : '+'}</span>
                </button>
                {openFilters.brand && (
                  <div className="mt-2 space-y-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)}
                          onChange={() => {
                            if (selectedBrands.includes(brand)) {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            } else {
                              setSelectedBrands([...selectedBrands, brand]);
                            }
                          }}
                          className="h-4 w-4 rounded text-accent focus:ring-accent" 
                        />
                        <span className="text-main">{brand}</span>
                      </label>
                    ))}

                  </div>
                )}
              </div>

              <div className="border-b border-main pb-4 mb-4">
                <button 
                  onClick={() => toggleFilter('type')}
                  className="w-full flex justify-between items-center font-semibold"
                >
                  <span>Type</span>
                  <span>{openFilters.type ? '-' : '+'}</span>
                </button>
                {openFilters.type && (
                  <div className="mt-2 space-y-2">
                    {['School Shoes', 'Sports', 'Casual', 'Sandals', 'Sneakers', 'Canvas'].map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(type)}
                          onChange={() => {
                            if (selectedTypes.includes(type)) {
                              setSelectedTypes(selectedTypes.filter(t => t !== type));
                            } else {
                              setSelectedTypes([...selectedTypes, type]);
                            }
                          }}
                          className="h-4 w-4 rounded text-accent focus:ring-accent" 
                        />
                        <span className="text-main">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => {
                    setSelectedType('');
                    setSelectedBrands([]);
                    setSelectedTypes([]);
                  }}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {kidsProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
                {kidsProducts.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-secondary text-lg">No kids products found.</p>
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

export default Kids;