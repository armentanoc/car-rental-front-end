import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const ClientLayout = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h2>Cliente</h2>
        <ThemeToggle />
        <p>Bem-vindo, {user?.name?.split(' ')[0]}!</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        {/* <nav className="nav-links">
          <NavLink to="/admin/users" className="nav-link" activeClassName="active-link">Usuários</NavLink>
          <NavLink to="/admin/vehicles" className="nav-link" activeClassName="active-link">Veículos</NavLink>
          <NavLink to="/admin/images" className="nav-link" activeClassName="active-link">Imagens</NavLink>
        </nav> */}
        <hr />
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
