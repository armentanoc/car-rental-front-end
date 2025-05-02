// src/pages/admin/ManageVehicles.js
import React, { useEffect, useState } from 'react';
import { fetchVehicles, removeVehicle } from '../../components/Admin/api';
import { useAuth } from '../../context/AuthContext';
import VehicleForm from '../../components/Admin/VehicleForm';
import VehicleTable from '../../components/Admin/VehicleTable';

const ManageVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState({});
  const [newVehicle, setNewVehicle] = useState({
    model: '',
    brand: '',
    color: '',
    year: '',
    licensePlate: '',
    chassiNumber: '',
    fuelType: 'GASOLINE',
    mileage: '',
    additionalFeatures: '',
    status: 'ACTIVE',
    category: 'SUV'
  });

  const loadVehicles = async () => {
    const data = await fetchVehicles();
    setVehicles(data);
    data.forEach(vehicle => fetchVehicleImages(vehicle.vehicleId));
  };

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const response = await fetch(`http://localhost:8090/vehicle-images/vehicle/${vehicleId}`, {
        method: 'GET',
        headers: { 'Accept': '*/*' },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setVehicleImages(prev => ({ ...prev, [vehicleId]: data }));
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    }
  };

  const handleRegisterVehicle = async () => {
    const { model, brand, licensePlate, year } = newVehicle;
    if (model && brand && licensePlate && year) {
      const res = await fetch('http://localhost:8090/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });
      if (res.ok) {
        alert('Veículo registrado com sucesso!');
        setNewVehicle({
          model: '', brand: '', color: '', year: '', licensePlate: '',
          chassiNumber: '', fuelType: 'GASOLINE', mileage: '', additionalFeatures: '',
          status: 'ACTIVE', category: 'SUV'
        });
        await loadVehicles();
      } else {
        alert('Erro ao cadastrar veículo.');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    const deletedId = await removeVehicle(vehicleId, user.id);
    if (deletedId) {
      setVehicles(prev => prev.filter(v => v.vehicleId !== deletedId));
      alert('Veículo removido com sucesso.');
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <div>
      <VehicleForm newVehicle={newVehicle} setNewVehicle={setNewVehicle} onRegisterVehicle={handleRegisterVehicle} />
      <VehicleTable vehicles={vehicles} vehicleImages={vehicleImages} onRemoveVehicle={handleRemoveVehicle} />
    </div>
  );
};

export default ManageVehicles;
