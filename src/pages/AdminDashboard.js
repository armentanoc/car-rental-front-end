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
      const responseLog = await response.json();
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

const fetchVehicles = async () => {
  try {
    const response = await fetch('http://localhost:8090/vehicles', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar veículos');
    }

    const vehicles = await response.json();
    return vehicles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const removeUser = async (userId, adminId) => {
  try {
    const response = await fetch(`http://localhost:8090/users/${userId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminId }),
    });

    const responseLog = await response.json();
    console.log(responseLog.data);

    if (!response.ok) {
      throw new Error(responseLog.message);
    }

    return userId;
  } catch (error) {
    console.error(error);
    alert('Erro: ' + error.message);
    return null;
  }
};

const removeVehicle = async (vehicleId, adminId) => {
  try {
    const response = await fetch(`http://localhost:8090/vehicles/${vehicleId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao remover o veículo');
    }

    return vehicleId;
  } catch (error) {
    console.error(error);
    alert('Erro ao remover o veículo: ' + error.message);
    return null;
  }
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', username: '', password: '', role: 'PROFESSOR' });
  const [newVehicle, setNewVehicle] = useState({ model: '', brand: '', color: '', year: '', licensePlate: '', chassiNumber: '', fuelType: 'GASOLINE', mileage: '', additionalFeatures: '', status: 'ACTIVE', category: 'SUV', });

  const [editUserMode, setEditUserMode] = useState(false);
  const { user, register, logout } = useAuth();
  const navigate = useNavigate();

  const adminId = user.id;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRegisterUser = async () => {
    if (newUser.name && newUser.email && newUser.username && newUser.password && newUser.role) {
      const { message } = await register(newUser, adminId);
      alert(message);
      setNewUser({ name: '', email: '', username: '', password: '', role: 'PROFESSOR' });
      setEditUserMode(false);
      await loadData();
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleRegisterVehicle = async () => {
    if (newVehicle.model && newVehicle.brand && newVehicle.licensePlate && newVehicle.year) {
      const response = await fetch('http://localhost:8090/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });

      if (response.ok) {
        alert('Veículo registrado com sucesso!');
        setNewVehicle({ model: '', brand: '', color: '', year: '', licensePlate: '', category: 'SUV' });
        await loadData();
      } else {
        alert('Falha ao cadastrar veículo.');
      }
    } else {
      alert('Por favor, preencha todos os campos do veículo.');
    }
  };

  const handleRemoveUser = async (userId) => {
    const deletedUserId = await removeUser(userId, adminId);
    if (deletedUserId) {
      setUsers(users.filter(user => user.id !== deletedUserId));
      alert('Usuário removido com sucesso.');
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    const deletedVehicleId = await removeVehicle(vehicleId, adminId);
    if (deletedVehicleId) {
      setVehicles(vehicles.filter(vehicle => vehicle.vehicleId !== deletedVehicleId));
      alert('Veículo removido com sucesso.');
    }
  };

  const loadData = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);
    const vehiclesData = await fetchVehicles();
    setVehicles(vehiclesData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo ao painel do administrador, {user.name.split(' ')[0]}! 
      <br></br>Aqui você pode gerenciar usuários e veículos.
      <br></br>
      </p>
      <button className="logout-button" onClick={handleLogout}>Logout</button>

      {/* User Management */}
      <h3>{editUserMode ? 'Editar Usuário' : 'Registrar Novo Usuário'}</h3>
      <div>
        <input type="text" placeholder="Nome" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input type="text" placeholder="Usuário" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        <input type="password" placeholder="Senha" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="CLIENT">Cliente</option>
          <option value="ATTENDING">Atendimento</option>
          <option value="MANAGER">Gerente</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {editUserMode ? (
          <button class="input-button" onClick={handleRegisterUser}>Salvar Edição</button>
        ) : (
          <button class="input-button" onClick={handleRegisterUser}>Registrar</button>
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
                  <button onClick={() => handleRemoveUser(user.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Vehicle Management */}
      <h3>{'Registrar Novo Veículo'}</h3>
      <div>
        <input
          type="text"
          placeholder="Modelo"
          value={newVehicle.model}
          onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
        />
        <input
          type="text"
          placeholder="Marca"
          value={newVehicle.brand}
          onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cor"
          value={newVehicle.color}
          onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
        />
        <input
          type="number"
          placeholder="Ano"
          value={newVehicle.year}
          onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
        />
        <input
          type="text"
          placeholder="Placa"
          value={newVehicle.licensePlate}
          onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Número do Chassi"
          value={newVehicle.chassiNumber}
          onChange={(e) => setNewVehicle({ ...newVehicle, chassiNumber: e.target.value })}
        />
        <select
          value={newVehicle.fuelType}
          onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
        >
          <option value="GASOLINE">Gasolina</option>
          <option value="ETHANOL">Etanol</option>
          <option value="ELECTRIC">Elétrico</option>
        </select>
        <input
          type="number"
          placeholder="Quilometragem"
          value={newVehicle.mileage}
          onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
        />
        <input
          type="text"
          placeholder="Características Adicionais"
          value={newVehicle.additionalFeatures}
          onChange={(e) => setNewVehicle({ ...newVehicle, additionalFeatures: e.target.value })}
        />
        <select
          value={newVehicle.status}
          onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
        >
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
          <option value="PENDING">Pendente</option>
        </select>
        <select
          value={newVehicle.category}
          onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
        >
          <option value="MOTORCYCLE">Motocicleta</option>
          <option value="VAN">Van</option>
          <option value="TRUCK">Caminhonete</option>
          <option value="ECONOMY">Econômico</option>
          <option value="LUXURY">Luxo</option>
          <option value="SUV">SUV</option>
        </select>
        <button class="input-button" onClick={handleRegisterVehicle}>Cadastrar Veículo</button>
      </div>

      <h3>Gestão de Veículos</h3>
      {vehicles.length === 0 ? (
        <p>Carregando veículos...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Cor</th>
              <th>Ano</th>
              <th>Placa</th>
              <th>Combustível</th>
              <th>Quilometragem</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.vehicleId}>
                <td>{vehicle.vehicleId}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.color}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.licensePlate}</td>
                <td>{vehicle.fuelType}</td>
                <td>{vehicle.mileage}</td>
                <td>{vehicle.category}</td>
                <td>{vehicle.status}</td>
                <td>
                  <button onClick={() => handleRemoveVehicle(vehicle.vehicleId)}>Remover</button>
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
