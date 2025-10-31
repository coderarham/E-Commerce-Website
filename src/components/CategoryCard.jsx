import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, image, count }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
    >
      <Link to={`/shop?category=${category}`}>
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={image}
            alt={category}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold mb-1">{category}</h3>
            <p className="text-sm opacity-90">{count} Products</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;