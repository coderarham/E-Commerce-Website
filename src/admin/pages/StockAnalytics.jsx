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

  const fetchStockData = () => {
    setLoading(true);
    // Mock stock data with variants
    const mockStockData = [
      {
        id: 1,
        productName: 'Nike Air Max 270',
        brand: 'Nike',
        variants: [
          { id: '1-red-s', color: 'Red', size: 'S', stock: 15, reorderLevel: 10 },
          { id: '1-red-m', color: 'Red', size: 'M', stock: 8, reorderLevel: 10 },
          { id: '1-red-l', color: 'Red', size: 'L', stock: 3, reorderLevel: 10 },
          { id: '1-blue-s', color: 'Blue', size: 'S', stock: 20, reorderLevel: 10 },
          { id: '1-blue-m', color: 'Blue', size: 'M', stock: 12, reorderLevel: 10 },
          { id: '1-blue-l', color: 'Blue', size: 'L', stock: 0, reorderLevel: 10 },
        ]
      },
      {
        id: 2,
        productName: 'Adidas Ultraboost 22',
        brand: 'Adidas',
        variants: [
          { id: '2-white-m', color: 'White', size: 'M', stock: 25, reorderLevel: 15 },
          { id: '2-white-l', color: 'White', size: 'L', stock: 18, reorderLevel: 15 },
          { id: '2-white-xl', color: 'White', size: 'XL', stock: 5, reorderLevel: 15 },
          { id: '2-black-m', color: 'Black', size: 'M', stock: 30, reorderLevel: 15 },
          { id: '2-black-l', color: 'Black', size: 'L', stock: 22, reorderLevel: 15 },
          { id: '2-black-xl', color: 'Black', size: 'XL', stock: 8, reorderLevel: 15 },
        ]
      },
      {
        id: 3,
        productName: 'Puma RS-X',
        brand: 'Puma',
        variants: [
          { id: '3-white-s', color: 'White', size: 'S', stock: 2, reorderLevel: 8 },
          { id: '3-white-m', color: 'White', size: 'M', stock: 14, reorderLevel: 8 },
          { id: '3-white-l', color: 'White', size: 'L', stock: 10, reorderLevel: 8 },
          { id: '3-red-s', color: 'Red', size: 'S', stock: 0, reorderLevel: 8 },
          { id: '3-red-m', color: 'Red', size: 'M', stock: 6, reorderLevel: 8 },
          { id: '3-red-l', color: 'Red', size: 'L', stock: 12, reorderLevel: 8 },
        ]
      }
    ];
    
    setTimeout(() => {
      setStockData(mockStockData);
      setLoading(false);
    }, 1000);
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
        {stockData.map((product, productIndex) => (
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
        ))}
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