import { useEffect, useState } from "react";
import { fetchAvailableVehicles, fetchVehicleImages as fetchVehicleImagesAPI } from "../../components/Client/api";
import VehicleCardGrid from "../../components/Client/VehicleCardGrid";
import VehicleFilters from "../../components/Client/VehicleFilters";
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

    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      alert("Datas inválidas. Verifique o período selecionado.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchAvailableVehicles({
        startDate: start,
        endDate: end,
        fuelType: filters.fuelType === "ALL" ? undefined : filters.fuelType,
        category: filters.category === "ALL" ? undefined : filters.category,
        startYear: filters.startYear ? parseInt(filters.startYear) : undefined,
        endYear: filters.endYear ? parseInt(filters.endYear) : undefined,
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
    setPage(0);
    fetchVehicles(0);
  };

  useEffect(() => {
    if (page > 0) {
      fetchVehicles(page);
    }
  }, [page]);

  useEffect(() => {
    fetchVehicles(0);
  }, []);

  return (
    <div className="available-vehicles-container">
      <h3>Veículos Disponíveis</h3>

      <VehicleFilters
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <VehicleCardGrid
        vehicles={vehicles}
        vehicleImages={vehicleImages}
        loading={loading}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AvailableVehicles;
