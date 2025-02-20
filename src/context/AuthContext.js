import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Função para fazer login
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8090/auth', credentials, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      // Se o login for bem-sucedido
      if (response.data.success) {
        const loggedInUser = response.data.user; 
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser)); // Armazenar dados do usuário no localStorage
        return { success: true, message: 'Novo usuário logado (UserId: '+loggedInUser.id+')' };
      } else {
        return { success: false, message: response.data.message || 'Login failed.' };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Função para fazer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remover dados do usuário do localStorage
  };

  // Função para registrar um novo usuário
  const register = async (userData, adminId) => {
    try {
      const formattedUserData = {
        ...userData,
        role: userData.role.toUpperCase(),
        adminId
      };
  
      const response = await axios.post('http://localhost:8090/users', formattedUserData, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Registration response:', response.data);
  
      if (response.data.success) {
        return { success: true, message: 'Usuário registrado com sucesso!' };
      } else {
        return { success: false, message: response.data.message || 'Erro ao registrar o usuário.' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Erro desconhecido';
      return { success: false, message };
    }
  };

  useEffect(() => {
    // Recupera dados do usuário armazenados no localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
