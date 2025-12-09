import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { registerUser } from '../store/authSlice';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await dispatch(registerUser(formData.email, formData.password, formData.name, formData.dateOfBirth, formData.gender));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
      toast.error('Registration failed!');
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold text-main">Create Account</h2>
          <p className="mt-2 text-secondary">Join the Shoe Collection family</p>
        </div>
          
          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input" 
                placeholder="John Doe" 
                required 
              />
            </div>

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
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-secondary mb-2">Date of Birth</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-input" 
                required 
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-secondary mb-2">Gender</label>
              <select 
                id="gender" 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-input" 
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input pr-10" 
                  placeholder="••••••••" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-btn py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <p className="text-sm text-secondary">
                Already have an account? 
                <Link to="/login" className="text-accent hover:text-accent-hover font-medium ml-1">Login</Link>
              </p>
            </div>
          </form>
        </div>
    </div>
  );
};

export default Signup;