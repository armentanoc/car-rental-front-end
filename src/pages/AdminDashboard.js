import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddSpace from '../components/Admin/AddSpace';

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

const fetchSpaces = async () => {
  try {
    const response = await fetch('http://localhost:8090/locations', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      var responseLog = await response.json();
      throw new Error('Erro ao buscar espaços' + responseLog.message);
    }

    const spaces = await response.json();
    return spaces;
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

const removeLocation = async (locationId, adminId) => {
  // Função para remover local
  try {
    const response = await fetch(`http://localhost:8090/locations/${locationId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminId }),
    });

    var responseLog = await response.json();

    if (!response.ok) {
      throw new Error(responseLog.message);
    }

    return locationId; // Retorna o locationId se a remoção for bem-sucedida
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
  const [spaces, setSpaces] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', username: '', password: '', role: 'PROFESSOR' });
  const [newSpace, setNewSpace] = useState({ name: '', capacity: '', location: '', resources: '', locationType: 'SALA' });
  const [editSpaceMode, setEditSpaceMode] = useState(false);
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
    const spacesData = await fetchSpaces();
  
    setUsers(usersData);
    setSpaces(spacesData);
  };
  
  // Carregar usuários e espaços ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  // Função para recarregar página após adicionar espaço
  const handleSpaceAdded = async () => {
    await loadData();
  };

  // Função para recarregar página após adicionar usuário
  const handleUserAdded = async () => {
    await loadData();
  };

  const handleEditSpace = (space) => {
    setNewSpace(space);
    setEditSpaceMode(true);
  };

  const handleSaveSpaceEdit = async () => {
      setNewSpace({ description: '', capacity: '', location: '', resources: '', locationType: 'SALA' });
      setEditSpaceMode(false);
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

  const handleRemoveSpace = async (locationId) => {
    const deletedLocationId = await removeLocation(locationId, adminId);
    if (deletedLocationId) {
      // Atualiza a lista de espaços, removendo o espaço deletado
      setSpaces(spaces.filter(space => space.id !== deletedLocationId));
      alert('Espaço removido com sucesso.');
    }
  };

  return (
    <div>
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo ao painel do administrador, {user.name.split(' ')[0]}! Aqui você pode gerenciar usuários e espaços físicos.</p>

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
          <option value="PROFESSOR">Professor</option>
          <option value="GESTOR">Gestor</option>
          <option value="ADMINISTRADOR">Administrador</option>
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

      <h3>{editSpaceMode ? 'Editar Espaço' : 'Cadastrar Novo Espaço'}</h3>
      <AddSpace
        onSpaceAdded={handleSpaceAdded}
        onUserAdded={handleUserAdded}
        onSpaceUpdatedEdit={handleSaveSpaceEdit}
        onSaveEdit={editSpaceMode ? handleSaveSpaceEdit : null}
        defaultValues={editSpaceMode ? newSpace : null}
        adminId={adminId}
      />

      <h3>Gestão de Espaços</h3>
      {spaces.length === 0 ? (
        <p>Carregando espaços...</p>
      ) : (
        <ul>
          {spaces.map(space => (
            <li key={space.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                Id: {space.id} - Nome: {space.description} - Capacidade: {space.capacity} pessoas - Localização: {space.location} - Tipo: {space.locationType} - Recursos: {space.resources}
              </div>
              <div className="botoes-div">
                <button onClick={() => handleEditSpace(space)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => handleRemoveSpace(space.id)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
