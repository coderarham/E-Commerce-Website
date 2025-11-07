import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategory } from '../store/productsSlice';
import ProductList from '../components/ProductList';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      dispatch(setCategory(category));
    }
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen">
      <div className="bg-accent text-btn py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop All Shoes</h1>
          <p className="text-xl opacity-90">Discover our complete collection of premium footwear</p>
        </div>
      </div>
      <ProductList />
    </div>
  );
};

export default Shop;