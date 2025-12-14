import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiPackage, 
  FiAlertTriangle,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    activeOrders: 0,
    lowStockAlerts: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Simulate fetching dashboard data
    setStats({
      totalSales: 1247,
      totalRevenue: 89650,
      activeOrders: 23,
      lowStockAlerts: 8,
      totalProducts: 156,
      totalUsers: 892
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <FiTrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 299, status: 'Processing' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 199, status: 'Shipped' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: 399, status: 'Delivered' },
    { id: '#ORD-004', customer: 'Sarah Wilson', amount: 149, status: 'Processing' },
  ];

  const lowStockProducts = [
    { name: 'Nike Air Max', stock: 3, variant: 'Red - Size M' },
    { name: 'Adidas Ultraboost', stock: 1, variant: 'Black - Size L' },
    { name: 'Puma RS-X', stock: 2, variant: 'White - Size S' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales.toLocaleString()}
          icon={FiShoppingCart}
          color="blue"
          trend="+12% from last month"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={FiDollarSign}
          color="green"
          trend="+8% from last month"
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={FiPackage}
          color="purple"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          icon={FiAlertTriangle}
          color="red"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FiPackage}
          color="indigo"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="orange"
        />
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.amount}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.variant}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;