const BASE_URL = 'http://localhost:8090';

const fetchAvailableVehicles = async ({
  startDate = new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  endDate = new Date(Date.now() + 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000), // +1 month
  fuelType = null,
  startYear = null,
  endYear = null,
  category = null
} = {}) => {
  try {
    const requestBody = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      fuelType,
      startYear,
      endYear,
      category
    };

    const response = await fetch(`${BASE_URL}/rentals/available`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const responseLog = await response.json();
      console.error(responseLog.data);
      throw new Error('Erro ao buscar veículos disponíveis');
    }

    const availableVehicles = await response.json();
    return availableVehicles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchVehicleImages = async (vehicleId) => {
  try {
    const response = await fetch(`${BASE_URL}/vehicle-images/vehicle/${vehicleId}`, {
      method: 'GET',
      headers: { 'Accept': '*/*' },
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching vehicle images:', error);
    return [];
  }
};

export {
  fetchAvailableVehicles,
  fetchVehicleImages
};
