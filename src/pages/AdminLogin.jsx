import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend API for admin authentication
      const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store admin session
        localStorage.setItem('adminAuth', JSON.stringify({
          isAdmin: true,
          email: data.admin.email,
          loginTime: new Date().toISOString()
        }));
        
        toast.success('Admin login successful!');
        navigate('/admin');
      } else {
        toast.error(data.message || 'Invalid admin credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-red-500">SHOE</span>
              <span className="text-white"> COLLECTION</span>
            </span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-red-500 p-3 rounded-full">
              <FiShield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Access</h2>
          <p className="mt-2 text-gray-300">Authorized personnel only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-6 border border-gray-700">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Admin Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
              placeholder="admin@example.com" 
              required 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10" 
                placeholder="••••••••" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>

          <div className="text-center">
            <Link to="/" className="text-gray-400 hover:text-white text-sm">
              ← Back to Store
            </Link>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;