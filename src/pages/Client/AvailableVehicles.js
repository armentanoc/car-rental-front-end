import React, { useEffect, useState } from 'react';
import AvailableVehiclesTable from '../../components/Client/AvailableVehiclesTable';
import { fetchAvailableVehicles } from '../../components/Client/api';

const AvailableVehicles = () => {
  const nowPlus1h = new Date(Date.now() + 60 * 60 * 1000);
  const oneMonthLater = new Date(nowPlus1h.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [filters, setFilters] = useState({
    startDate: nowPlus1h.toISOString().slice(0, 16),
    endDate: oneMonthLater.toISOString().slice(0, 16),
    fuelType: 'ALL',
    startYear: '',
    endYear: '',
    category: 'ALL'
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    const result = await fetchAvailableVehicles({
      startDate: new Date(filters.startDate),
      endDate: new Date(filters.endDate),
      fuelType: filters.fuelType === 'ALL' ? null : filters.fuelType,
      startYear: filters.startYear ? parseInt(filters.startYear) : null,
      endYear: filters.endYear ? parseInt(filters.endYear) : null,
      category: filters.category === 'ALL' ? null : filters.category
    });
    setVehicles(result);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <h3>Veículos Disponíveis</h3>

      <div className="filters" style={{ marginBottom: '1rem' }}>
        <label>
          Início:
          <input
            type="datetime-local"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Fim:
          <input
            type="datetime-local"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Tipo de Combustível:
          <select name="fuelType" value={filters.fuelType} onChange={handleChange}>
            <option value="ALL">Todos</option>
            <option value="GASOLINE">Gasolina</option>
            <option value="ETHANOL">Etanol</option>
            <option value="ELECTRIC">Elétrico</option>
          </select>
        </label>
        <label>
          Ano Inicial:
          <input
            type="number"
            name="startYear"
            value={filters.startYear}
            onChange={handleChange}
          />
        </label>
        <label>
          Ano Final:
          <input
            type="number"
            name="endYear"
            max={2025}
            value={filters.endYear}
            onChange={handleChange}
          />
        </label>
        <label>
          Categoria:
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="ALL">Todas</option>
            <option value="MOTORCYCLE">Moto</option>
            <option value="VAN">Van</option>
            <option value="TRUCK">Caminhão</option>
            <option value="ECONOMY">Econômico</option>
            <option value="LUXURY">Luxo</option>
            <option value="SUV">SUV</option>
          </select>
        </label>
        <button onClick={handleSearch}>Buscar</button>
      </div>

      <AvailableVehiclesTable vehicles={vehicles} loading={loading} />
    </div>
  );
};

export default AvailableVehicles;
