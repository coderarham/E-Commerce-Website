import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import HomeProductList from '../components/HomeProductList';

const Home = () => {
  
  return (
    <div>
      <Hero />
      


      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium shoes that combine style, comfort, and quality.
            </p>
          </motion.div>
        </div>
        <HomeProductList />
      </section>
    </div>
  );
};

export default Home;