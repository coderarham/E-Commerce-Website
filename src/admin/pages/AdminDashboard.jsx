import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiPackage, FiTrendingUp, FiDollarSign, FiEye, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'men',
    brand: '',
    sizes: ['7', '8', '9', '10', '11'],
    stock: '',
    images: [null, null, null, null],
    collection: 'latest',
    originalPrice: '',
    discount: '',
    features: ['Premium quality materials', 'Comfortable fit', 'Durable construction', 'Stylish design']
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return { ...prev, images: newImages };
    });
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('sizes', JSON.stringify(formData.sizes));
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('collection', formData.collection);
    formDataToSend.append('originalPrice', formData.originalPrice);
    formDataToSend.append('discount', formData.discount);
    formDataToSend.append('features', JSON.stringify(formData.features));
    
    // Add multiple images
    formData.images.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`image${index}`, image);
      }
    });

    try {
      const url = editingProduct 
        ? `http://localhost:5001/api/products/${editingProduct._id}`
        : 'http://localhost:5001/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product added!');
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'men',
          brand: '',
          sizes: ['7', '8', '9', '10', '11'],
          stock: '',
          images: [null, null, null, null],
          collection: 'latest',
          originalPrice: '',
          discount: '',
          features: ['Premium quality materials', 'Comfortable fit', 'Durable construction', 'Stylish design']
        });
        fetchProducts();
        window.dispatchEvent(new Event('refreshProducts'));
      } else {
        toast.error('Failed to save product');
      }
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      sizes: product.sizes,
      stock: product.stock.toString(),
      images: [null, null, null, null],
      collection: product.collection || 'latest',
      originalPrice: product.originalPrice?.toString() || '',
      discount: product.discount?.toString() || '',
      features: product.features || ['Premium quality materials', 'Comfortable fit', 'Durable construction', 'Stylish design']
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Product deleted!');
          fetchProducts();
          window.dispatchEvent(new Event('refreshProducts'));
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL products? This cannot be undone!')) {
      try {
        const response = await fetch('http://localhost:5001/api/products', {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('All products deleted!');
          fetchProducts();
          window.dispatchEvent(new Event('refreshProducts'));
        } else {
          toast.error('Failed to delete all products');
        }
      } catch (error) {
        toast.error('Error deleting all products');
      }
    }
  };

  const availableSizes = ['6', '7', '8', '9', '10', '11', '12'];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <p className="text-gray-600 mt-2">Manage your product catalog with ease</p>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAll}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <FiTrash2 />
                  <span>Delete All</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Add Product</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
              <FiPackage className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Latest Collection</p>
                <p className="text-2xl font-bold text-gray-800">{products.filter(p => p.collection === 'latest').length}</p>
              </div>
              <FiTrendingUp className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Best Sellers</p>
                <p className="text-2xl font-bold text-gray-800">{products.filter(p => p.collection === 'bestseller').length}</p>
              </div>
              <FiDollarSign className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Stock</p>
                <p className="text-2xl font-bold text-gray-800">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
              </div>
              <FiEye className="text-purple-500 text-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Collection</label>
                <select
                  name="collection"
                  value={formData.collection}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="latest">Latest Collection</option>
                  <option value="bestseller">Best Seller</option>
                  <option value="trending">Trending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price ($)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="For showing discount"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 25"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map(size => (
                    <motion.button
                      key={size}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSizeChange(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images (4 images)</label>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map(index => (
                    <div key={index} className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Image {index + 1}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        required={!editingProduct && index === 0}
                      />
                      {!editingProduct && index === 0 && (
                        <p className="text-xs text-red-500 mt-1">* Required</p>
                      )}
                      {formData.images[index] && (
                        <div className="mt-3">
                          <img
                            src={URL.createObjectURL(formData.images[index])}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Features</label>
                <textarea
                  value={formData.features.join('\n')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    features: e.target.value.split('\n').filter(f => f.trim())
                  }))}
                  rows="4"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Premium quality materials&#10;Comfortable fit&#10;Durable construction&#10;Stylish design"
                />
              </div>

              <div className="md:col-span-2 flex space-x-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  className="bg-gray-500 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FiImage className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(`/product/${product._id}`, '_blank')}
                    className="bg-white/90 backdrop-blur-sm text-green-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(product)}
                    className="bg-white/90 backdrop-blur-sm text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiEdit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(product._id)}
                    className="bg-white/90 backdrop-blur-sm text-red-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.collection === 'bestseller' ? 'bg-yellow-100 text-yellow-800' :
                    product.collection === 'trending' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {product.collection}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.sizes?.slice(0, 4).map(size => (
                    <span key={size} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                      {size}
                    </span>
                  ))}
                  {product.sizes?.length > 4 && (
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                      +{product.sizes.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
            <p className="text-gray-500">Add your first product to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;