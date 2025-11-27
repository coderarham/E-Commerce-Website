import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const HomeProductList = () => {
  const { filteredItems, loading } = useSelector(state => state.products);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Products Available</h2>
          <p className="text-gray-500">Add products through the admin panel to display them here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-16">
      {/* Product Collections */}
      <div className="space-y-16">
        {/* Latest Collection */}
        {filteredItems.filter(product => product.collection === 'latest').length > 0 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-full h-px bg-accent mx-auto mb-4"></div>
              <h2 className="text-3xl font-bold text-main">Latest Collection</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredItems.filter(product => product.collection === 'latest').slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Best Seller */}
        {filteredItems.filter(product => product.collection === 'bestseller').length > 0 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-full h-px bg-accent mx-auto mb-4"></div>
              <h2 className="text-3xl font-bold text-main">Best Seller</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredItems.filter(product => product.collection === 'bestseller').slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        {filteredItems.filter(product => product.collection === 'trending').length > 0 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-full h-px bg-accent mx-auto mb-4"></div>
              <h2 className="text-3xl font-bold text-main">Trending</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredItems.filter(product => product.collection === 'trending').slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProductList;