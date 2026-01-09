import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const adminAuth = localStorage.getItem('adminAuth');
  
  // Always redirect to admin-login if no auth data
  if (!adminAuth) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const adminData = JSON.parse(adminAuth);
    
    // Check if user is admin
    if (!adminData.isAdmin) {
      localStorage.removeItem('adminAuth');
      return <Navigate to="/admin-login" replace />;
    }
    
    // Check if session is still valid (24 hours)
    const loginTime = new Date(adminData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      localStorage.removeItem('adminAuth');
      return <Navigate to="/admin-login" replace />;
    }
    
    // All checks passed, allow access
    return children;
  } catch (error) {
    // Invalid auth data, clear and redirect
    localStorage.removeItem('adminAuth');
    return <Navigate to="/admin-login" replace />;
  }
};

export default AdminProtectedRoute;