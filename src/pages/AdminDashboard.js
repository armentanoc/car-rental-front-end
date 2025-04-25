import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:8090/users', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      var responseLog = await response.json();
      console.log(responseLog.data);
      throw new Error('Erro ao buscar usuários');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

const removeUser = async (userId, adminId) => {
  try {
    // Envia uma requisição POST para o endpoint de usuários
    const response = await fetch(`http://localhost:8090/users/${userId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminId }),
    });

    var responseLog = await response.json();
    console.log(responseLog.data);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(responseLog.message);
    }

    return userId; // Retorna o userId se a remoção for bem-sucedida
  } catch (error) {
    console.error(error);
    alert('Erro: ' + error.message); // Notifica o usuário sobre o erro
    return null; // Retorna null em caso de erro
  }
};

const updateUser = async (userId, userData, adminId) => {
  const filteredData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );

  filteredData.adminId = adminId;

  try {
    console.log(filteredData);
    
    const response = await fetch(`http://localhost:8090/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredData),
    });

    const responseLog = await response.json();

    if (!response.ok) {
      console.log(responseLog.data);
      throw new Error(responseLog.message);
    }
    
    return userId; 
  } catch (error) {
    console.error(error);
    alert('Erro: ' + error.message); 
    return null; 
  }
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', username: '', password: '', role: 'PROFESSOR' });
  const [editUserMode, setEditUserMode] = useState(false);
  const { user, register, logout } = useAuth();
  
  const navigate = useNavigate();

  //Pegando o id do admin
  const adminId = user.id;

  // Função para deslogar
  const handleLogout = () => {
    logout(); // Executa logout
    navigate('/login'); // Redireciona para a página de login
  };

  // Função para registrar um novo usuário
  const handleRegister = async () => {
    if (newUser.name && newUser.email && newUser.username && newUser.password && newUser.role) {
      const { message } = await register(newUser, adminId);
      alert(message);
      setNewUser({ name: '', email: '', username: '', password: '', role: 'PROFESSOR' });
      setEditUserMode(false);
      await loadData();
    } else {
      console.log(newUser);
      alert('Por favor, preencha todos os campos.');
    }
  };

  // Função para ativar o modo de edição de usuário
  const handleEditUser = async (user) => {
    setNewUser(user);
    setEditUserMode(true);
    await loadData();
  };

  // Função para salvar a edição do usuário
  const handleSaveUserEdit = async () => {
    const updatedUserData = {
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
    };
  
    if (newUser.password) {
      updatedUserData.password = newUser.password;
    }

    const updatedUser = await updateUser(newUser.id, updatedUserData, adminId);

    if (updatedUser) {
      const updatedUsers = users.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setNewUser({ name: '', email: '', username: '', password: '', role: '' });
      setEditUserMode(false);
      await loadData(); 
      alert('Usuário atualizado com sucesso!');
    }
  };

  const loadData = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);
  };
  
  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  // Função para recarregar página após adicionar usuário
  const handleUserAdded = async () => {
    await loadData();
  };

  // Atualiza a função handleRemoveUser para usar a nova função removeUser
  const handleRemoveUser = async (userId) => {
    const deletedUserId = await removeUser(userId, adminId);
    if (deletedUserId) {
      // Atualiza a lista de usuários, removendo o usuário deletado
      setUsers(users.filter(user => user.id !== deletedUserId));
      alert('Usuário removido com sucesso.');
    }
  };

  return (
    <div>
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo ao painel do administrador, {user.name.split(' ')[0]}! Aqui você pode gerenciar usuários.</p>

      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <h3>{editUserMode ? 'Editar Usuário' : 'Registro de Novo Usuário'}</h3>
      <div>
        <input
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Usuário"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Senha"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="CLIENT">Cliente</option>
          <option value="ATTENDING">Atendimento</option>
          <option value="MANAGER">Gerente</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {editUserMode ? (
          <button onClick={handleSaveUserEdit}>Salvar Edição</button>
        ) : (
          <button onClick={handleRegister}>Registrar</button>
        )}
      </div>

      <h3>Gestão de Usuários</h3>
      {users.length === 0 ? (
        <p>Carregando usuários...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Email</th>
              <th>Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => handleEditUser(user)} style={{ marginRight: '5px' }}>Editar</button>
                  <button onClick={() => handleRemoveUser(user.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
