import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { loginUser } from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(loginUser(formData));
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      setError(error.message || 'Invalid email or password');
      toast.error('Login failed!');
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="text-2xl md:text-3xl font-bold">
              <span className="hero-shoe">SHOE</span>
              <span className="hero-collection"> COLLECTION</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-main">Welcome Back</h2>
          <p className="mt-2 text-secondary">Login to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input" 
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input pr-10" 
                placeholder="••••••••" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-main text-accent focus:ring-accent"
              />
              <span className="ml-2 text-sm text-secondary">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-accent hover:text-accent-hover">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-accent text-btn py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
          >
            Login
          </button>

          <div className="text-center">
            <p className="text-sm text-secondary">
              Don't have an account? 
              <Link to="/signup" className="text-accent hover:text-accent-hover font-medium ml-1">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;