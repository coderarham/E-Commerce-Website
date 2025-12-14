import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHeart, FiPackage, FiEdit, FiSave, FiEye, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { logout } from '../store/authSlice';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    dateOfBirth: '',
    gender: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:5002/api/auth/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            const userData = data.user;
            setProfileData({
              name: userData.name || user.name || '',
              phone: userData.phone || user.phone || '',
              address: userData.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
              },
              dateOfBirth: userData.dateOfBirth || '',
              gender: userData.gender || ''
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user?.id) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5002/api/orders/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
  };

  const viewInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    const invoiceHTML = generateInvoiceHTML(order);
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const downloadInvoice = (order) => {
    const invoiceHTML = generateInvoiceHTML(order);
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order._id.slice(-8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateInvoiceHTML = (order) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order._id.slice(-8)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #333; }
          .invoice-title { font-size: 24px; color: #666; margin-top: 10px; }
          .order-info { margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
          .customer-info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f2f2f2; font-weight: bold; }
          .total-section { text-align: right; margin-top: 20px; }
          .total { font-weight: bold; font-size: 18px; color: #333; }
          .status { padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
          .status-pending { background: #fef3cd; color: #856404; }
          .status-confirmed { background: #d1edff; color: #0c5460; }
          .status-processing { background: #fff3cd; color: #856404; }
          .status-shipped { background: #cce5ff; color: #004085; }
          .status-delivered { background: #d4edda; color: #155724; }
          .status-cancelled { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">SHOE COLLECTION</div>
          <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="order-info">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p><strong>Invoice #:</strong> INV-${order._id.slice(-8)}</p>
              <p><strong>Order ID:</strong> ${order._id.slice(-8)}</p>
              <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span class="status status-${order.status}">${order.status.toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong></p>
          <p>${order.shippingAddress.email}</p>
          <p>${order.shippingAddress.phone}</p>
          <p>${order.shippingAddress.address}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
        </div>
        
        <h3>Order Items:</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <p>Subtotal: ₹${(order.subtotal || order.total).toFixed(2)}</p>
          <p>Shipping: ₹${(order.shipping || 0).toFixed(2)}</p>
          <p>Tax: ₹${(order.tax || 0).toFixed(2)}</p>
          <div class="total">
            <p>Total Amount: ₹${order.total.toFixed(2)}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p>Thank you for shopping with Shoe Collection!</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-primary text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                    <FiUser className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{profileData.name || 'User'}</h1>
                    <p className="text-gray-200">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center space-x-2"
                >
                  <FiEdit className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiUser className="inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiPackage className="inline mr-2" />
                  Orders
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    {isEditing && (
                      <button
                        onClick={handleSaveProfile}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center space-x-2"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FiUser className="text-gray-400" />
                          <span>{profileData.name || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FiMail className="text-gray-400" />
                        <span>{user?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="+91 12345 67890"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <FiPhone className="text-gray-400" />
                          <span>{profileData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <span>{profileData.dateOfBirth || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <span>{profileData.gender || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.street"
                            value={profileData.address.street}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="123 Main Street"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <FiMapPin className="text-gray-400" />
                            <span>{profileData.address.street || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.city"
                            value={profileData.address.city}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span>{profileData.address.city || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.state"
                            value={profileData.address.state}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span>{profileData.address.state || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.zipCode"
                            value={profileData.address.zipCode}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span>{profileData.address.zipCode || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.country"
                            value={profileData.address.country}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span>{profileData.address.country || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Order History</h2>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                              <p className="text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Payment Method:</span>
                              <span className="capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>Shipping Address:</span>
                              <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t">
                              <div className="text-sm text-gray-600">
                                <span>Order Status: </span>
                                <span className={`font-medium ${
                                  order.status === 'pending' ? 'text-orange-600' :
                                  order.status === 'confirmed' ? 'text-green-600' :
                                  order.status === 'processing' ? 'text-yellow-600' :
                                  order.status === 'shipped' ? 'text-blue-600' :
                                  order.status === 'delivered' ? 'text-green-600' :
                                  order.status === 'cancelled' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => viewInvoice(order)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm transition-colors"
                                >
                                  <FiEye className="w-4 h-4" />
                                  <span>View Invoice</span>
                                </button>
                                <button
                                  onClick={() => downloadInvoice(order)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm transition-colors"
                                >
                                  <FiDownload className="w-4 h-4" />
                                  <span>Download</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;