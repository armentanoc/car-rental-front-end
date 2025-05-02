import React, { useEffect, useState, useRef } from 'react';
import { UserAPI } from '../../components/Admin/api'; 
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
    password: null,
    role: 'CLIENT',
  });
  const [editMode, setEditMode] = useState(false);
  const userFormRef = useRef(null);

  const loadUsers = async () => {
    try {
      const data = await UserAPI.fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      alert('Erro ao buscar usuários.');
    }
  };

  const handleRegisterUser = async () => {
    const { name, email, username, password, role, id } = newUser;

    if (name && email && username && (editMode || password) && role) {
      try {
        if (editMode) {
          await UserAPI.updateUser(id, { name, email, username, password, role }, user.id);
          alert('Usuário atualizado com sucesso!');
        } else {
          const { message } = await register(newUser, user.id);
          alert(message);
        }

        setNewUser({ name: '', email: '', username: '', password: null, role: 'CLIENT' });
        setEditMode(false);
        await loadUsers();
      } catch (err) {
        console.error(err);
        alert(editMode ? 'Erro ao atualizar usuário.' : 'Erro ao cadastrar usuário.');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleEditUser = (userToEdit) => {
    setNewUser({ ...userToEdit, password: null });  
    setEditMode(true);
    userFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRemoveUser = async (userId) => {
    try {
      const deletedId = await UserAPI.removeUser(userId, user.id);
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
      <div ref={userFormRef}>
        <UserForm
          newUser={newUser}
          setNewUser={setNewUser}
          onRegisterUser={handleRegisterUser}
          editMode={editMode}
        />
      </div>

      <UserTable
        users={users}
        onRemoveUser={handleRemoveUser}
        onEditUser={handleEditUser}
      />
    </div>
  );
};

export default ManageUsers;
