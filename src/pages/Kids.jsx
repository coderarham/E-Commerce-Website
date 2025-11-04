import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setProducts, setLoading } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';

const Kids = () => {
  const { items, loading } = useSelector(state => state.products);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [openFilters, setOpenFilters] = useState({});
  const [selectedType, setSelectedType] = useState('');

  // Filter products for kids category
  let kidsProducts = items.filter(product => product.category === 'kids' || product.gender === 'kids');
  
  // Apply type filter if selected
  if (selectedType) {
    kidsProducts = kidsProducts.filter(product => 
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
          gender: "men",
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
          gender: "men",
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
          gender: "men",
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
          gender: "men",
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
          gender: "men",
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
          gender: "men",
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
          gender: "men",
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
          gender: "men",
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
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                        <button key={size} className="border border-main rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                  <option value="boots">Boots</option>
                  <option value="slippers">Slippers</option>
                  <option value="sports-shoes">Sports Shoes</option>
                  <option value="school-shoes">School Shoes</option>
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
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {kidsProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
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