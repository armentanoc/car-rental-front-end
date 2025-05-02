import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário estiver autenticado, redireciona para o painel correspondente
    if (user) {
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/users');
          break;
        default:
          navigate('/client');
          break;
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = { username, password };

    // Usa o método de login do AuthContext
    const { success, message } = await login(credentials);

    // Se o nome de usuário ou senha estiver errado
    if (!success) {
      console.error("Login error: "+message)
      alert(message);
    }
    else {
      console.log("Login successful: "+message) // Exibir informações do usuário se estiver correto
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
