import React, { useState } from 'react';
import axios from 'axios';

const currentYear = new Date().getFullYear();

const AddVehicle = ({ onVehicleAdded }) => {
  const [vehicle, setVehicle] = useState({
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
    category: 'SUV',
  });

  const validateFields = () => {
    const year = Number(vehicle.year);
    const mileage = Number(vehicle.mileage);

    if (!vehicle.model || !vehicle.brand || !vehicle.licensePlate || !vehicle.chassiNumber) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (isNaN(year) || year < 1900 || year > currentYear) {
      alert(`Ano inválido. Deve estar entre 1900 e ${currentYear}.`);
      return false;
    }

    if (isNaN(mileage) || mileage <= 0) {
      alert('Quilometragem deve ser maior que zero.');
      return false;
    }

    return true;
  };

  const handleAddVehicle = async () => {
    if (!validateFields()) return;

    try {
      const payload = {
        ...vehicle,
        year: Number(vehicle.year),
        mileage: Number(vehicle.mileage),
      };

      await axios.post('http://localhost:8090/vehicles', payload);

      setVehicle({
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
        category: 'MOTORCYCLE',
      });

      alert('Veículo cadastrado com sucesso!');
      onVehicleAdded();
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      alert('Falha ao cadastrar o veículo. Tente novamente.');
    }
  };

  return (
    <div>
      <input type="text" placeholder="Modelo" value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} />
      <input type="text" placeholder="Marca" value={vehicle.brand} onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })} />
      <input type="text" placeholder="Cor" value={vehicle.color} onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })} />

      <input
        type="number"
        placeholder="Ano"
        value={vehicle.year}
        onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
        min="1900"
        max={currentYear}
      />

      <input type="text" placeholder="Placa" value={vehicle.licensePlate} onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })} />
      <input type="text" placeholder="Chassi" value={vehicle.chassiNumber} onChange={(e) => setVehicle({ ...vehicle, chassiNumber: e.target.value })} />

      <select value={vehicle.fuelType} onChange={(e) => setVehicle({ ...vehicle, fuelType: e.target.value })}>
        <option value="GASOLINE">Gasolina</option>
        <option value="ETHANOL">Etanol</option>
        <option value="ELECTRIC">Elétrico</option>
      </select>

      <input
        type="number"
        placeholder="Quilometragem"
        value={vehicle.mileage}
        onChange={(e) => setVehicle({ ...vehicle, mileage: e.target.value })}
        min="1"
      />

      <input type="text" placeholder="Características Adicionais" value={vehicle.additionalFeatures} onChange={(e) => setVehicle({ ...vehicle, additionalFeatures: e.target.value })} />

      <select value={vehicle.status} onChange={(e) => setVehicle({ ...vehicle, status: e.target.value })}>
        <option value="ACTIVE">Ativo</option>
        <option value="INACTIVE">Inativo</option>
        <option value="PENDING">Pendente</option>
      </select>

      <select value={vehicle.category} onChange={(e) => setVehicle({ ...vehicle, category: e.target.value })}>
        <option value="MOTORCYCLE">Motocicleta</option>
        <option value="VAN">Van</option>
        <option value="TRUCK">Caminhonete</option>
        <option value="ECONOMY">Econômico</option>
        <option value="LUXURY">Luxo</option>
        <option value="SUV">SUV</option>
      </select>

      <button onClick={handleAddVehicle}>Cadastrar Veículo</button>
    </div>
  );
};

export default AddVehicle;
