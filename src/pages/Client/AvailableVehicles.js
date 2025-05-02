"use client"

import { useEffect, useState } from "react"
import { fetchAvailableVehicles, fetchVehicleImages } from "../../components/Client/api"
import VehicleCardGrid from "../../components/Client/VehicleCardGrid"

const AvailableVehicles = () => {
  const nowPlus1h = new Date(Date.now() + 60 * 60 * 1000)
  const oneMonthLater = new Date(nowPlus1h.getTime() + 30 * 24 * 60 * 60 * 1000)

  const [filters, setFilters] = useState({
    startDate: nowPlus1h.toISOString().slice(0, 16),
    endDate: oneMonthLater.toISOString().slice(0, 16),
    fuelType: "ALL",
    startYear: "",
    endYear: "",
    category: "ALL",
  })

  const [vehicles, setVehicles] = useState([])
  const [vehicleImages, setVehicleImages] = useState({})
  const [loading, setLoading] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async () => {
    setLoading(true)
    const result = await fetchAvailableVehicles({
      startDate: new Date(filters.startDate),
      endDate: new Date(filters.endDate),
      fuelType: filters.fuelType === "ALL" ? null : filters.fuelType,
      startYear: filters.startYear ? Number.parseInt(filters.startYear) : null,
      endYear: filters.endYear ? Number.parseInt(filters.endYear) : null,
      category: filters.category === "ALL" ? null : filters.category,
    })
    setVehicles(result)

    const imagesMap = {}
    await Promise.all(
      result.map(async (vehicle) => {
        const images = await fetchVehicleImages(vehicle.id)
        imagesMap[vehicle.id] = images  
      })
    )

setVehicleImages(imagesMap)


    setVehicleImages(imagesMap)
    setLoading(false)
  }

  useEffect(() => {
    handleSearch()
  }, [])

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
              onChange={handleChange}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="endDate">Fim:</label>
            <input id="endDate" type="datetime-local" name="endDate" value={filters.endDate} onChange={handleChange} />
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="fuelType">Combustível:</label>
            <select id="fuelType" name="fuelType" value={filters.fuelType} onChange={handleChange}>
              <option value="ALL">Todos</option>
              <option value="GASOLINE">Gasolina</option>
              <option value="ETHANOL">Etanol</option>
              <option value="ELECTRIC">Elétrico</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="category">Categoria:</label>
            <select id="category" name="category" value={filters.category} onChange={handleChange}>
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
            <input id="startYear" type="number" name="startYear" value={filters.startYear} onChange={handleChange} />
          </div>

          <div className="filter-item">
            <label htmlFor="endYear">Ano Final:</label>
            <input
              id="endYear"
              type="number"
              name="endYear"
              max={2025}
              value={filters.endYear}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="search-button" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      <VehicleCardGrid
        vehicles={vehicles}
        vehicleImages={vehicleImages}
        loading={loading}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />
    </div>
  )
}

export default AvailableVehicles
