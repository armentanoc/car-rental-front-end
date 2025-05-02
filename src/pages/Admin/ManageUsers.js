// src/pages/admin/ManageUsers.js
import React, { useEffect, useState } from 'react';
import { fetchUsers, removeUser } from '../../components/Admin/api';
import { useAuth } from '../../context/AuthContext';
import UserForm from '../../components/Admin/UserForm';
import UserTable from '../../components/Admin/UserTable';

const ManageUsers = () => {
  const { user, register } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'CLIENT',
  });

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      alert('Erro ao buscar usuários.');
    }
  };

  const handleRegisterUser = async () => {
    const { name, email, username, password, role } = newUser;
    if (name && email && username && password && role) {
      try {
        const { message } = await register(newUser, user.id);
        alert(message);
        setNewUser({
          name: '',
          email: '',
          username: '',
          password: '',
          role: 'CLIENT',
        });
        await loadUsers();
      } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        alert('Erro ao cadastrar usuário.');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const deletedId = await removeUser(userId, user.id);
      if (deletedId) {
        setUsers(prev => prev.filter(u => u.id !== deletedId));
        alert('Usuário removido com sucesso.');
      }
    } catch (err) {
      console.error('Erro ao remover usuário:', err);
      alert('Erro ao remover usuário.');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <UserForm newUser={newUser} setNewUser={setNewUser} onRegisterUser={handleRegisterUser} />
      <UserTable users={users} onRemoveUser={handleRemoveUser} />
    </div>
  );
};

export default ManageUsers;
