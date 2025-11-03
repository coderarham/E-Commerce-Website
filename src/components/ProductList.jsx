import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from './ProductCard';
import { 
  setProducts, 
  setLoading, 
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
  const [priceRange, setPriceRangeLocal] = useState([50, 500]);

  const { items } = useSelector(state => state.products);

  useEffect(() => {
    if (items.length === 0) {
      const mockProducts = [
        {
          id: 1,
          name: "Puma Runner",
          price: 120,
          rating: 4.5,
          reviews: 128,
          category: "Sneakers",
          brand: "PUMA",
          type: "sneakers",
          image: "/images/shoes/nike-air-max.jpg",
          sizes: [7, 8, 9, 10, 11, 12],
          inStock: true
        },
        {
          id: 2,
          name: "Campus Sneaker",
          price: 85,
          rating: 4.2,
          reviews: 95,
          category: "Casual",
          brand: "CAMPUS",
          type: "casual-shoes",
          image: "/images/casual/campus-sneaker.jpg",
          sizes: [6, 7, 8, 9, 10, 11],
          inStock: true
        },
        {
          id: 3,
          name: "Bata Formal",
          price: 150,
          rating: 4.4,
          reviews: 67,
          category: "Formal",
          image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT2xWqfA1u034Kue8aeBZlJnsHGjZ-IYV6lWi4luHDBxrec2Va1iqSmKqljgPttOA4Jmg0pDRtibUQXJcvwwEmbe7KE12JFZauWmgsHWBacUPzd43jHkTu6XA",
          sizes: [8, 9, 10, 11, 12],
          inStock: true
        },
        {
          id: 4,
          name: "Hiking Boot",
          price: 180,
          rating: 4.6,
          reviews: 89,
          category: "Sports",
          brand: "NIKE",
          type: "boots",
          image: "/images/boots/leather-boots.jpg",
          sizes: [7, 8, 9, 10, 11],
          inStock: true
        },
        {
          id: 5,
          name: "Suede Loafer",
          price: 95,
          rating: 4.3,
          reviews: 76,
          category: "Casual",
          image: "https://5.imimg.com/data5/SELLER/Default/2021/3/UM/PE/DX/117689667/20210310-120703-500x500.jpg",
          sizes: [7, 8, 9, 10, 11],
          inStock: true
        },
        {
          id: 6,
          name: "Spark Sandal",
          price: 60,
          rating: 4.1,
          reviews: 54,
          category: "Sandals",
          brand: "PARAGON",
          type: "sandals",
          image: "/images/sandals/summer-sandals.jpg",
          sizes: [6, 7, 8, 9, 10, 11],
          inStock: true
        },
        {
          id: 7,
          name: "Adidas Sneaker",
          price: 85,
          rating: 4.5,
          reviews: 112,
          category: "Sneakers",
          image: "https://rukminim2.flixcart.com/image/704/844/xif0q/shoe/v/x/j/-original-imah9mg7zhy5e43n.jpeg?q=90&crop=false",
          sizes: [7, 8, 9, 10, 11, 12],
          inStock: true
        },
        {
          id: 8,
          name: "Paragon Slippers",
          price: 35,
          rating: 4.0,
          reviews: 89,
          category: "Slippers",
          image: "https://rukminim3.flixcart.com/image/824/972/l1b1oy80/shopsy-slipper-flip-flop/3/f/w/9-tan-6230-paragon-tan-original-imagcwtary8n2my7.jpeg?q=60&crop=false",
          sizes: [6, 7, 8, 9, 10, 11],
          inStock: true
        }
      ];

      dispatch(setLoading(true));
      setTimeout(() => {
        dispatch(setProducts(mockProducts));
      }, 500);
    }
  }, [dispatch, items.length]);

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
    setPriceRangeLocal([50, 500]);
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
                    min="50" 
                    max="500" 
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
                  {[3,4,5,6,7,8,9,10,11,12].map(size => (
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
                  {['Sneakers', 'Sports', 'Casual', 'Formal', 'Sandals', 'Slippers'].map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={storeFilters.selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 rounded text-accent focus:ring-accent" 
                      />
                      <span className="text-main">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Footwear Filter */}
            <div className="border-b border-main pb-4 mb-4">
              <button 
                onClick={() => toggleFilter('footwear')}
                className="w-full flex justify-between items-center font-semibold text-main"
              >
                <span>Footwear</span>
                <span>{uiFilters.footwear ? '-' : '+'}</span>
              </button>
              {uiFilters.footwear && (
                <div className="mt-2 space-y-2">
                  {['Running Shoes', 'Loafers', 'Sneakers', 'Sandals', 'Slippers', 'Chappal'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={storeFilters.selectedFootwearTypes.includes(type)}
                        onChange={() => handleFootwearToggle(type)}
                        className="h-4 w-4 rounded text-accent focus:ring-accent" 
                      />
                      <span className="text-main">{type}</span>
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
                  {['PUMA', 'NIKE', 'ADIDAS', 'BATA', 'CAMPUS', 'PARAGON', 'AJANTA', 'TITAS'].map(brand => (
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
          {/* All Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.map(product => (
              <ProductCard key={product.id} product={product} />
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