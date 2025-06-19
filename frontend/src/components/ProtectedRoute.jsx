import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, authChecked } = useContext(ShopContext);

  // If still checking authentication, show loading
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    toast.error('You must be logged in to access this page');
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
