import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingCart,
  FiCalendar
} from 'react-icons/fi';

const SalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = () => {
    // Mock analytics data based on time range
    if (timeRange === 'daily') {
      setRevenueData([
        { name: 'Mon', revenue: 12000, orders: 45 },
        { name: 'Tue', revenue: 15000, orders: 52 },
        { name: 'Wed', revenue: 18000, orders: 61 },
        { name: 'Thu', revenue: 22000, orders: 73 },
        { name: 'Fri', revenue: 28000, orders: 89 },
        { name: 'Sat', revenue: 35000, orders: 112 },
        { name: 'Sun', revenue: 31000, orders: 98 }
      ]);
    } else if (timeRange === 'weekly') {
      setRevenueData([
        { name: 'Week 1', revenue: 85000, orders: 320 },
        { name: 'Week 2', revenue: 92000, orders: 365 },
        { name: 'Week 3', revenue: 78000, orders: 298 },
        { name: 'Week 4', revenue: 105000, orders: 412 }
      ]);
    } else {
      setRevenueData([
        { name: 'Jan', revenue: 320000, orders: 1250 },
        { name: 'Feb', revenue: 285000, orders: 1100 },
        { name: 'Mar', revenue: 390000, orders: 1480 },
        { name: 'Apr', revenue: 420000, orders: 1620 },
        { name: 'May', revenue: 380000, orders: 1450 },
        { name: 'Jun', revenue: 450000, orders: 1750 }
      ]);
    }

    setOrdersData([
      { name: 'Processing', value: 23, color: '#FCD34D' },
      { name: 'Shipped', value: 45, color: '#60A5FA' },
      { name: 'Delivered', value: 156, color: '#34D399' },
      { name: 'Cancelled', value: 8, color: '#F87171' }
    ]);

    setTopProducts([
      { name: 'Nike Air Max 270', sales: 245, revenue: 735000 },
      { name: 'Adidas Ultraboost 22', sales: 198, revenue: 594000 },
      { name: 'Puma RS-X', sales: 167, revenue: 501000 },
      { name: 'Nike Air Force 1', sales: 134, revenue: 402000 },
      { name: 'Adidas Stan Smith', sales: 112, revenue: 336000 }
    ]);

    setCategoryData([
      { name: 'Running', value: 45, color: '#8B5CF6' },
      { name: 'Casual', value: 30, color: '#06B6D4' },
      { name: 'Sports', value: 15, color: '#10B981' },
      { name: 'Formal', value: 10, color: '#F59E0B' }
    ]);
  };

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'revenue' ? 'Revenue: ' : 'Orders: '}
              {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +12% from last period
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FiDollarSign className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">
                {revenueData.reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +8% from last period
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiShoppingCart className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  revenueData.reduce((sum, item) => sum + item.revenue, 0) /
                  revenueData.reduce((sum, item) => sum + item.orders, 0)
                )}
              </p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +3% from last period
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-600">3.2%</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                +0.5% from last period
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <FiTrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h4 className="text-lg font-semibold mb-4">Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h4 className="text-lg font-semibold mb-4">Orders Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h4 className="text-lg font-semibold mb-4">Order Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h4 className="text-lg font-semibold mb-4">Category Performance</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold">Top Selling Products</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sales}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesAnalytics;