import React, { useEffect, useState, useRef } from 'react';
import { UserAPI } from '../../components/Admin/api';
import { useAuth } from '../../context/AuthContext';
import UserForm from '../../components/Admin/UserForm';
import UserTable from '../../components/Admin/UserTable';
import Pagination from '../../components/Pagination';

const ManageUsers = () => {
  const { user, register } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    password: undefined,
    role: 'CLIENT',
  });
  const [editMode, setEditMode] = useState(false);
  const userFormRef = useRef(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadUsers = async (pageNumber = 0) => {
    try {
      const data = await UserAPI.fetchUsers(pageNumber, 20);
      setUsers(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
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

        setNewUser({ name: '', email: '', username: '', password: undefined, role: 'CLIENT' });
        setEditMode(false);
        setPage(0);
        await loadUsers(0);
      } catch (err) {
        console.error(err);
        alert(editMode ? 'Erro ao atualizar usuário.' : 'Erro ao cadastrar usuário.');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleEditUser = (userToEdit) => {
    setNewUser({ ...userToEdit, password: undefined });
    setEditMode(true);
    userFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRemoveUser = async (userId) => {
    try {
      await UserAPI.removeUser(userId, user.id);
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('Usuário removido com sucesso.');
    } catch (err) {
      console.error('Erro ao remover usuário:', err);
      alert('Erro ao remover usuário.');
    }
  };

  useEffect(() => {
    loadUsers(page);
  }, [page]);

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

      <Pagination 
        page={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
};

export default ManageUsers;
