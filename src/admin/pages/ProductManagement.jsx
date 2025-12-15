import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiUpload,
  FiX
} from 'react-icons/fi';
import { cloudinaryService } from '../../utils/cloudinaryService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [models, setModels] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [customBrands, setCustomBrands] = useState([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [showBrandManager, setShowBrandManager] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mrp: '',
    salePrice: '',
    discount: '',
    autoCalculateDiscount: true,
    category: '',
    type: '',
    brand: '',
    customBrand: '',
    model: '',
    collection: '',
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    variants: {
      sizes: [],
      colors: []
    }
  });

  useEffect(() => {
    fetchProducts();
    fetchModelsFromGoogleSheet();
    loadCustomBrands();
  }, []);
  
  const loadCustomBrands = () => {
    const savedBrands = localStorage.getItem('customBrands');
    if (savedBrands) {
      setCustomBrands(JSON.parse(savedBrands));
    }
  };
  
  const addNewBrand = () => {
    if (newBrandName.trim() && !getAllBrands().includes(newBrandName.trim())) {
      const updatedBrands = [...customBrands, newBrandName.trim()];
      setCustomBrands(updatedBrands);
      localStorage.setItem('customBrands', JSON.stringify(updatedBrands));
      setFormData(prev => ({ ...prev, brand: newBrandName.trim() }));
      setNewBrandName('');
      setShowAddBrand(false);
    }
  };
  
  const getAllBrands = () => {
    const defaultBrands = ['PUMA', 'Nike', 'adidas', 'Bata', 'Campus', 'Paragon', 'Ajanta', 'Titas', 'Aqualite', 'Relaxo'];
    return [...defaultBrands, ...customBrands].sort();
  };
  
  const deleteBrand = (brandToDelete) => {
    const updatedBrands = customBrands.filter(brand => brand !== brandToDelete);
    setCustomBrands(updatedBrands);
    localStorage.setItem('customBrands', JSON.stringify(updatedBrands));
    // If the deleted brand was selected, clear the selection
    if (formData.brand === brandToDelete) {
      setFormData(prev => ({ ...prev, brand: '' }));
    }
  };

  useEffect(() => {
    // Trigger refresh event for main app
    window.dispatchEvent(new CustomEvent('refreshProducts'));
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchModelsFromGoogleSheet = async () => {
    // Simulate fetching from Google Sheets API
    try {
      // In real implementation, this would be an API call to Google Sheets
      const mockModels = [
        'Ajanta Health', 'Air Force', 'Ultraboost', 'Stan Smith', 'Chuck Taylor',
        'Old Skool', 'Authentic', 'RS-X', 'Suede Classic'
      ];
      setModels(mockModels);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
        // Reset type when category changes
        ...(name === 'category' && { type: '' })
      };
      
      // Auto-calculate discount when MRP or Sale Price changes
      if ((name === 'mrp' || name === 'salePrice') && newData.autoCalculateDiscount) {
        const mrp = parseFloat(newData.mrp) || 0;
        const salePrice = parseFloat(newData.salePrice) || 0;
        if (mrp > 0 && salePrice > 0) {
          const discountPercent = Math.round(((mrp - salePrice) / mrp) * 100);
          newData.discount = discountPercent.toString();
        }
      }
      
      return newData;
    });
  };

  const getTypeOptions = (category) => {
    const typeOptions = {
      Men: ['Sandals', 'Flip-Flops', 'Slippers', 'Boots', 'Formal Shoes', 'Casual Shoes', 'Loafers', 'Sneakers', 'Sports Shoes'],
      Women: ['Running', 'Casual', 'Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals'],
      Kids: ['School Shoes', 'Sports', 'Casual', 'Sandals', 'Sneakers', 'Canvas']
    };
    return typeOptions[category] || [];
  };

  const getSizeOptions = (category) => {
    const sizeOptions = {
      Men: ['6', '7', '8', '9', '10', '11', '12'],
      Women: ['5', '6', '7', '8', '9', '10', '11'],
      Kids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
    };
    return sizeOptions[category] || [];
  };

  const handleVariantChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        [type]: value.split(',').map(item => item.trim())
      }
    }));
  };

  const handleImageUpload = (imageField, file) => {
    setFormData(prev => ({
      ...prev,
      [imageField]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const finalBrand = formData.brand === 'Others' ? formData.customBrand : formData.brand;
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.salePrice);
      formDataToSend.append('category', formData.category.toLowerCase());
      formDataToSend.append('type', formData.type);
      formDataToSend.append('brand', finalBrand);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('sizes', JSON.stringify(formData.variants.sizes));
      formDataToSend.append('colors', JSON.stringify(formData.variants.colors));
      
      // Debug log
      console.log('Colors being sent:', formData.variants.colors);
      formDataToSend.append('collection', formData.collection);
      formDataToSend.append('originalPrice', formData.mrp);
      formDataToSend.append('features', JSON.stringify(['Premium quality materials', 'Comfortable fit', 'Durable construction', 'Stylish design']));
      
      // Add images
      if (formData.image1) formDataToSend.append('image0', formData.image1);
      if (formData.image2) formDataToSend.append('image1', formData.image2);
      if (formData.image3) formDataToSend.append('image2', formData.image3);
      if (formData.image4) formDataToSend.append('image3', formData.image4);
      
      const url = editingProduct 
        ? `http://localhost:5002/api/products/${editingProduct._id}`
        : 'http://localhost:5002/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (response.ok) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        resetForm();
        fetchProducts(); // Refresh products list
        // Trigger refresh event for main app
        window.dispatchEvent(new CustomEvent('refreshProducts'));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      mrp: '',
      salePrice: '',
      discount: '',
      autoCalculateDiscount: true,
      category: '',
      type: '',
      brand: '',
      customBrand: '',
      model: '',
      collection: '',
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      variants: { sizes: [], colors: [] }
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      mrp: (product.originalPrice || product.price || '').toString(),
      salePrice: (product.price || '').toString(),
      discount: product.discount || '',
      autoCalculateDiscount: true,
      category: product.category || '',
      type: product.type || '',
      brand: product.brand || '',
      customBrand: '',
      model: product.model || '',
      collection: product.collection || '',
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      variants: {
        sizes: product.sizes || [],
        colors: product.colors || product.variants?.colors || []
      }
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5002/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert('Product deleted successfully!');
          fetchProducts(); // Refresh products list
          // Trigger refresh event for main app
          window.dispatchEvent(new CustomEvent('refreshProducts'));
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !brandFilter || product.brand === brandFilter;
    const matchesCategory = !categoryFilter || product.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Get unique brands from products
  const uniqueBrands = [...new Set(products.map(product => product.brand))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <div className="flex space-x-2">
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Brand</option>
                      {getAllBrands().map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                      <option value="Others">Others</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddBrand(true)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      title="Add New Brand"
                    >
                      <FiPlus />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBrandManager(!showBrandManager)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      title="Manage Brands"
                    >
                      <FiEdit />
                    </button>
                  </div>
                  
                  {formData.brand === 'Others' && (
                    <input
                      type="text"
                      name="customBrand"
                      value={formData.customBrand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                    />
                  )}
                  
                  {showAddBrand && (
                    <div className="mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newBrandName}
                          onChange={(e) => setNewBrandName(e.target.value)}
                          placeholder="Enter new brand name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && addNewBrand()}
                        />
                        <button
                          type="button"
                          onClick={addNewBrand}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddBrand(false);
                            setNewBrandName('');
                          }}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showBrandManager && (
                    <div className="mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <h4 className="text-sm font-medium mb-2">Manage Brands</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        <div className="text-xs text-gray-600 mb-2">Default Brands (Cannot Delete):</div>
                        {['PUMA', 'Nike', 'adidas', 'Bata', 'Campus', 'Paragon', 'Ajanta', 'Titas', 'Aqualite', 'Relaxo'].map(brand => (
                          <div key={brand} className="flex items-center py-1 px-2 bg-gray-100 rounded">
                            <span className="text-sm">{brand}</span>
                          </div>
                        ))}
                        {customBrands.length > 0 && (
                          <>
                            <div className="text-xs text-gray-600 mt-3 mb-2">Custom Brands:</div>
                            {customBrands.map(brand => (
                              <div key={brand} className="flex items-center justify-between py-1 px-2 bg-white rounded border">
                                <span className="text-sm">{brand}</span>
                                <button
                                  type="button"
                                  onClick={() => deleteBrand(brand)}
                                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                                  title="Delete brand"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowBrandManager(false)}
                        className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model (from Google Sheet)
                  </label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Model</option>
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      disabled={formData.autoCalculateDiscount}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.autoCalculateDiscount}
                        onChange={(e) => setFormData(prev => ({ ...prev, autoCalculateDiscount: e.target.checked }))}
                        className="h-4 w-4 rounded text-blue-600"
                      />
                      <span>Auto</span>
                    </label>
                  </div>
                  {formData.mrp && formData.salePrice && (
                    <p className="text-xs text-gray-500 mt-1">
                      Savings: ₹{(parseFloat(formData.mrp) - parseFloat(formData.salePrice)).toFixed(0)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">{formData.category ? 'Select Type' : 'Select Category First'}</option>
                    {getTypeOptions(formData.category).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formData.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      Available types: {getTypeOptions(formData.category).join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Type
                  </label>
                  <select
                    name="collection"
                    value={formData.collection}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Collection</option>
                    <option value="latest">Latest Collection</option>
                    <option value="bestseller">Best Selling</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Sizes
                </label>
                <div className="grid grid-cols-4 gap-2 p-3 border border-gray-300 rounded-lg">
                  {getSizeOptions(formData.category).map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.variants.sizes.includes(size)}
                        onChange={(e) => {
                          const sizes = e.target.checked 
                            ? [...formData.variants.sizes, size]
                            : formData.variants.sizes.filter(s => s !== size);
                          setFormData(prev => ({
                            ...prev,
                            variants: { ...prev.variants, sizes }
                          }));
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
                {!formData.category && (
                  <p className="text-sm text-gray-500 mt-1">Select gender category first to see size options</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colors (comma separated: Red, Blue, Black)
                </label>
                <input
                  type="text"
                  value={formData.variants.colors.join(', ')}
                  onChange={(e) => handleVariantChange('colors', e.target.value)}
                  placeholder="Red, Blue, Black"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Product Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleImageUpload('image1', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.image1 && (
                    <p className="text-sm text-green-600 mt-1">✓ {formData.image1.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Image 2 (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('image2', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.image2 && (
                    <p className="text-sm text-green-600 mt-1">✓ {formData.image2.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Image 3 (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('image3', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.image3 && (
                    <p className="text-sm text-green-600 mt-1">✓ {formData.image3.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Image 4 (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('image4', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.image4 && (
                    <p className="text-sm text-green-600 mt-1">✓ {formData.image4.name}</p>
                  )}
                </div>


              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading Images...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand/Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category/Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.brand}</div>
                    <div className="text-sm text-gray-500">{product.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{product.price}</div>
                    <div className="text-sm text-gray-500 line-through">₹{product.originalPrice || product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.category}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{product.type}</div>
                      <div className="text-xs text-blue-500 mt-1">{product.collection}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Sizes: {Array.isArray(product.sizes) ? product.sizes.join(', ') : (typeof product.sizes === 'string' ? product.sizes : 'N/A')}</div>
                    <div>Colors: {(() => {
                      // Check multiple possible color field locations
                      const colors = product.colors || product.variants?.colors || [];
                      if (Array.isArray(colors) && colors.length > 0) {
                        return colors.join(', ');
                      } else if (typeof colors === 'string' && colors.trim()) {
                        return colors;
                      }
                      return 'Not specified';
                    })()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;