import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from './ProductCard';
import { setProducts, setLoading } from '../store/productsSlice';

const HomeProductList = () => {
  const { filteredItems, loading } = useSelector(state => state.products);
  const dispatch = useDispatch();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-16">
      {/* Product Collections */}
      <div className="space-y-16">
        {/* Latest Collection */}
        <div>
          <div className="text-center mb-8">
            <div className="w-full h-px bg-accent mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-main">Latest Collection</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.filter(product => product.section === 'latest' || !product.section).slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Best Selling */}
        <div>
          <div className="text-center mb-8">
            <div className="w-full h-px bg-accent mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-main">Best Selling</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.filter(product => product.section === 'bestselling').slice(0, 4).map(product => (
              <ProductCard key={`best-${product.id}`} product={product} />
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <div className="text-center mb-8">
            <div className="w-full h-px bg-accent mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-main">Trending</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.filter(product => product.section === 'trending').slice(0, 4).map(product => (
              <ProductCard key={`trending-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProductList;