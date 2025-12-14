import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { logoutUser } from '../store/authSlice';
import { setSearchTerm } from '../store/productsSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const { searchTerm } = useSelector(state => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <header className="bg-header backdrop-blur-lg sticky top-0 z-50 border-b border-main">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-2xl md:text-3xl font-bold">
                <span className="hero-shoe">SHOE</span>
                <span className="hero-collection"> COLLECTION</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-2 font-medium">
            <Link to="/" className="text-main hover-custom-gray rounded-full px-4 py-2 transition-colors">HOME</Link>
            <Link to="/shop" className="text-main hover-custom-gray rounded-full px-4 py-2 transition-colors">COLLECTION</Link>
            <div className="relative">
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="text-main hover-custom-gray rounded-full px-4 py-2 transition-colors flex items-center"
              >
                CATEGORIES
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-main rounded-lg shadow-lg z-20 categories-dropdown">
                  <Link 
                    to="/men" 
                    className="block px-4 py-2 text-main hover:bg-gray-100"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Men
                  </Link>
                  <Link 
                    to="/women" 
                    className="block px-4 py-2 text-main hover:bg-gray-100"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Women
                  </Link>
                  <Link 
                    to="/kids" 
                    className="block px-4 py-2 text-main hover:bg-gray-100"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Kids
                  </Link>
                </div>
              )}
            </div>
            <Link to="/about" className="text-main hover-custom-gray rounded-full px-4 py-2 transition-colors">ABOUT US</Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:block relative">
              <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm}
                onChange={handleSearch}
                className="form-input text-main bg-card rounded-full pr-10 w-48"
              />
              <FiSearch className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-secondary" />
            </div>

            <Link to="/cart" className="p-2 rounded-full hover-custom-gray transition-colors relative">
              <FiShoppingCart className="w-6 h-6 fill-icon" />
              {items && items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover-custom-gray transition-colors"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <FiUser className="w-6 h-6 text-main" />
                  )}
                </button>
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FiUser className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/profile?tab=orders" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FiPackage className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full hover-custom-gray transition-colors">
                <FiUser className="w-6 h-6 text-main" />
              </Link>
            )}

            <button onClick={toggleTheme} className="p-2 rounded-full hover-custom-gray transition-colors">
              {isDark ? <FiSun className="w-6 h-6 fill-icon" /> : <FiMoon className="w-6 h-6 fill-icon" />}
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md lg:hidden"
            >
              {isMenuOpen ? <FiX className="h-6 w-6 text-main" /> : <FiMenu className="h-6 w-6 text-main" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <Link to="/" className="block py-2 px-4 text-sm text-main hover:bg-accent hover:text-white rounded">HOME</Link>
            <Link to="/shop" className="block py-2 px-4 text-sm text-main hover:bg-accent hover:text-white rounded">COLLECTION</Link>
            <Link to="/categories" className="block py-2 px-4 text-sm text-main hover:bg-accent hover:text-white rounded">CATEGORIES</Link>
            <Link to="/about" className="block py-2 px-4 text-sm text-main hover:bg-accent hover:text-white rounded">ABOUT</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;