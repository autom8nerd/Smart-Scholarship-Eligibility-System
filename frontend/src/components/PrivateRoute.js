import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, role, userRole, children }) => {
  if (!isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin-login' : '/student-login'} />;
  }

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
