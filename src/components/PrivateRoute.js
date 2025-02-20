// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Se o usuário não estiver logado, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Se o usuário não tiver permissão, redireciona para a página correspondente ao seu role
    const roleRedirects = {
      ADMINISTRADOR: "/admin-dashboard",
      GESTOR: "/manager-dashboard",
      PROFESSOR: "/user-dashboard",
    };

    return <Navigate to={roleRedirects[user.role] || "/login"} />;
  }

  // Se estiver logado e tiver permissão, renderiza o componente passado
  return element;
};

export default PrivateRoute;
