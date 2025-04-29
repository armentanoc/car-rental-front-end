import React from 'react';

const VehicleForm = ({ newVehicle, setNewVehicle, onRegisterVehicle }) => {
  return (
    <div>
      <h3>Registrar Novo Veículo</h3>
      <input type="text" placeholder="Modelo" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} />
      <input type="text" placeholder="Marca" value={newVehicle.brand} onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })} />
      <input type="text" placeholder="Cor" value={newVehicle.color} onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })} />
      <input type="number" placeholder="Ano" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })} />
      <input type="text" placeholder="Placa" value={newVehicle.licensePlate} onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })} />
      <input type="text" placeholder="Número do Chassi" value={newVehicle.chassiNumber} onChange={(e) => setNewVehicle({ ...newVehicle, chassiNumber: e.target.value })} />
      <select value={newVehicle.fuelType} onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}>
        <option value="GASOLINE">Gasolina</option>
        <option value="ETHANOL">Etanol</option>
        <option value="ELECTRIC">Elétrico</option>
      </select>
      <input type="number" placeholder="Quilometragem" value={newVehicle.mileage} onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })} />
      <input type="text" placeholder="Características Adicionais" value={newVehicle.additionalFeatures} onChange={(e) => setNewVehicle({ ...newVehicle, additionalFeatures: e.target.value })} />
      <select value={newVehicle.status} onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}>
        <option value="ACTIVE">Ativo</option>
        <option value="INACTIVE">Inativo</option>
        <option value="PENDING">Pendente</option>
      </select>
      <select value={newVehicle.category} onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}>
        <option value="MOTORCYCLE">Motocicleta</option>
        <option value="VAN">Van</option>
        <option value="TRUCK">Caminhonete</option>
        <option value="ECONOMY">Econômico</option>
        <option value="LUXURY">Luxo</option>
        <option value="SUV">SUV</option>
      </select>
      <button className="input-button" onClick={onRegisterVehicle}>Cadastrar Veículo</button>
    </div>
  );
};

export default VehicleForm;
