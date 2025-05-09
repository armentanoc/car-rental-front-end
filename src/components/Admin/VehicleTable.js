import React from 'react';

const VehicleTable = ({ vehicles, vehicleImages, onRemoveVehicle, onRemoveImage }) => {
  return (
    <div>
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
              <th className="hide-on-small">Cor</th> 
              <th>Ano</th>
              <th>Placa</th>
              <th>Valor da Diária</th>
              {/* <th>Combustível</th>
              <th>Quilometragem</th>
              <th>Categoria</th> */}
              <th>Imagens</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.vehicleId}>
                <td>{vehicle.vehicleId}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.brand}</td>
                <td className="hide-on-small">{vehicle.color}</td> 
                <td>{vehicle.year}</td>
                <td>{vehicle.licensePlate}</td>
                <td>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(vehicle.dailyRate)}
                </td>
                {/* <td>{vehicle.fuelType}</td>
                <td>{vehicle.mileage}</td>
                <td>{vehicle.category}</td> */}
                <td>
                  {vehicleImages[vehicle.vehicleId]?.length > 0 ? (
                    vehicleImages[vehicle.vehicleId].map((image, index) => (
                      <div key={index} style={{ marginBottom: '20px' }}>
                        <img
                          src={image.url}
                          alt={image.description}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <br />
                        <strong>Descrição:</strong> {image.description}
                        <br />
                        <strong>ID:</strong> {image.imageId}
                        <br />
                        <button className="remove-button" onClick={() => onRemoveImage(image.imageId, image.vehicleId)}>
                          Remover
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No images available</p> 
                  )}
                </td>
                <td>
                  <button className="remove-button" onClick={() => onRemoveVehicle(vehicle.vehicleId)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehicleTable;
