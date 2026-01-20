import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiEye, 
  FiUserX, 
  FiUserCheck,
  FiX,
  FiShoppingBag,
  FiCalendar,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { useSelector } from 'react-redux';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
    
    // Listen for new user registrations and order updates
    const handleNewUser = () => {
      console.log('New user registered, refreshing user list...');
      fetchUsers();
    };
    
    const handleOrderUpdate = () => {
      console.log('Order updated, refreshing user list...');
      fetchUsers();
    };
    
    window.addEventListener('userRegistered', handleNewUser);
    window.addEventListener('orderStatusUpdated', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('userRegistered', handleNewUser);
      window.removeEventListener('orderStatusUpdated', handleOrderUpdate);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users and orders
      const [usersResponse, ordersResponse] = await Promise.all([
        fetch('http://localhost:5002/api/auth/users'),
        fetch('http://localhost:5002/api/orders')
      ]);
      
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const orders = ordersResponse.ok ? await ordersResponse.json() : [];
        
        console.log('Users fetched from MongoDB:', users);
        console.log('Orders fetched:', orders);
        
        // Calculate user statistics from orders
        const userStats = {};
        orders.forEach(order => {
          const userId = order.userId?._id || order.userId;
          if (!userStats[userId]) {
            userStats[userId] = {
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: null,
              orders: []
            };
          }
          
          userStats[userId].totalOrders++;
          
          // Only add to totalSpent if order is delivered
          if (order.status === 'delivered') {
            userStats[userId].totalSpent += order.total || 0;
          }
          
          const orderDate = new Date(order.orderDate || order.createdAt);
          if (!userStats[userId].lastOrderDate || orderDate > new Date(userStats[userId].lastOrderDate)) {
            userStats[userId].lastOrderDate = orderDate.toISOString().split('T')[0];
          }
          
          userStats[userId].orders.push({
            id: order._id,
            date: orderDate.toISOString().split('T')[0],
            amount: order.total || 0,
            status: order.status || 'pending'
          });
        });
        
        // Transform users with calculated statistics
        const transformedUsers = users.map((user) => {
          const stats = userStats[user._id] || {
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: 'No orders yet',
            orders: []
          };
          
          return {
            id: user._id,
            name: user.name || 'Unknown User',
            email: user.email,
            phone: user.phone || 'Not provided',
            accountCreated: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: (user.isActive !== undefined ? user.isActive : true) ? 'active' : 'blocked',
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent,
            lastOrderDate: stats.lastOrderDate,
            orders: stats.orders
          };
        });
        
        setUsers(transformedUsers);
      } else {
        // Fallback to localStorage
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('API failed, using localStorage users:', storedUsers);
        
        const transformedUsers = storedUsers.map((user) => ({
          id: user.id || Date.now() + Math.random(),
          name: user.name || 'Unknown User',
          email: user.email,
          phone: user.phone || 'Not provided',
          accountCreated: new Date().toISOString().split('T')[0],
          status: 'active',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: 'No orders yet',
          orders: []
        }));
        
        setUsers(transformedUsers);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      // Update local state immediately
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
          : user
      ));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => ({
          ...prev,
          status: prev.status === 'active' ? 'blocked' : 'active'
        }));
      }
      
      // Update via API
      const newStatus = users.find(u => u.id === userId)?.status === 'active';
      
      try {
        const response = await fetch(`http://localhost:5002/api/auth/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !newStatus }),
        });
        
        if (response.ok) {
          console.log('User status updated via API');
        } else {
          console.log('API update failed, using local state only');
        }
      } catch (err) {
        console.log('Failed to update via API:', err.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Users
          </button>
          <div className="text-sm text-gray-600">
            Total Users: {users.length} | Filtered: {filteredUsers.length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMail className="w-4 h-4 mr-1" />
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiPhone className="w-4 h-4 mr-1" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {user.accountCreated}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">Last: {user.lastOrderDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{user.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? <FiUserCheck className="w-3 h-3 mr-1" /> : <FiUserX className="w-3 h-3 mr-1" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        {user.status === 'active' ? <FiUserX /> : <FiUserCheck />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">User Details - {selectedUser.name}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">User Information</h4>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone}</p>
                    <p><strong>Account Created:</strong> {selectedUser.accountCreated}</p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status === 'active' ? <FiUserCheck className="w-3 h-3 mr-1" /> : <FiUserX className="w-3 h-3 mr-1" />}
                        {selectedUser.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Order Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedUser.totalOrders}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹{selectedUser.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm text-gray-600">Last Order: {selectedUser.lastOrderDate}</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleUserStatus(selectedUser.id)}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${
                      selectedUser.status === 'active'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedUser.status === 'active' ? <FiUserX /> : <FiUserCheck />}
                    <span>{selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}</span>
                  </button>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <FiShoppingBag className="w-4 h-4 mr-2" />
                    Order History
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedUser.orders.map((order, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.amount}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserManagement;