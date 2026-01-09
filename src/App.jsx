import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store/store';
import { loadCart } from './store/cartSlice';
import { loadProducts } from './store/productsSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Cart = React.lazy(() => import('./pages/Cart'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Shop = React.lazy(() => import('./pages/Shop'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Men = React.lazy(() => import('./pages/Men'));
const Women = React.lazy(() => import('./pages/Women'));
const Kids = React.lazy(() => import('./pages/Kids'));
const About = React.lazy(() => import('./pages/About'));
const AdminPanel = React.lazy(() => import('./admin/AdminPanel'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const ReturnPolicy = React.lazy(() => import('./pages/ReturnPolicy'));
const OrderConfirmation = React.lazy(() => import('./pages/OrderConfirmation'));

// Route wrapper component for animations
const AnimatedRoute = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

function AppContent() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Load products from MongoDB on app start
    const initializeApp = async () => {
      try {
        await store.dispatch(loadProducts());
        // Simulate minimum loading time for better UX
        setTimeout(() => setIsInitialLoading(false), 1500);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialLoading(false);
      }
    };
    
    initializeApp();
    
    // Listen for product refresh events from admin panel
    const handleRefreshProducts = () => {
      store.dispatch(loadProducts());
    };
    
    window.addEventListener('refreshProducts', handleRefreshProducts);
    
    return () => {
      window.removeEventListener('refreshProducts', handleRefreshProducts);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      store.dispatch(loadCart(user.id));
    }
  }, [isAuthenticated, user]);

  if (isInitialLoading) {
    return <LoadingSpinner />;
  }



  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 relative overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <AnimatedRoute>
                  <Home />
                </AnimatedRoute>
              } />
              <Route path="/shop" element={
                <AnimatedRoute>
                  <Shop />
                </AnimatedRoute>
              } />
              <Route path="/men" element={
                <AnimatedRoute>
                  <Men />
                </AnimatedRoute>
              } />
              <Route path="/women" element={
                <AnimatedRoute>
                  <Women />
                </AnimatedRoute>
              } />
              <Route path="/kids" element={
                <AnimatedRoute>
                  <Kids />
                </AnimatedRoute>
              } />
              <Route path="/about" element={
                <AnimatedRoute>
                  <About />
                </AnimatedRoute>
              } />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AnimatedRoute>
                    <AdminPanel />
                  </AnimatedRoute>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <AdminProtectedRoute>
                  <AnimatedRoute>
                    <AdminPanel />
                  </AnimatedRoute>
                </AdminProtectedRoute>
              } />
              <Route path="/admin-login" element={
                <AnimatedRoute>
                  <AdminLogin />
                </AnimatedRoute>
              } />
              <Route path="/terms" element={
                <AnimatedRoute>
                  <Terms />
                </AnimatedRoute>
              } />
              <Route path="/privacy" element={
                <AnimatedRoute>
                  <Privacy />
                </AnimatedRoute>
              } />
              <Route path="/return-policy" element={
                <AnimatedRoute>
                  <ReturnPolicy />
                </AnimatedRoute>
              } />
              <Route path="/product/:id" element={
                <AnimatedRoute>
                  <ProductDetails />
                </AnimatedRoute>
              } />
              <Route path="/cart" element={
                <AnimatedRoute>
                  <Cart />
                </AnimatedRoute>
              } />
              <Route path="/login" element={
                <AnimatedRoute>
                  <Login />
                </AnimatedRoute>
              } />
              <Route path="/signup" element={
                <AnimatedRoute>
                  <Signup />
                </AnimatedRoute>
              } />
              <Route path="/forgot-password" element={
                <AnimatedRoute>
                  <ForgotPassword />
                </AnimatedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <AnimatedRoute>
                    <Checkout />
                  </AnimatedRoute>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AnimatedRoute>
                    <Profile />
                  </AnimatedRoute>
                </ProtectedRoute>
              } />
              <Route path="/order-confirmation" element={
                <ProtectedRoute>
                  <AnimatedRoute>
                    <OrderConfirmation />
                  </AnimatedRoute>
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;