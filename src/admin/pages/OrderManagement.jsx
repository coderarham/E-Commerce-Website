import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiPrinter, 
  FiSearch, 
  FiFilter,
  FiX,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Listen for new orders
    const handleNewOrder = () => {
      console.log('🔔 New order event received! Refreshing...');
      fetchOrders();
    };
    
    window.addEventListener('newOrderPlaced', handleNewOrder);
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto refreshing orders...');
      fetchOrders();
    }, 30000);
    
    return () => {
      window.removeEventListener('newOrderPlaced', handleNewOrder);
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let orders = [];
      
      // Try to fetch from MongoDB API first
      try {
        const response = await fetch('http://localhost:5002/api/orders');
        if (response.ok) {
          const apiOrders = await response.json();
          console.log('Orders fetched from MongoDB:', apiOrders);
          orders = apiOrders;
        } else {
          console.log('API failed, trying localStorage...');
        }
      } catch (apiError) {
        console.log('API error, using localStorage:', apiError.message);
      }
      
      // Fallback to localStorage if API fails
      if (orders.length === 0) {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          orders = JSON.parse(savedOrders);
          console.log('Orders fetched from localStorage:', orders);
        }
      }
      
      // Transform orders to consistent format
      const transformedOrders = orders.map(order => ({
        id: order.id || order._id,
        customerName: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Unknown',
        customerEmail: order.shippingAddress?.email || 'No email',
        customerPhone: order.shippingAddress?.phone || 'No phone',
        date: new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString(),
        amount: order.total || 0,
        status: order.status || 'pending',
        items: (order.items || []).map(item => ({
          name: item.name || 'Product',
          quantity: item.quantity || 1,
          price: item.price || item.salePrice || 0,
          variant: `Size: ${item.size || 'N/A'}`,
          image: item.image || item.image1
        })),
        shippingAddress: {
          street: order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.state || '',
          pincode: order.shippingAddress?.zipCode || order.shippingAddress?.pincode || '',
          country: 'India'
        },
        paymentInfo: {
          method: order.paymentMethod || 'Unknown',
          transactionId: order.id?.slice(-8) || 'N/A',
          status: 'Paid'
        }
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Update state immediately for better UX
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      // Try to update via API
      try {
        const response = await fetch(`http://localhost:5002/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
          console.log('✅ Order status updated via API:', orderId, newStatus);
        } else {
          console.log('API update failed, updating localStorage...');
        }
      } catch (apiError) {
        console.log('API error, updating localStorage:', apiError.message);
      }
      
      // Update localStorage as fallback
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const updatedOrders = orders.map(order => 
          (order.id === orderId || order._id === orderId) ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
      }
      
    } catch (error) {
      console.error('❌ Error updating order status:', error);
    }
  };

  const generateInvoice = (order) => {
    // Create a printable invoice
    const invoiceWindow = window.open('', '_blank');
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .order-info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SHOE COLLECTION</h1>
          <h2>Invoice</h2>
        </div>
        
        <div class="order-info">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
        </div>
        
        <h3>Shipping Address:</h3>
        <p>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
          ${order.shippingAddress.pincode}, ${order.shippingAddress.country}
        </p>
        
        <h3>Order Items:</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.variant}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.quantity * item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <p>Total Amount: ₹${order.amount}</p>
        </div>
        
        <h3>Payment Information:</h3>
        <p><strong>Method:</strong> ${order.paymentInfo.method}</p>
        <p><strong>Transaction ID:</strong> ${order.paymentInfo.transactionId}</p>
        <p><strong>Status:</strong> ${order.paymentInfo.status}</p>
      </body>
      </html>
    `;
    
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'processing':
        return <FiPackage className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
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
              placeholder="Search orders..."
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Orders
          </button>
          <div className="text-sm text-gray-600 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : orders.length > 0 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span>Total Orders: {orders.length} | Filtered: {filteredOrders.length}</span>
            {!loading && orders.length > 0 && orders[0]?.id === 'mock1' && (
              <span className="text-orange-500 font-medium">🧪 Mock Data (Backend API needed)</span>
            )}
            {!loading && orders.length === 0 && (
              <span className="text-red-500 font-medium">⚠️ No orders found</span>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => generateInvoice(order)}
                          className="text-green-600 hover:text-green-900"
                          title="Generate Invoice"
                        >
                          <FiPrinter />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {orders.length === 0 ? (
                          <div>
                            <FiPackage className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No orders yet</p>
                            <p className="text-sm">Orders will appear here when customers place them</p>
                          </div>
                        ) : (
                          <p>No orders match your search criteria</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
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
              <h3 className="text-xl font-semibold">Order Details - {selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>{selectedOrder.shippingAddress.pincode}, {selectedOrder.shippingAddress.country}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <p><strong>Method:</strong> {selectedOrder.paymentInfo.method}</p>
                  <p><strong>Transaction ID:</strong> {selectedOrder.paymentInfo.transactionId}</p>
                  <p><strong>Status:</strong> {selectedOrder.paymentInfo.status}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.variant}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.price}</p>
                            <p className="text-sm text-gray-600">
                              Total: ₹{item.quantity * item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-lg font-bold">₹{selectedOrder.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => generateInvoice(selectedOrder)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <FiPrinter />
                    <span>Generate Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderManagement;