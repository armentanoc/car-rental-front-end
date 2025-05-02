// src/components/Admin/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

// ========== USER API ==========
const fetchUsers = () => apiRequest(`${BASE_URL}/users`);

const removeUser = (userId, adminId) => {
  if (!adminId) throw new Error('adminId is required');
  return apiRequest(`${BASE_URL}/users/${userId}`, 'POST', { adminId });
};

const updateUser = (userId, userData, adminId) => {
  if (!adminId) throw new Error('adminId is required');

  const filteredData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );

  return apiRequest(`${BASE_URL}/users/${userId}`, 'PATCH', {
    ...filteredData,
    adminId,
  });
};

// ========== VEHICLE API ==========
const fetchVehicles = () => apiRequest(`${BASE_URL}/vehicles`);

const registerVehicle = (vehicleData) =>
  apiRequest(`${BASE_URL}/vehicles`, 'POST', vehicleData);

const removeVehicle = (vehicleId, adminId) => {
  if (!adminId) throw new Error('adminId is required');
  return apiRequest(`${BASE_URL}/vehicles/${vehicleId}`, 'POST', { adminId });
};

// ========== IMAGE API ==========
const fetchVehicleImages = (vehicleId) =>
  apiRequest(`${BASE_URL}/vehicle-images/vehicle/${vehicleId}`);

const addImage = (newImage) =>
  apiRequest(`${BASE_URL}/vehicle-images`, 'POST', newImage);

const removeImage = (imageId) =>
  apiRequest(`${BASE_URL}/vehicle-images/${imageId}`, 'DELETE');

// ========== EXPORTS ==========
export const UserAPI = {
  fetchUsers,
  removeUser,
  updateUser,
};

export const VehicleAPI = {
  fetchVehicles,
  registerVehicle,
  removeVehicle,
};

export const ImageAPI = {
  fetchVehicleImages,
  addImage,
  removeImage,
};
