import React from 'react';

const AvailableVehiclesTable = ({ vehicles, loading }) => {
  if (loading) return <p>Carregando veículos...</p>;
  if (vehicles.length === 0) return <p>Nenhum veículo encontrado.</p>;

  return (
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
          <th>Categoria</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map(vehicle => (
          <tr key={vehicle.id}>
            <td>{vehicle.id}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.color}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.licensePlate}</td>
            <td>{vehicle.fuelType}</td>
            <td>{vehicle.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AvailableVehiclesTable;
