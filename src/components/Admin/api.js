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

const handleRegisterVehicle = async () => {
  const { model, brand, licensePlate, year } = newVehicle;
  if (model && brand && licensePlate && year) {
    const res = await fetch('http://localhost:8090/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVehicle),
    });
    if (res.ok) {
      alert('Veículo registrado com sucesso!');
      setNewVehicle({
        model: '', brand: '', color: '', year: '', licensePlate: '',
        chassiNumber: '', fuelType: 'GASOLINE', mileage: '', additionalFeatures: '',
        status: 'ACTIVE', category: 'SUV'
      });
      await loadVehicles();
    } else {
      alert('Erro ao cadastrar veículo.');
    }
  } else {
    alert('Por favor, preencha todos os campos obrigatórios.');
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
    const response = await fetch(`http://localhost:8090/vehicle-images/vehicle/${vehicleId}`, {
      method: 'GET',
      headers: { 'Accept': '*/*' },
    });
    const data = await response.json();
    if (Array.isArray(data)) {
      setVehicleImages(prev => ({ ...prev, [vehicleId]: data }));
    }
  } catch (err) {
    console.error('Erro ao buscar imagens:', err);
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

const handleAddImageUrl = async () => {
  const { url, vehicleId, description } = newImage;
  if (!url || !vehicleId || !description) {
    alert('Por favor, preencha todos os campos da imagem.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8090/vehicle-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: JSON.stringify({ vehicleId, url, description }),
    });

    if (response.ok) {
      alert('Imagem adicionada com sucesso!');
      setNewImage({ url: '', vehicleId: '', description: '' });
      await fetchVehicleImages(vehicleId);
    } else {
      const errorData = await response.json();
      alert(`Erro ao adicionar imagem: ${errorData.message || 'Erro desconhecido'}`);
    }
  } catch (error) {
    console.error('Erro ao adicionar imagem:', error);
    alert('Erro ao adicionar imagem.');
  }
};

export {
  fetchUsers,
  fetchVehicles,
  removeUser,
  handleRegisterVehicle,
  removeVehicle,
  removeImage,
  fetchVehicleImages,
  addImage,
  handleAddImageUrl
};
