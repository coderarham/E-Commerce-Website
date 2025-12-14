import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiBarChart2, 
  FiTrendingUp,
  FiMenu,
  FiX
} from 'react-icons/fi';

// Import admin pages
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import StockAnalytics from './pages/StockAnalytics';
import SalesAnalytics from './pages/SalesAnalytics';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'products', label: 'Product Management', icon: FiPackage, color: 'green', path: '/admin/products' },
    { id: 'orders', label: 'Order Management', icon: FiShoppingCart, color: 'purple', path: '/admin/orders' },
    { id: 'users', label: 'User Management', icon: FiUsers, color: 'orange', path: '/admin/users' },
    { id: 'stock', label: 'Stock Analytics', icon: FiBarChart2, color: 'red', path: '/admin/stock' },
    { id: 'sales', label: 'Sales Analytics', icon: FiTrendingUp, color: 'indigo', path: '/admin/sales' }
  ];

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => location.pathname === item.path);
    return currentItem ? currentItem.label : 'Admin Panel';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -200 }}
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {getCurrentPageTitle()}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/stock" element={<StockAnalytics />} />
            <Route path="/sales" element={<SalesAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Main Menu Component
const MainMenu = () => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'products', label: 'Product Management', icon: FiPackage, color: 'green', description: 'Add, edit, delete products', path: '/admin/products' },
    { id: 'orders', label: 'Order Management', icon: FiShoppingCart, color: 'purple', description: 'Process and track orders', path: '/admin/orders' },
    { id: 'users', label: 'User Management', icon: FiUsers, color: 'orange', description: 'Manage users & permissions', path: '/admin/users' },
    { id: 'stock', label: 'Stock Analytics', icon: FiBarChart2, color: 'red', description: 'Monitor inventory levels', path: '/admin/stock' },
    { id: 'sales', label: 'Sales Analytics', icon: FiTrendingUp, color: 'indigo', description: 'Sales insights & reports', path: '/admin/sales' }
  ];

  const getGradientClass = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };
    return gradients[color] || gradients.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Choose a section to manage your e-commerce platform</p>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className="cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${getGradientClass(item.color)} rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="text-6xl opacity-90" />
                    <div className="text-right">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon className="text-2xl" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">{item.label}</h2>
                  <p className="text-lg opacity-90 mb-6">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-75">Click to access</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;