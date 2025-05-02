// src/pages/admin/ManageImages.js
import React, { useState } from 'react';
import { removeImage } from '../../components/Admin/api';
import { useAuth } from '../../context/AuthContext';
import ImageForm from '../../components/Admin/ImageForm';

const ManageImages = () => {
  const [newImage, setNewImage] = useState({ url: '', vehicleId: '', description: '' });
  const [vehicleImages, setVehicleImages] = useState({});
  useAuth();

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

  const fetchVehicleImages = async (vehicleId) => {
    try {
      const res = await fetch(`http://localhost:8090/vehicle-images/vehicle/${vehicleId}`, {
        method: 'GET',
        headers: { 'Accept': '*/*' },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setVehicleImages(prev => ({ ...prev, [vehicleId]: data }));
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    }
  };

  const handleRemoveImage = async (imageId, vehicleId) => {
    const deleted = await removeImage(imageId);
    if (deleted) {
      setVehicleImages(prev => ({
        ...prev,
        [vehicleId]: prev[vehicleId].filter(img => img.imageId !== imageId),
      }));
      alert('Imagem removida com sucesso!');
    }
  };

  return (
    <div>
      <ImageForm newImage={newImage} setNewImage={setNewImage} onAddImage={handleAddImageUrl} />
      {Object.entries(vehicleImages).map(([vehicleId, images]) => (
        <div key={vehicleId}>
          <h4>Imagens do veículo {vehicleId}</h4>
          <ul>
            {images.map(image => (
              <li key={image.imageId}>
                <img src={image.url} alt={image.description} width="120" />
                <p>{image.description}</p>
                <button onClick={() => handleRemoveImage(image.imageId, vehicleId)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ManageImages;
