import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiAlertTriangle, 
  FiCheckCircle,
  FiEdit3,
  FiSave,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';

const StockAnalytics = () => {
  const [stockData, setStockData] = useState([]);
  const [editingStock, setEditingStock] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      // Try to fetch from localStorage products
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        // Convert products to stock data format
        const stockData = products.map(product => ({
          id: product.id,
          productName: product.name,
          brand: product.brand,
          variants: product.sizes?.map((size, index) => ({
            id: `${product.id}-${size}-${index}`,
            color: product.color || 'Default',
            size: size,
            stock: 0, // Default stock, can be updated by admin
            reorderLevel: 10
          })) || []
        }));
        setStockData(stockData);
      } else {
        setStockData([]);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setStockData([]);
    }
    setLoading(false);
  };

  const getStockStatus = (stock, reorderLevel) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'red', icon: FiX };
    if (stock <= reorderLevel) return { status: 'Low Stock', color: 'yellow', icon: FiAlertTriangle };
    return { status: 'In Stock', color: 'green', icon: FiCheckCircle };
  };

  const handleStockEdit = (variantId, newStock) => {
    setEditingStock(prev => ({
      ...prev,
      [variantId]: newStock
    }));
  };

  const saveStockUpdate = (productId, variantId) => {
    const newStock = parseInt(editingStock[variantId]);
    if (isNaN(newStock) || newStock < 0) return;

    setStockData(prev => prev.map(product => 
      product.id === productId 
        ? {
            ...product,
            variants: product.variants.map(variant =>
              variant.id === variantId 
                ? { ...variant, stock: newStock }
                : variant
            )
          }
        : product
    ));

    setEditingStock(prev => {
      const updated = { ...prev };
      delete updated[variantId];
      return updated;
    });
  };

  const cancelStockEdit = (variantId) => {
    setEditingStock(prev => {
      const updated = { ...prev };
      delete updated[variantId];
      return updated;
    });
  };

  // Calculate summary statistics
  const totalVariants = stockData.reduce((sum, product) => sum + product.variants.length, 0);
  const outOfStockVariants = stockData.reduce((sum, product) => 
    sum + product.variants.filter(v => v.stock === 0).length, 0
  );
  const lowStockVariants = stockData.reduce((sum, product) => 
    sum + product.variants.filter(v => v.stock > 0 && v.stock <= v.reorderLevel).length, 0
  );
  const inStockVariants = totalVariants - outOfStockVariants - lowStockVariants;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Variants</p>
              <p className="text-2xl font-bold text-gray-900">{totalVariants}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{inStockVariants}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockVariants}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockVariants}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Inventory by Variants</h3>
        <button
          onClick={fetchStockData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stock Data by Product */}
      <div className="space-y-6">
        {stockData.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500">Add products first to manage stock levels</p>
          </div>
        ) : (
          stockData.map((product, productIndex) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: productIndex * 0.1 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h4 className="text-lg font-semibold text-gray-900">{product.productName}</h4>
              <p className="text-sm text-gray-600">{product.brand}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.variants.map((variant) => {
                  const stockStatus = getStockStatus(variant.stock, variant.reorderLevel);
                  const StatusIcon = stockStatus.icon;
                  const isEditing = editingStock.hasOwnProperty(variant.id);

                  return (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-4 ${
                        stockStatus.color === 'red' ? 'border-red-200 bg-red-50' :
                        stockStatus.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {variant.color} - Size {variant.size}
                          </p>
                          <div className="flex items-center mt-1">
                            <StatusIcon className={`w-4 h-4 mr-1 text-${stockStatus.color}-600`} />
                            <span className={`text-sm text-${stockStatus.color}-600 font-medium`}>
                              {stockStatus.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Current Stock:</span>
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="0"
                                value={editingStock[variant.id] || variant.stock}
                                onChange={(e) => handleStockEdit(variant.id, e.target.value)}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => saveStockUpdate(product.id, variant.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <FiSave className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => cancelStockEdit(variant.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-lg">{variant.stock}</span>
                              <button
                                onClick={() => setEditingStock(prev => ({ ...prev, [variant.id]: variant.stock }))}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Reorder Level:</span>
                          <span className="text-sm font-medium">{variant.reorderLevel}</span>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              stockStatus.color === 'red' ? 'bg-red-500' :
                              stockStatus.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min((variant.stock / (variant.reorderLevel * 2)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default StockAnalytics;