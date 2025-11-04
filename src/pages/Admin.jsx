import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUpload, FiTrash2, FiEdit } from 'react-icons/fi';
import { addProduct, deleteProduct as removeProduct } from '../store/productsSlice';

const Admin = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'men',
    gender: 'men',
    type: 'sneakers',
    brand: 'NIKE',
    customBrand: '',
    sizes: [],
    description: '',
    image: null,
    section: 'latest'
  });

  const [productListFilter, setProductListFilter] = useState('all');

  const availableBrands = ['NIKE', 'ADIDAS', 'PUMA', 'BATA', 'CAMPUS', 'PARAGON', 'AJANTA', 'TITAS'];

  const footwearTypes = {
    men: ['sneakers', 'formal-shoes', 'casual-shoes', 'loafers', 'boots', 'sandals', 'flip-flops', 'slippers', 'sports-shoes'],
    women: ['sandals', 'flip-flops', 'flats', 'heels', 'kolhapuri-chappals', 'sneakers', 'sports-shoes'],
    kids: ['sandals', 'flip-flops', 'boots', 'slippers', 'sports-shoes', 'school-shoes']
  };

  const sizeOptions = {
    men: [6,7, 8, 9, 10, 11, 12, 13, 14],
    women: [5, 6, 7, 8, 9, 10, 11, 12],
    kids: [1, 2, 3, 4, 5, 6, 7, 8]
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductForm({...productForm, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeToggle = (size) => {
    const sizes = productForm.sizes.includes(size)
      ? productForm.sizes.filter(s => s !== size)
      : [...productForm.sizes, size];
    setProductForm({...productForm, sizes});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBrand = productForm.brand === 'Others' ? productForm.customBrand : productForm.brand;
    const newProduct = {
      ...productForm,
      id: Date.now(),
      price: parseFloat(productForm.price),
      brand: finalBrand,
      rating: 4.5,
      reviews: 0,
      category: productForm.type.charAt(0).toUpperCase() + productForm.type.slice(1),
      gender: productForm.gender,
      inStock: true
    };
    dispatch(addProduct(newProduct));
    setProductForm({
      name: '',
      price: '',
      category: 'men',
      gender: 'men',
      type: footwearTypes.men[0],
      brand: 'NIKE',
      customBrand: '',
      sizes: [],
      description: '',
      image: null,
      section: 'latest'
    });
    alert('Product added successfully!');
  };

  const deleteProduct = (id) => {
    dispatch(removeProduct(id));
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Panel</h1>
          <p className="text-lg text-secondary">Manage your shoe collection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm({...productForm, gender: e.target.value, category: e.target.value, type: footwearTypes[e.target.value][0], sizes: []})}
                    className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Type</label>
                  <select
                    value={productForm.type}
                    onChange={(e) => setProductForm({...productForm, type: e.target.value})}
                    className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {footwearTypes[productForm.category].map(type => (
                      <option key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value, customBrand: ''})}
                    className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {availableBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                    <option value="Others">Others (Custom Brand)</option>
                  </select>
                  
                  {productForm.brand === 'Others' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={productForm.customBrand}
                        onChange={(e) => setProductForm({...productForm, customBrand: e.target.value})}
                        placeholder="Enter custom brand name"
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Section */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Display Section</label>
                <select
                  value={productForm.section}
                  onChange={(e) => setProductForm({...productForm, section: e.target.value})}
                  className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="latest">Latest Collection</option>
                  <option value="trending">Trending</option>
                  <option value="bestselling">Best Selling</option>
                </select>
              </div>

              {/* Available Brands Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-secondary mb-2">Available Brands:</h4>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 bg-accent text-btn text-xs rounded">
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-secondary mt-2">
                  Select "Others" to add a custom brand not listed above.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Available Sizes</label>
                <div className="grid grid-cols-4 gap-2">
                  {sizeOptions[productForm.category].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`p-2 border rounded-lg transition-colors ${
                        productForm.sizes.includes(size)
                          ? 'bg-accent text-btn border-accent'
                          : 'border-main hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Product description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Product Image</label>
                <div className="border-2 border-dashed border-main rounded-lg p-6 text-center">
                  {productForm.image ? (
                    <div>
                      <img 
                        src={productForm.image} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover mx-auto rounded-lg mb-4"
                        onError={(e) => {
                          e.target.src = '/images/default-product.png';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setProductForm({...productForm, image: null})}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload className="w-12 h-12 mx-auto text-secondary mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-accent text-btn px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
                      >
                        Upload Image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-btn py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
              >
                Add Product
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product List ({products.filter(p => productListFilter === 'all' || p.gender === productListFilter).length} items)</h2>
              <select
                value={productListFilter}
                onChange={(e) => setProductListFilter(e.target.value)}
                className="form-input text-main bg-card w-40"
              >
                <option value="all">All Products</option>
                <option value="men">Men Only</option>
                <option value="women">Women Only</option>
                <option value="kids">Kids Only</option>
              </select>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {products.filter(product => productListFilter === 'all' || product.gender === productListFilter).map(product => (
                <div key={product.id} className="border border-main rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image || '/images/default-product.png'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/default-product.png';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-secondary text-sm">
                        ₹{product.price} • {product.brand} • {product.gender} • {product.type}
                      </p>
                      <p className="text-secondary text-xs">
                        Sizes: {product.sizes.join(', ')}
                      </p>
                      <p className="text-secondary text-xs">
                        Section: {product.section === 'latest' ? 'Latest Collection' : 
                                 product.section === 'trending' ? 'Trending' : 'Best Selling'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-100 rounded">
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;