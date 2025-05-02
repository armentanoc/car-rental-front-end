// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
 const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout(); // Executa logout
    navigate('/login'); // Redireciona para a página de login
  };

  useEffect(() => {
    if (user) {
      // Redireciona para o painel correspondente com base no perfil do usuário
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'client':
        default:
          navigate('/client');
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <button onClick={handleLogout}>Sair</button>
      <h2>Painel Principal</h2>
      <p>Bem-vindo ao sistema de alocação de espaço físico!</p>
      <nav>
        <ul>
          <li>
            <Link to="/client">Painel do Cliente</Link>
          </li> 
          <li>
            <Link to="/admin">Painel do Administrador</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
