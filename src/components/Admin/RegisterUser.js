import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterUser = ( {onUserAdded} ) => {
  const { register } = useAuth(); // Usar função de registro existente
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT'); // Valor padrão

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      username,
      password,
      role
    };

    try {
      // Chama a função de registro do AuthContext
      const { success, message } = await register(userData);
      console.log("Success: " + success);
      console.log("Message: " + message);
      
      // Recarrega lista de usuários
      onUserAdded();

      // Exibe mensagem de sucesso ou erro
      alert(message); 

    } catch (error) {
      console.error('Error during registration:', error); 
      alert('Ocorreu um erro durante o registro.'); 
    }

    // Limpar campos após o registro
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRole('CLIENT');
  };

  return (
    <div>
      <h2>Registrar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
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
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="CLIENT">Cliente</option>
          <option value="ATTENDING">Atendimento</option>
          <option value="MANAGER">Gerente</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterUser;
