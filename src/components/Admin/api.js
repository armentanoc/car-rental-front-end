// Handles all API requests for the Admin Dashboard

const BASE_URL = 'http://localhost:8090';

const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      const responseLog = await response.json();
      console.error(responseLog.data);
      throw new Error('Erro ao buscar usuários');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
    return []; 
  }
};

const fetchVehicles = async () => {
  try {
    const response = await fetch(`${BASE_URL}/vehicles`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar veículos');
    }

    const vehicles = await response.json();
    return vehicles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const removeUser = async (userId, adminId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminId }),
    });

    const responseLog = await response.json();
    console.log(responseLog.data);

    if (!response.ok) {
      throw new Error(responseLog.message);
    }

    return userId;
  } catch (error) {
    console.error(error);
    alert('Erro: ' + error.message);
    return null;
  }
};

const removeVehicle = async (vehicleId, adminId) => {
  try {
    const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao remover o veículo');
    }

    return vehicleId;
  } catch (error) {
    console.error(error);
    alert('Erro ao remover o veículo: ' + error.message);
    return null;
  }
};

const removeImage = async (imageId) => {
  try {
    const response = await fetch(`${BASE_URL}/vehicle-images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
      },
    });

    const responseLog = await response.json();
    console.log(responseLog.data);

    if (!response.ok) {
      throw new Error('Erro ao remover a imagem');
    }

    return imageId;
  } catch (error) {
    console.error(error);
    alert('Erro ao remover a imagem: ' + error.message);
    return null;
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

const addImage = async (newImage) => {
  try {
    const response = await fetch(`${BASE_URL}/vehicle-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(newImage),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(`Erro ao adicionar imagem: ${errorData.message || 'Erro desconhecido'}`);
    }
  } catch (error) {
    console.error('Erro ao adicionar imagem:', error);
    throw new Error('Erro ao adicionar imagem.');
  }
};

export {
  fetchUsers,
  fetchVehicles,
  removeUser,
  removeVehicle,
  removeImage,
  fetchVehicleImages,
  addImage,
};
