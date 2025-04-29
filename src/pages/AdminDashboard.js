import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchUsers,
  fetchVehicles,
  removeUser,
  removeVehicle,
  removeImage
} from '../components/Admin/api';

import UserForm from '../components/Admin/UserForm';
import UserTable from '../components/Admin/UserTable';
import VehicleForm from '../components/Admin/VehicleForm';
import VehicleTable from '../components/Admin/VehicleTable';
import ImageForm from '../components/Admin/ImageForm';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState({});
  const [newUser, setNewUser] = useState({ name: '', email: '', username: '', password: '', role: 'CLIENT' });
  const [newVehicle, setNewVehicle] = useState({ model: '', brand: '', color: '', year: '', licensePlate: '', chassiNumber: '', fuelType: 'GASOLINE', mileage: '', additionalFeatures: '', status: 'ACTIVE', category: 'SUV' });
  const [newImage, setNewImage] = useState({ url: '', vehicleId: '', description: '' });
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
        setNewVehicle({ model: '', brand: '', color: '', year: '', licensePlate: '', chassiNumber: '', fuelType: 'GASOLINE', mileage: '', additionalFeatures: '', status: 'ACTIVE', category: 'SUV' });
        await loadData();
      } else {
        alert('Falha ao cadastrar veículo.');
      }
    } else {
      alert('Por favor, preencha todos os campos do veículo.');
    }
  };

  const handleAddImageUrl = async () => {
    const { url, vehicleId, description } = newImage;
    if (!url || !vehicleId || !description) {
      alert('Por favor, preencha todos os campos da imagem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8090/vehicle-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
        body: JSON.stringify({ vehicleId, url, description }),
      });

      if (response.ok) {
        alert('Imagem adicionada com sucesso!');
        setNewImage({ url: '', vehicleId: '', description: '' });
        fetchVehicleImages(vehicleId);
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar imagem: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error);
      alert('Erro ao adicionar imagem.');
    }
  };

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:8090/vehicle-images/vehicle/${vehicleId}`, {
        method: 'GET',
        headers: { 'Accept': '*/*' },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setVehicleImages((prevImages) => ({
          ...prevImages,
          [vehicleId]: data,
        }));
      }
    } catch (error) {
      console.error('Error fetching vehicle images:', error);
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

  const handleRemoveImage = async (imageId, vehicleId) => {
    const deletedImageId = await removeImage(imageId);
    if (deletedImageId) {
      setVehicleImages(prevImages => {
        const updatedImages = { ...prevImages };
        updatedImages[vehicleId] = updatedImages[vehicleId].filter(
          image => image.imageId !== imageId
        );
        return updatedImages;
      });
      alert('Imagem removida com sucesso!');
    }
  };

  const loadData = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);
    const vehiclesData = await fetchVehicles();
    setVehicles(vehiclesData);
    vehiclesData.forEach(vehicle => {
      fetchVehicleImages(vehicle.vehicleId);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo, {user.name.split(' ')[0]}!</p>
      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <UserForm newUser={newUser} setNewUser={setNewUser} onRegisterUser={handleRegisterUser} editMode={editUserMode} />
      <UserTable users={users} onRemoveUser={handleRemoveUser} />

      <VehicleForm newVehicle={newVehicle} setNewVehicle={setNewVehicle} onRegisterVehicle={handleRegisterVehicle} />
      <ImageForm newImage={newImage} setNewImage={setNewImage} onAddImage={handleAddImageUrl} />
      <VehicleTable vehicles={vehicles} vehicleImages={vehicleImages} onRemoveVehicle={handleRemoveVehicle} onRemoveImage={handleRemoveImage} />
    </div>
  );
};

export default AdminDashboard;
