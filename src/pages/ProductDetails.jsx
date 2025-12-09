import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addToCart } from '../store/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.products);

  useEffect(() => {
    const foundProduct = items.find(p => p._id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id, items]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    dispatch(addToCart(user.id, product, selectedSize));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    dispatch(addToCart(user.id, product, selectedSize));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button onClick={() => navigate('/shop')} className="text-primary hover:underline">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <img
                src={product.images && product.images[selectedImage] ? product.images[selectedImage] : product.image}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            {/* Brand and Type Info */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                Brand: {product.brand}
              </span>
              <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-700">
                Type: {product.type || product.category}
              </span>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -{product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 border rounded-lg text-center ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition flex items-center justify-center space-x-2"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition"
              >
                Buy Now
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiHeart />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <FiTruck className="text-primary" size={24} />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over ₹2000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <FiShield className="text-primary" size={24} />
                <div>
                  <p className="font-semibold">Warranty</p>
                  <p className="text-sm text-gray-600">1 year warranty</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <FiRotateCcw className="text-primary" size={24} />
                <div>
                  <p className="font-semibold">Returns</p>
                  <p className="text-sm text-gray-600">30-day returns</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;