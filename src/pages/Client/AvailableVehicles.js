import { useEffect, useState } from "react";
import { fetchAvailableVehicles, fetchVehicleImages as fetchVehicleImagesAPI } from "../../components/Client/api";
import VehicleCardGrid from "../../components/Client/VehicleCardGrid";
import Pagination from "../../components/Pagination";

const GRID_SIZE = 9;

const AvailableVehicles = () => {
  const nowPlus1h = new Date(Date.now() + 60 * 60 * 1000);
  const oneMonthLater = new Date(nowPlus1h.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [filters, setFilters] = useState({
    startDate: nowPlus1h.toISOString().slice(0, 16),
    endDate: oneMonthLater.toISOString().slice(0, 16),
    fuelType: "ALL",
    startYear: "",
    endYear: "",
    category: "ALL",
  });
  
  // Keep track of the active filters separately from the form state
  const [activeFilters, setActiveFilters] = useState({
    startDate: nowPlus1h.toISOString().slice(0, 16),
    endDate: oneMonthLater.toISOString().slice(0, 16),
    fuelType: "ALL",
    startYear: "",
    endYear: "",
    category: "ALL",
  });

  const [vehicles, setVehicles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadVehicleImages = async (vehicleList) => {
    try {
      const imagesMap = {};
      const imagePromises = vehicleList.map(async (vehicle) => {
        const images = await fetchVehicleImagesAPI(vehicle.id);
        imagesMap[vehicle.id] = images;
      });

      await Promise.all(imagePromises); 
      setVehicleImages(imagesMap); 
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    }
  };

  const fetchVehicles = async (targetPage = 0) => {
    setLoading(true);

    const start = new Date(activeFilters.startDate);
    const end = new Date(activeFilters.endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      alert("Datas inválidas. Verifique o período selecionado.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchAvailableVehicles({
        startDate: start,
        endDate: end,
        fuelType: activeFilters.fuelType === "ALL" ? undefined : activeFilters.fuelType,
        category: activeFilters.category === "ALL" ? undefined : activeFilters.category,
        startYear: activeFilters.startYear ? parseInt(activeFilters.startYear) : undefined,
        endYear: activeFilters.endYear ? parseInt(activeFilters.endYear) : undefined,
        page: targetPage,
        size: GRID_SIZE,
      });

      setVehicles(result.content);
      setTotalPages(result.totalPages);
      await loadVehicleImages(result.content);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = () => {
    // Apply the current form filters to the active filters
    setActiveFilters(filters);
    setPage(0);
    fetchVehicles(0);
  };

  // Only runs on component mount and when page changes
  useEffect(() => {
    if (page > 0) {
      fetchVehicles(page);
    }
  }, [page]);
  
  // Initial load on component mount
  useEffect(() => {
    fetchVehicles(0);
  }, []);

  return (
    <div className="available-vehicles-container">
      <h3>Veículos Disponíveis</h3>
      <div className="filter-bar">
        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="startDate">Início:</label>
            <input
              id="startDate"
              type="datetime-local"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-item">
            <label htmlFor="endDate">Fim:</label>
            <input
              id="endDate"
              type="datetime-local"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="fuelType">Combustível:</label>
            <select id="fuelType" name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
              <option value="ALL">Todos</option>
              <option value="GASOLINE">Gasolina</option>
              <option value="ETHANOL">Etanol</option>
              <option value="ELECTRIC">Elétrico</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="category">Categoria:</label>
            <select id="category" name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="ALL">Todas</option>
              <option value="MOTORCYCLE">Moto</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Caminhão</option>
              <option value="ECONOMY">Econômico</option>
              <option value="LUXURY">Luxo</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="startYear">Ano Inicial:</label>
            <input
              id="startYear"
              type="number"
              name="startYear"
              value={filters.startYear}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="endYear">Ano Final:</label>
            <input
              id="endYear"
              type="number"
              name="endYear"
              max={new Date().getFullYear()}
              value={filters.endYear}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <button
          className="search-button"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      <VehicleCardGrid
        vehicles={vehicles}
        vehicleImages={vehicleImages}
        loading={loading}
        startDate={activeFilters.startDate}
        endDate={activeFilters.endDate}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AvailableVehicles;