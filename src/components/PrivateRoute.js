import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    const roleRedirects = {
      ADMIN: "/admin",
      CLIENT: "/client"
    };

    return <Navigate to={roleRedirects[user.role] || "/login"} />;
  }

  return element;
};

export default PrivateRoute;
