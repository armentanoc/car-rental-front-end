// src/pages/admin/ManageVehicles.js
import React, { useEffect, useState } from 'react';
import { VehicleAPI, ImageAPI } from '../../components/Admin/api'; 
import { useAuth } from '../../context/AuthContext';
import VehicleForm from '../../components/Admin/VehicleForm';
import VehicleTable from '../../components/Admin/VehicleTable';
import Pagination from '../../components/Pagination';

const ManageVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    model: '',
    brand: '',
    color: '',
    year: '',
    licensePlate: '',
    chassiNumber: '',
    fuelType: 'GASOLINE',
    mileage: '',
    additionalFeatures: '',
    dailyRate: '',
    status: 'ACTIVE',
    category: 'SUV'
  });

  const loadVehicles = async (pageNumber = 0) => {
    try {
      const data = await VehicleAPI.fetchVehicles(pageNumber, 20);
      setVehicles(data.content);
    data.content.forEach(vehicle => fetchVehicleImages(vehicle.vehicleId));
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      alert('Erro ao buscar veículos.');
    }
  };

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const data = await ImageAPI.fetchVehicleImages(vehicleId);
      if (Array.isArray(data)) {
        setVehicleImages(prev => ({ ...prev, [vehicleId]: data }));
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    }
  };

  const handleRegisterVehicle = async () => {
    const { model, brand, licensePlate, year, dailyRate} = newVehicle;

    if (model && brand && licensePlate && year && dailyRate) {
      try {
        newVehicle.dailyRate = newVehicle.dailyRate
        ? Number.parseFloat(newVehicle.dailyRate.replace("R$ ", "").replace(/\./g, "").replace(",", "."))
        : 0
        await VehicleAPI.registerVehicle(newVehicle);
        alert('Veículo registrado com sucesso!');
        setNewVehicle({
          model: '', brand: '', color: '', year: '', licensePlate: '',
          chassiNumber: '', fuelType: 'GASOLINE', mileage: '', additionalFeatures: '', dailyRate: '',
          status: 'ACTIVE', category: 'SUV'
        });
        setPage(0);
        await loadVehicles(0);
      } catch (err) {
        console.error(err);
        alert('Erro ao cadastrar veículo.');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    try {
      await VehicleAPI.removeVehicle(vehicleId, user.id);
      setVehicles(prev => prev.filter(v => v.vehicleId !== vehicleId));
      alert('Veículo removido com sucesso.');
    } catch (err) {
      console.error(err);
      alert('Erro ao remover veículo.');
    }
  };

  useEffect(() => {
    loadVehicles(page);
  }, [page]);

  return (
    <div>
      <VehicleForm
        newVehicle={newVehicle}
        setNewVehicle={setNewVehicle}
        onRegisterVehicle={handleRegisterVehicle}
      />

      <VehicleTable
        vehicles={vehicles}
        vehicleImages={vehicleImages}
        onRemoveVehicle={handleRemoveVehicle}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ManageVehicles;
