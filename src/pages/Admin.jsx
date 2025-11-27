import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiPackage, FiUsers, FiBarChart2 } from 'react-icons/fi';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Panel</h1>
          <p className="text-lg text-gray-600">Manage your ecommerce store</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Management */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/admin/dashboard"
              className="block bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Management</h3>
                <p className="text-gray-600">Add, edit, and manage your products with image upload</p>
              </div>
            </Link>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md p-8 opacity-50 cursor-not-allowed">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">User Management</h3>
                <p className="text-gray-600">Manage customers and user accounts (Coming Soon)</p>
              </div>
            </div>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md p-8 opacity-50 cursor-not-allowed">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBarChart2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
                <p className="text-gray-600">View sales reports and analytics (Coming Soon)</p>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-md p-8 opacity-50 cursor-not-allowed">
              <div className="text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSettings className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Settings</h3>
                <p className="text-gray-600">Configure store settings and preferences (Coming Soon)</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/dashboard"
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-800 mb-2">Manage Products</h3>
              <p className="text-blue-600 text-sm">Add new products with Cloudinary image upload</p>
            </Link>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 opacity-50">
              <h3 className="font-semibold text-gray-800 mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm">Monitor customer orders and fulfillment</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 opacity-50">
              <h3 className="font-semibold text-gray-800 mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm">Handle customer inquiries and support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;