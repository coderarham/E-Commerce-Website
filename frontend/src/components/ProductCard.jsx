import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addToCart } from '../store/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  // Calculate discount percentage
  const calculateDiscount = () => {

    
    // Check direct discount first
    if (product.discount && !isNaN(parseFloat(product.discount))) {
      const discount = parseFloat(product.discount);
      if (discount > 0) return Math.round(discount);
    }
    
    // Try MRP and Sale Price from admin
    const mrp = parseFloat(product.mrp) || 0;
    const salePrice = parseFloat(product.salePrice) || 0;
    
    if (mrp > 0 && salePrice > 0 && mrp > salePrice) {
      const discount = ((mrp - salePrice) / mrp) * 100;
      if (!isNaN(discount) && discount > 0) {
        return Math.round(discount);
      }
    }
    
    // Fallback to original calculation
    const originalPrice = parseFloat(product.originalPrice) || 0;
    const currentPrice = parseFloat(product.price) || 0;
    
    if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
      const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
      if (!isNaN(discount) && discount > 0) {
        return Math.round(discount);
      }
    }
    
    return 0;
  };
  
  const discountPercent = calculateDiscount();
  console.log('Discount percent:', discountPercent, typeof discountPercent);

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    // Use first available size or default to '9'
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '9';
    dispatch(addToCart(user.id, product, defaultSize));
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden group">
      <Link to={`/product/${product._id || product.id}`}>
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={product.image || '/images/default-product.png'}
            alt={product.name}
            className="w-full h-64 object-contain transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/images/default-product.png';
            }}
          />
          {typeof discountPercent === 'number' && discountPercent > 0 && !isNaN(discountPercent) && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              -{discountPercent}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-main group-hover:text-accent transition">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-secondary ml-2">({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-accent">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-secondary line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-accent text-white px-3 py-1 rounded-lg hover:bg-accent-hover transition-colors flex items-center space-x-1"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;