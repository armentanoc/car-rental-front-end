// src/components/Admin/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

// ========== USER API ==========
const fetchUsers = (page = 0, size = 20) => {
  return apiRequest(`${BASE_URL}/users?page=${page}&size=${size}&sort=id,asc`);
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

const removeUser = (userId, adminId) => {
  if (!adminId) throw new Error('adminId is required');
  return apiRequest(`${BASE_URL}/users/${userId}`, 'POST', { adminId });
};

// ========== VEHICLE API ==========

const fetchVehicles = (page = 0, size = 20) =>
  apiRequest(`${BASE_URL}/vehicles?page=${page}&size=${size}&sort=id,asc`);

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
